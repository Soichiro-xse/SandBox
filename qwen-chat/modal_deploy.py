"""
Qwen3.5-35B-A3B Uncensored — Modal デプロイスクリプト

ghcr.io/ggml-org/llama.cpp の公式CUDAイメージを使用。
llama-server が内蔵 (OpenAI互換)。

使い方:
  modal deploy modal_deploy.py
"""

import modal

REPO_ID = "HauhauCS/Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive"
FILENAME = "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q4_K_M.gguf"
MODEL_DIR = "/models"

volume = modal.Volume.from_name("qwen-models", create_if_missing=True)

image = (
    modal.Image.from_registry(
        "ghcr.io/ggml-org/llama.cpp:server-cuda",
        add_python="3.11",
        setup_dockerfile_commands=["ENTRYPOINT []"],
    )
    .pip_install("huggingface-hub", "requests", "fastapi[standard]")
)

app = modal.App("qwen-chat", image=image)


@app.cls(
    gpu="A10G",
    scaledown_window=300,
    volumes={MODEL_DIR: volume},
    timeout=600,
)
@modal.concurrent(max_inputs=8)
class Model:
    @modal.enter()
    def start_server(self):
        import os
        import subprocess
        import time

        import requests
        from huggingface_hub import hf_hub_download

        model_path = os.path.join(MODEL_DIR, FILENAME)
        min_size = 15 * 1024 * 1024 * 1024
        if not os.path.exists(model_path) or os.path.getsize(model_path) < min_size:
            print(f"Downloading {FILENAME}...")
            if os.path.exists(model_path):
                os.remove(model_path)
            hf_hub_download(
                repo_id=REPO_ID,
                filename=FILENAME,
                local_dir=MODEL_DIR,
            )
            volume.commit()
            print("Download complete.")

        fsize = os.path.getsize(model_path) / (1024**3)
        print(f"Model: {fsize:.2f} GB")

        # Start llama-server on localhost:8080
        self.proc = subprocess.Popen(
            [
                "/app/llama-server",
                "--model", model_path,
                "--host", "127.0.0.1",
                "--port", "8080",
                "--n-gpu-layers", "-1",
                "--ctx-size", "4096",
                "--threads", "4",
            ],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )

        # Wait for server to be ready
        for i in range(180):
            try:
                r = requests.get("http://127.0.0.1:8080/health", timeout=2)
                if r.status_code == 200:
                    print(f"llama-server ready after {i}s")
                    return
            except Exception:
                pass
            time.sleep(1)

        raise RuntimeError("llama-server failed to start")

    @modal.exit()
    def stop_server(self):
        if hasattr(self, "proc"):
            self.proc.terminate()

    @modal.fastapi_endpoint(method="POST", docs=True)
    def chat(self, request: dict):
        import requests

        resp = requests.post(
            "http://127.0.0.1:8080/v1/chat/completions",
            json=request,
            timeout=300,
        )
        return resp.json()

    @modal.fastapi_endpoint(method="GET", docs=True)
    def models(self):
        import requests

        resp = requests.get("http://127.0.0.1:8080/v1/models", timeout=10)
        return resp.json()

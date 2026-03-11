"""
Qwen3.5-35B-A3B Uncensored — Modal デプロイスクリプト

使い方:
  1. pip install modal
  2. modal setup  (初回のみ、ブラウザでログイン)
  3. modal deploy modal_deploy.py

デプロイ後、表示されるURLに /chat でリクエスト可能。
OpenAI SDK互換。
"""

import modal

REPO_ID = "HauhauCS/Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive"
FILENAME = "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q4_K_M.gguf"
MODEL_DIR = "/models"

volume = modal.Volume.from_name("qwen-models", create_if_missing=True)

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install("huggingface-hub", "fastapi[standard]")
    .run_commands(
        "pip install llama-cpp-python"
        " --extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cu124"
    )
)

app = modal.App("qwen-chat", image=image)


@app.cls(
    gpu="A10G",
    scaledown_window=300,
    volumes={MODEL_DIR: volume},
)
@modal.concurrent(max_inputs=4)
class Model:
    @modal.enter()
    def load(self):
        import os

        from huggingface_hub import hf_hub_download
        from llama_cpp import Llama

        model_path = os.path.join(MODEL_DIR, FILENAME)
        if not os.path.exists(model_path):
            print(f"Downloading {FILENAME}...")
            hf_hub_download(
                repo_id=REPO_ID,
                filename=FILENAME,
                local_dir=MODEL_DIR,
            )
            volume.commit()
            print("Download complete, saved to volume.")

        self.llm = Llama(
            model_path=model_path,
            n_ctx=8192,
            n_gpu_layers=-1,
            verbose=False,
        )
        print("Model loaded!")

    @modal.fastapi_endpoint(method="POST", docs=True)
    def chat(self, request: dict):
        import time
        import uuid

        messages = request.get("messages", [])
        temperature = request.get("temperature", 0.7)
        top_p = request.get("top_p", 0.8)
        top_k = request.get("top_k", 20)
        repeat_penalty = request.get("repeat_penalty", 1.5)
        max_tokens = request.get("max_tokens", 2048)

        response = self.llm.create_chat_completion(
            messages=messages,
            temperature=temperature,
            top_p=top_p,
            top_k=top_k,
            repeat_penalty=repeat_penalty,
            max_tokens=max_tokens,
        )

        return {
            "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": "qwen3.5-35b-a3b",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": response["choices"][0]["message"]["content"],
                    },
                    "finish_reason": response["choices"][0].get(
                        "finish_reason", "stop"
                    ),
                }
            ],
            "usage": response.get("usage", {}),
        }

    @modal.fastapi_endpoint(method="GET", docs=True)
    def models(self):
        import time

        return {
            "object": "list",
            "data": [
                {
                    "id": "qwen3.5-35b-a3b",
                    "object": "model",
                    "created": int(time.time()),
                    "owned_by": "self-hosted",
                }
            ],
        }

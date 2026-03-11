"""
Qwen3.5-35B-A3B Uncensored — Modal デプロイスクリプト

使い方:
  1. pip install modal
  2. modal setup  (初回のみ、ブラウザでログイン)
  3. modal deploy modal_deploy.py

デプロイ後、表示されるURLに /v1/chat/completions でリクエスト可能。
OpenAI SDK互換。
"""

import modal

REPO_ID = "HauhauCS/Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive"
FILENAME = "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q4_K_M.gguf"
MODEL_DIR = "/models"

image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "llama-cpp-python",
        "huggingface-hub",
        "fastapi[standard]",
    )
    .run_commands(
        f"huggingface-cli download {REPO_ID} {FILENAME} --local-dir {MODEL_DIR}"
    )
)

app = modal.App("qwen-chat", image=image)


@app.cls(
    gpu="A10G",
    container_idle_timeout=300,  # 5分アイドルでスケールゼロ
    allow_concurrent_inputs=4,
)
class Model:
    @modal.enter()
    def load(self):
        from llama_cpp import Llama

        self.llm = Llama(
            model_path=f"{MODEL_DIR}/{FILENAME}",
            n_ctx=8192,
            n_gpu_layers=-1,
            verbose=False,
        )

    @modal.web_endpoint(method="POST", docs=True)
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

    @modal.web_endpoint(method="GET", docs=True)
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

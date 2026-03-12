#!/usr/bin/env python3
"""Qwen3.5-35B-A3B OpenAI互換APIサーバー"""

import argparse
import time
import uuid
from typing import AsyncIterator

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from llama_cpp import Llama
from pydantic import BaseModel, Field

from config import (
    API_HOST,
    API_PORT,
    DEFAULT_QUANT,
    MODEL_DIR,
    N_CTX,
    N_GPU_LAYERS,
    N_THREADS,
    QUANTS,
    VERBOSE,
)

app = FastAPI(title="Qwen3.5-35B-A3B API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

llm: Llama | None = None


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    model: str = "qwen3.5-35b-a3b"
    messages: list[Message]
    temperature: float = 0.7
    top_p: float = 0.8
    top_k: int = 20
    min_p: float = 0.0
    repeat_penalty: float = 1.5
    max_tokens: int = Field(default=2048, alias="max_tokens")
    stream: bool = False


class ChatChoice(BaseModel):
    index: int = 0
    message: Message
    finish_reason: str = "stop"


class Usage(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0


class ChatResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str = "qwen3.5-35b-a3b"
    choices: list[ChatChoice]
    usage: Usage


@app.get("/v1/models")
def list_models():
    return {
        "object": "list",
        "data": [
            {
                "id": "qwen3.5-35b-a3b",
                "object": "model",
                "created": int(time.time()),
                "owned_by": "HauhauCS",
            }
        ],
    }


@app.post("/v1/chat/completions")
async def chat_completions(request: ChatRequest):
    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    if request.stream:
        return StreamingResponse(
            _stream_response(messages, request),
            media_type="text/event-stream",
        )

    response = llm.create_chat_completion(
        messages=messages,
        temperature=request.temperature,
        top_p=request.top_p,
        top_k=request.top_k,
        min_p=request.min_p,
        repeat_penalty=request.repeat_penalty,
        max_tokens=request.max_tokens,
    )

    return ChatResponse(
        id=f"chatcmpl-{uuid.uuid4().hex[:8]}",
        created=int(time.time()),
        choices=[
            ChatChoice(
                message=Message(
                    role="assistant",
                    content=response["choices"][0]["message"]["content"],
                ),
                finish_reason=response["choices"][0].get("finish_reason", "stop"),
            )
        ],
        usage=Usage(
            prompt_tokens=response.get("usage", {}).get("prompt_tokens", 0),
            completion_tokens=response.get("usage", {}).get("completion_tokens", 0),
            total_tokens=response.get("usage", {}).get("total_tokens", 0),
        ),
    )


async def _stream_response(messages: list[dict], request: ChatRequest) -> AsyncIterator[str]:
    import json

    response = llm.create_chat_completion(
        messages=messages,
        temperature=request.temperature,
        top_p=request.top_p,
        top_k=request.top_k,
        min_p=request.min_p,
        repeat_penalty=request.repeat_penalty,
        max_tokens=request.max_tokens,
        stream=True,
    )

    resp_id = f"chatcmpl-{uuid.uuid4().hex[:8]}"

    for chunk in response:
        delta = chunk["choices"][0]["delta"]
        data = {
            "id": resp_id,
            "object": "chat.completion.chunk",
            "created": int(time.time()),
            "model": "qwen3.5-35b-a3b",
            "choices": [
                {
                    "index": 0,
                    "delta": delta,
                    "finish_reason": chunk["choices"][0].get("finish_reason"),
                }
            ],
        }
        yield f"data: {json.dumps(data)}\n\n"

    yield "data: [DONE]\n\n"


def main():
    global llm

    parser = argparse.ArgumentParser(description="Qwen3.5-35B-A3B APIサーバー")
    parser.add_argument("--quant", default=DEFAULT_QUANT, choices=list(QUANTS.keys()))
    parser.add_argument("--host", default=API_HOST)
    parser.add_argument("--port", type=int, default=API_PORT)
    args = parser.parse_args()

    filename = QUANTS[args.quant]
    model_path = MODEL_DIR / filename

    if not model_path.exists():
        print(f"モデルが見つかりません: {model_path}")
        print("先にダウンロードしてください: python download.py")
        return

    print(f"モデル読み込み中: {filename}...")
    llm = Llama(
        model_path=str(model_path),
        n_ctx=N_CTX,
        n_gpu_layers=N_GPU_LAYERS,
        n_threads=N_THREADS,
        verbose=VERBOSE,
    )
    print(f"サーバー起動: http://{args.host}:{args.port}")

    uvicorn.run(app, host=args.host, port=args.port)


if __name__ == "__main__":
    main()

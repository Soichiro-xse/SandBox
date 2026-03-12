#!/usr/bin/env python3
"""Qwen3.5-35B-A3B チャットCLI"""

import argparse
import sys

from llama_cpp import Llama
from rich.console import Console
from rich.markdown import Markdown
from rich.panel import Panel

from config import (
    DEFAULT_PRESET,
    DEFAULT_QUANT,
    MODEL_DIR,
    N_CTX,
    N_GPU_LAYERS,
    N_THREADS,
    PRESETS,
    QUANTS,
    VERBOSE,
)

console = Console()


def load_model(quant: str = DEFAULT_QUANT) -> Llama:
    filename = QUANTS[quant]
    model_path = MODEL_DIR / filename

    if not model_path.exists():
        console.print(f"[red]モデルが見つかりません: {model_path}[/red]")
        console.print("先にダウンロードしてください: python download.py")
        sys.exit(1)

    console.print(f"[dim]モデル読み込み中: {filename}...[/dim]")

    llm = Llama(
        model_path=str(model_path),
        n_ctx=N_CTX,
        n_gpu_layers=N_GPU_LAYERS,
        n_threads=N_THREADS,
        verbose=VERBOSE,
    )

    console.print("[green]モデル準備完了[/green]\n")
    return llm


def chat_loop(llm: Llama, preset: str = DEFAULT_PRESET, system_prompt: str | None = None):
    params = PRESETS[preset]
    messages: list[dict] = []

    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})

    console.print(
        Panel(
            f"プリセット: [cyan]{preset}[/cyan] | "
            f"Ctrl+C で終了 | "
            f"'clear' でリセット | "
            f"'preset <名前>' で切替",
            title="Qwen3.5-35B-A3B Chat",
            border_style="blue",
        )
    )

    while True:
        try:
            user_input = console.input("[bold green]あなた>[/bold green] ").strip()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]終了します[/dim]")
            break

        if not user_input:
            continue

        if user_input.lower() == "clear":
            messages.clear()
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            console.print("[dim]会話をリセットしました[/dim]")
            continue

        if user_input.lower().startswith("preset "):
            new_preset = user_input.split(" ", 1)[1]
            if new_preset in PRESETS:
                params = PRESETS[new_preset]
                preset = new_preset
                console.print(f"[dim]プリセット変更: {preset}[/dim]")
            else:
                console.print(f"[red]無効なプリセット。利用可能: {', '.join(PRESETS.keys())}[/red]")
            continue

        messages.append({"role": "user", "content": user_input})

        try:
            response = llm.create_chat_completion(
                messages=messages,
                temperature=params["temperature"],
                top_p=params["top_p"],
                top_k=params["top_k"],
                min_p=params["min_p"],
                repeat_penalty=params["repeat_penalty"],
                stream=True,
            )

            console.print("[bold magenta]Qwen>[/bold magenta] ", end="")
            full_response = ""
            for chunk in response:
                delta = chunk["choices"][0]["delta"]
                if "content" in delta and delta["content"]:
                    text = delta["content"]
                    full_response += text
                    console.print(text, end="", highlight=False)

            console.print()  # 改行

            if full_response:
                messages.append({"role": "assistant", "content": full_response})

        except Exception as e:
            console.print(f"\n[red]エラー: {e}[/red]")
            messages.pop()  # ユーザーメッセージを削除


def main():
    parser = argparse.ArgumentParser(description="Qwen3.5-35B-A3B チャット")
    parser.add_argument("--quant", default=DEFAULT_QUANT, choices=list(QUANTS.keys()))
    parser.add_argument("--preset", default=DEFAULT_PRESET, choices=list(PRESETS.keys()))
    parser.add_argument("--system", type=str, default=None, help="システムプロンプト")
    parser.add_argument("--ctx", type=int, default=None, help="コンテキスト長の上書き")
    args = parser.parse_args()

    if args.ctx:
        import config
        config.N_CTX = args.ctx

    llm = load_model(args.quant)
    chat_loop(llm, args.preset, args.system)


if __name__ == "__main__":
    main()

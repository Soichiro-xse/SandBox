#!/usr/bin/env python3
"""Qwen3.5-35B-A3B GGUFモデルのダウンロード"""

import argparse
import sys

from huggingface_hub import hf_hub_download

from config import DEFAULT_QUANT, MODEL_DIR, QUANTS, REPO_ID


def download_model(quant: str = DEFAULT_QUANT) -> str:
    if quant not in QUANTS:
        print(f"エラー: 無効な量子化レベル '{quant}'")
        print(f"利用可能: {', '.join(QUANTS.keys())}")
        sys.exit(1)

    filename = QUANTS[quant]
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    print(f"ダウンロード中: {filename}")
    print(f"保存先: {MODEL_DIR}")

    path = hf_hub_download(
        repo_id=REPO_ID,
        filename=filename,
        local_dir=str(MODEL_DIR),
    )

    print(f"完了: {path}")
    return path


def main():
    parser = argparse.ArgumentParser(description="Qwen3.5-35B-A3B モデルダウンロード")
    parser.add_argument(
        "--quant",
        default=DEFAULT_QUANT,
        choices=list(QUANTS.keys()),
        help=f"量子化レベル (デフォルト: {DEFAULT_QUANT})",
    )
    args = parser.parse_args()
    download_model(args.quant)


if __name__ == "__main__":
    main()

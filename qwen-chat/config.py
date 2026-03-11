"""Qwen3.5-35B-A3B モデル設定"""

import os
from pathlib import Path

# モデル情報
REPO_ID = "HauhauCS/Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive"
MODEL_DIR = Path(os.environ.get("QWEN_MODEL_DIR", Path(__file__).parent / "models"))

# 利用可能な量子化レベル
QUANTS = {
    "Q4_K_M": "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q4_K_M.gguf",
    "Q6_K": "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q6_K.gguf",
    "Q3_K_M": "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q3_K_M.gguf",
    "Q5_K_M": "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q5_K_M.gguf",
    "Q8_0": "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-Q8_0.gguf",
    "IQ4_XS": "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-IQ4_XS.gguf",
    "IQ3_M": "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-IQ3_M.gguf",
    "IQ2_M": "Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive-IQ2_M.gguf",
}
DEFAULT_QUANT = "Q4_K_M"

# 推論設定プリセット
PRESETS = {
    "creative": {
        "temperature": 1.0,
        "top_p": 0.95,
        "top_k": 20,
        "min_p": 0.0,
        "repeat_penalty": 1.5,
    },
    "precise": {
        "temperature": 0.6,
        "top_p": 0.95,
        "top_k": 20,
        "min_p": 0.0,
        "repeat_penalty": 1.0,
    },
    "chat": {
        "temperature": 0.7,
        "top_p": 0.8,
        "top_k": 20,
        "min_p": 0.0,
        "repeat_penalty": 1.5,
    },
    "reasoning": {
        "temperature": 1.0,
        "top_p": 1.0,
        "top_k": 40,
        "min_p": 0.0,
        "repeat_penalty": 2.0,
    },
}
DEFAULT_PRESET = "chat"

# llama.cpp 設定
N_CTX = 8192  # コンテキスト長（メモリに合わせて調整）
N_GPU_LAYERS = -1  # -1 = 全レイヤーGPUオフロード、0 = CPUのみ
N_THREADS = None  # None = 自動検出
VERBOSE = False

# APIサーバー設定
API_HOST = "0.0.0.0"
API_PORT = 8000

# Qwen3.5-35B-A3B チャット環境

[Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive](https://huggingface.co/HauhauCS/Qwen3.5-35B-A3B-Uncensored-HauhauCS-Aggressive) をローカルまたはKaggle/Colabで動かすためのツール群。

## 必要スペック

| 量子化 | GGUF サイズ | 必要メモリ |
|--------|-----------|-----------|
| IQ2_M | 11GB | ~13GB |
| Q4_K_M | 20GB | ~22GB |
| Q6_K | 27GB | ~29GB |

GPU推奨。CPUのみでも動くが非常に遅い。

## セットアップ

```bash
pip install -r requirements.txt
```

## モデルダウンロード

```bash
# デフォルト (Q4_K_M)
python download.py

# 別の量子化レベル
python download.py --quant IQ2_M
python download.py --quant Q6_K
```

## チャットCLI

```bash
python chat.py

# オプション
python chat.py --quant IQ2_M --preset creative --system "あなたは..."
python chat.py --ctx 4096  # コンテキスト長を短くしてメモリ節約
```

### プリセット

- `chat` - 通常の会話 (デフォルト)
- `creative` - 創造的な生成
- `precise` - コード・正確さ重視
- `reasoning` - 推論タスク

### チャット内コマンド

- `clear` - 会話履歴リセット
- `preset <名前>` - プリセット切替

## APIサーバー (OpenAI互換)

```bash
python server.py

# カスタム設定
python server.py --quant Q4_K_M --port 8000
```

### APIの使い方

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "こんにちは"}],
    "temperature": 0.7,
    "stream": false
  }'
```

OpenAI SDK互換なので、`base_url` を変えるだけで既存コードから使える：

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="dummy")
response = client.chat.completions.create(
    model="qwen3.5-35b-a3b",
    messages=[{"role": "user", "content": "こんにちは"}],
)
```

## Modal デプロイ (クラウドAPI)

GPU不要のPCからでもデプロイ可能。ModalのA10GでAPI化される。

```bash
pip install modal
modal setup        # 初回のみ（ブラウザでログイン）
modal deploy modal_deploy.py
```

デプロイ後に表示されるURLでAPIが使える：

```bash
curl https://YOUR_APP.modal.run/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "こんにちは"}]}'
```

OpenAI SDK からも使える：

```python
from openai import OpenAI

client = OpenAI(base_url="https://YOUR_APP.modal.run", api_key="dummy")
response = client.chat.completions.create(
    model="qwen3.5-35b-a3b",
    messages=[{"role": "user", "content": "こんにちは"}],
)
```

月$30の無料枠あり。個人利用なら十分。

## Kaggle / Colab

`qwen_kaggle.ipynb` をアップロードして GPU T4 x2 で実行。Gradio UIが起動するのでスマホからでも使える。

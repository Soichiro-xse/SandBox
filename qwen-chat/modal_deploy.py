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

CHAT_HTML = r"""<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Qwen Chat</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #1a1a2e;
  color: #eee;
  height: 100dvh;
  display: flex;
  flex-direction: column;
}
#header {
  padding: 12px 16px;
  background: #16213e;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 10px;
}
#header h1 { font-size: 16px; flex: 1; }
#clear-btn {
  background: #333;
  border: none;
  color: #ccc;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}
#messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.msg {
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
}
.msg.user {
  align-self: flex-end;
  background: #e94560;
  border-bottom-right-radius: 4px;
}
.msg.assistant {
  align-self: flex-start;
  background: #16213e;
  border-bottom-left-radius: 4px;
}
.msg.system-msg {
  align-self: center;
  background: #333;
  font-size: 13px;
  color: #aaa;
  border-radius: 8px;
}
#input-area {
  padding: 10px 12px;
  background: #16213e;
  border-top: 1px solid #333;
  display: flex;
  gap: 8px;
}
#input {
  flex: 1;
  background: #0f3460;
  border: none;
  color: #eee;
  padding: 10px 14px;
  border-radius: 20px;
  font-size: 15px;
  outline: none;
  resize: none;
  max-height: 120px;
  line-height: 1.4;
}
#input::placeholder { color: #888; }
#send-btn {
  background: #e94560;
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
#send-btn:disabled { opacity: 0.4; }
.typing { opacity: 0.6; animation: pulse 1s infinite; }
@keyframes pulse { 50% { opacity: 0.3; } }
</style>
</head>
<body>

<div id="header">
  <h1>Qwen Chat</h1>
  <button id="clear-btn" onclick="clearChat()">クリア</button>
</div>

<div id="messages"></div>

<div id="input-area">
  <textarea id="input" rows="1" placeholder="メッセージを入力..." enterkeyhint="send"></textarea>
  <button id="send-btn" onclick="send()">&#9654;</button>
</div>

<script>
// API URL is same origin
const STREAM_URL = window.location.origin + '/chat_stream';
let history = [];
let busy = false;

const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send-btn');

inputEl.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
});

inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

function addMsg(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

function clearChat() {
  history = [];
  messagesEl.innerHTML = '';
  addMsg('system-msg', '会話をリセットしました');
}

async function send() {
  if (busy) return;
  const text = inputEl.value.trim();
  if (!text) return;

  inputEl.value = '';
  inputEl.style.height = 'auto';
  addMsg('user', text);

  history.push({ role: 'user', content: text });

  busy = true;
  sendBtn.disabled = true;
  const replyEl = addMsg('assistant typing', '');

  try {
    const res = await fetch(STREAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history,
        temperature: 0.7,
        max_tokens: 2048,
        stream: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              replyEl.textContent = fullText;
              replyEl.classList.remove('typing');
              messagesEl.scrollTop = messagesEl.scrollHeight;
            }
          } catch (e) { /* skip */ }
        }
      }

      if (fullText) {
        history.push({ role: 'assistant', content: fullText });
      } else {
        replyEl.textContent = '(空の応答)';
        replyEl.classList.remove('typing');
        history.pop();
      }
    } else {
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || JSON.stringify(data);
      replyEl.textContent = reply;
      replyEl.classList.remove('typing');
      history.push({ role: 'assistant', content: reply });
    }
  } catch (e) {
    replyEl.textContent = 'エラー: ' + e.message;
    replyEl.classList.remove('typing');
    replyEl.classList.remove('assistant');
    replyEl.classList.add('system-msg');
    history.pop();
  } finally {
    busy = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }
}
</script>
</body>
</html>"""


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

    @modal.fastapi_endpoint(method="GET", docs=True)
    def ui(self) -> str:
        """Chat UI - ブラウザでアクセスするだけでチャットできる"""
        from fastapi import Response

        return Response(content=CHAT_HTML, media_type="text/html")

    @modal.fastapi_endpoint(method="POST", docs=True)
    def chat(self, request: dict):
        """Non-streaming chat endpoint."""
        import requests

        resp = requests.post(
            "http://127.0.0.1:8080/v1/chat/completions",
            json=request,
            timeout=300,
        )
        return resp.json()

    @modal.fastapi_endpoint(method="POST", docs=True)
    def chat_stream(self, request: dict):
        """Streaming chat endpoint. Returns SSE stream."""
        import requests
        from fastapi.responses import StreamingResponse

        request["stream"] = True

        resp = requests.post(
            "http://127.0.0.1:8080/v1/chat/completions",
            json=request,
            stream=True,
            timeout=300,
        )

        def generate():
            for line in resp.iter_lines():
                if line:
                    yield line.decode("utf-8") + "\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no",
            },
        )

    @modal.fastapi_endpoint(method="GET", docs=True)
    def models(self):
        import requests

        resp = requests.get("http://127.0.0.1:8080/v1/models", timeout=10)
        return resp.json()

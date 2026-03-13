# CLAUDE.md

This file provides guidance for AI assistants working with this repository.

## Repository Overview

**SandBox** is a personal experimentation repository containing independent sub-projects across different technology stacks. Documentation is primarily in Japanese. There are no cross-project dependencies — each sub-project can be developed and deployed independently.

Motto: *ルールなし。壊してもいい。* (No rules. It's okay to break things.)

## Repository Structure

```
SandBox/
├── claude-unity-bridge/   # Unity editor extension for Claude-assisted debugging
├── qwen-chat/             # Qwen LLM chat CLI, API server, and cloud deployment
├── ndlocr-lite/           # OCR engine from NDL (National Diet Library of Japan)
├── web-haptics/           # Haptic feedback library for mobile web (React/Vue/Svelte)
├── test_images/           # Sample images for ndlocr-lite evaluation
├── test_output/           # OCR test results
├── .github/workflows/     # CI/CD (Modal deployment for qwen-chat)
└── ndlocr_lite_evaluation.md  # OCR evaluation report
```

## Sub-Projects

### claude-unity-bridge (C#)
Unity Editor extension that lets Claude Code take screenshots of the Game View and autonomously debug games via MCP (Model Context Protocol).

- **Language:** C#
- **Requirements:** Unity 2021.x–Unity 6, Node.js v18+, Claude Code CLI
- **Key file:** `ClaudeCodeBridge.cs` — Editor script with screenshot capture and Play Mode control
- **MCP port:** 6400

### qwen-chat (Python)
Chat interface for Qwen3.5-35B-A3B with multiple deployment options.

- **Language:** Python 3.11
- **Install:** `pip install -r qwen-chat/requirements.txt`
- **Key dependencies:** `llama-cpp-python`, `fastapi`, `uvicorn`, `huggingface-hub`
- **Entry points:**
  - `chat.py` — CLI chat
  - `server.py` — OpenAI-compatible API server (port 8000)
  - `modal_deploy.py` — Modal.com cloud deployment
  - `chat-app.html` — Standalone web UI
- **Config:** `config.py` — model settings, inference presets (chat/creative/precise/reasoning)
- **CI/CD:** `.github/workflows/deploy.yml` auto-deploys to Modal on push to `qwen-chat/**`

### ndlocr-lite (Python)
Lightweight OCR pipeline (layout detection → text recognition → reading order).

- **Language:** Python 3.10+
- **Install:** `pip install -r ndlocr-lite/requirements.txt`
- **Key dependencies:** `onnxruntime`, `opencv-python-headless`, `pillow`, `lxml`
- **Entry point:** `src/ocr.py` — CLI for batch/single image OCR
- **Models:** Pre-trained ONNX models in `src/model/` (~153MB total)
- **GUI:** `ndlocr-lite-gui/main.py` — Flet-based desktop app
- **License:** CC BY 4.0 (National Diet Library, Japan)
- **No GPU required** — runs on CPU via ONNX Runtime

### web-haptics (TypeScript)
Framework-agnostic vibration library for mobile web, published as `web-haptics` on npm.

- **Language:** TypeScript 5.9
- **Package manager:** pnpm 8+
- **Install:** `cd web-haptics && pnpm install`
- **Build:** `pnpm build` (uses `tsup`)
- **Dev:** `pnpm dev` (watch mode + dev server)
- **Lint:** `pnpm lint` (ESLint with airbnb-typescript)
- **Structure:** pnpm monorepo
  - `packages/web-haptics/` — Core library (vanilla JS, React hook, Vue composable, Svelte store)
  - `apps/react-example/` — React demo
  - `apps/vue-example/` — Vue demo
  - `apps/svelte-example/` — Svelte demo
  - `apps/typescript-example/` — Vanilla TS demo
  - `site/` — Documentation website
- **Release:** Changesets-based (`pnpm release`)
- **Commit convention:** Conventional commits enforced via `commitlint`

## Development Guidelines

### General
- Each sub-project is independent — changes to one should not affect others
- Keep documentation in Japanese where the existing docs are Japanese
- Avoid over-engineering; this is an experimental sandbox
- No shared build system — use the appropriate toolchain for each sub-project

### Git Conventions
- Branch naming: `claude/<description>-<id>` for Claude-authored branches
- Commit messages: descriptive, concise; web-haptics enforces conventional commits
- Do not commit secrets, API tokens, or model weight files

### Python Projects (qwen-chat, ndlocr-lite)
- Use `requirements.txt` for dependency management
- qwen-chat targets Python 3.11; ndlocr-lite targets Python 3.10+
- No shared virtual environment — isolate per project

### TypeScript Project (web-haptics)
- Use `pnpm` (not npm or yarn)
- Run `pnpm install` from the `web-haptics/` directory
- Build before testing: `pnpm build`
- Lint before committing: `pnpm lint`

### Unity Project (claude-unity-bridge)
- C# script goes in Unity Editor folder conventions
- Uses MCP protocol on port 6400
- Screenshots saved to `{UnityProjectRoot}/Screenshots/`

## File Patterns to Ignore
- `node_modules/`, `dist/` — build artifacts (web-haptics)
- `*.onnx` — model weights (ndlocr-lite, tracked via Git but large)
- `.DS_Store`, `Thumbs.db` — OS artifacts
- `__MACOSX/` — macOS zip artifacts

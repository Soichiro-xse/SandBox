# Claude Code × Unity Bridge

Claude Code（AIコーディングエージェント）がUnityのGame ViewをスクリーンショットでキャプチャしてUI/ビジュアルの確認を行えるようにするエディター拡張です。

## これで何ができるか

```
Claude Code が自動で:
  1. コードを編集
  2. Unity を Play Mode に入れる
  3. Game View のスクリーンショットを撮る
  4. 画像を読み込んで画面を「目視」確認
  5. 問題を発見したら再度コードを修正
  → くり返す
```

**Claude Code が自律的にUI/ビジュアルのデバッグを行える**ようになります。

---

## 必要なもの（インストール順）

| ツール | 用途 |
|--------|------|
| **Node.js** (v18以上) | UnityMCP の動作に必要 |
| **Claude Code** | AIコーディングエージェント本体 |
| **Unity Editor** | 2021.x 〜 Unity 6 対応 |

---

## セットアップ手順

### Step 1: Node.js をインストール

1. [https://nodejs.org/](https://nodejs.org/) を開く
2. **LTS版**（推奨版）をダウンロードしてインストール
3. インストール後、PowerShell またはコマンドプロンプトで確認:

```powershell
node -v
# v18.x.x 以上が表示されればOK
```

---

### Step 2: Claude Code をインストール

1. PowerShell またはコマンドプロンプトを**管理者として**実行
2. 以下を実行:

```powershell
npm install -g @anthropic/claude-code
```

3. インストール確認:

```powershell
claude --version
```

4. 初回起動・ログイン:

```powershell
claude
```

表示に従って Anthropic アカウントでログインしてください。
（アカウントがない場合は [claude.ai](https://claude.ai) で作成）

---

### Step 3: MCP for Unity を Unity にインストール

MCP for Unity は Claude Code と Unity Editor を繋ぐプラグインです。

1. Unity Editor で対象プロジェクトを開く
2. メニューバーから **Window > Package Manager** を開く
3. 左上の **「+」ボタン** > **「Add package from git URL...」** をクリック
4. 以下のURLを入力して **「Add」**:

```
https://github.com/CoplayDev/unity-mcp.git?path=/UnityMcpBridge
```

5. インポートが完了するまで待つ（1〜2分程度）

> **注意:** パッケージのインポート中はUnityが固まったように見えることがありますが正常です。

---

### Step 4: Claude Code の MCP 設定

Claude Code に「UnityMCP サーバーを使う」よう設定します。

1. **ホームフォルダ**（`C:\Users\あなたのユーザー名\`）を開く
2. **`.claude`** フォルダを開く（なければ作成）
3. その中に **`mcp.json`** というファイルを作成し、以下を記述:

```json
{
  "mcpServers": {
    "unityMCP": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-for-unity"]
    }
  }
}
```

4. 保存する

> **補足:** ファイルの場所は `C:\Users\あなたのユーザー名\.claude\mcp.json` になります。

---

### Step 5: ClaudeCodeBridge.cs を Unity に追加

**方法A: install.ps1 を使う（推奨）**

1. PowerShell を開く
2. このリポジトリのフォルダに移動:

```powershell
cd C:\path\to\claude-unity-bridge
```

3. スクリプトを実行（Unityプロジェクトのパスを指定）:

```powershell
.\install.ps1 -UnityProjectPath "C:\path\to\YourUnityProject"
```

**方法B: 手動でコピー**

`ClaudeCodeBridge.cs` を Unity プロジェクトの **`Assets/Editor/`** フォルダにコピーします。

```
YourUnityProject/
└── Assets/
    └── Editor/              ← ここに配置（Editor フォルダがなければ作成）
        └── ClaudeCodeBridge.cs
```

コピー後、Unity が自動でコンパイルします（画面下のプログレスバーが消えるまで待つ）。

---

### Step 6: Unity Editor でセットアップを完了

1. Unity Editor のメニューバーから **Tools > Claude > Auto Setup** を実行
2. コンソールに `[ClaudeBridge] Created _ClaudeBridge GameObject` と表示されれば成功
3. シーンを保存 (**Ctrl+S**)

これでセットアップ完了です！

---

## 使い方

### 基本的な使い方

1. Unity Editor を起動してプロジェクトを開いておく
2. PowerShell または VSCode のターミナルで、Unityプロジェクトのフォルダに移動:

```powershell
cd C:\path\to\YourUnityProject
claude
```

3. Claude Code のチャットで指示する例:

```
Play Mode に入ってスクリーンショットを撮って、UIの見た目を確認して
```

### 使えるメニュー一覧（Claude が内部で使用）

| メニューパス | 機能 |
|-------------|------|
| `Tools/Claude/Screenshot` | Game View のスクリーンショットを撮影 |
| `Tools/Claude/Enter Play Mode` | Play Mode に入る |
| `Tools/Claude/Exit Play Mode` | Play Mode を終了 |
| `Tools/Claude/Log Scene Info` | シーンの構造をコンソールに出力 |
| `Tools/Claude/Clear Console` | コンソールをクリア |
| `Tools/Claude/Auto Setup` | ClaudeScreenCapture コンポーネントを自動配置 |

スクリーンショットは Unity プロジェクト直下の `Screenshots/` フォルダに保存されます。

---

## トラブルシューティング

### 「MCP が接続できない」

1. Unity Editor のコンソールに以下が表示されているか確認:

```
MCP-FOR-UNITY: MCPForUnityBridge started on port 6400
```

2. Claude Code 側で MCP が有効になっているか確認:

```powershell
claude mcp list
```

`unityMCP` が表示されていればOKです。

3. ファイアウォールでポート **6400** がブロックされていないか確認
   （社内ネットワークの場合、IT部門に確認が必要な場合があります）

---

### 「メニューが見つからない / Tools > Claude がない」

`ClaudeCodeBridge.cs` が **`Assets/Editor/`** フォルダに正しく配置されているか確認してください。
フォルダが `Assets/` 直下でなく、サブフォルダになっている場合も動作します。

---

### 「スクリーンショットが灰色になる」

Play Mode で別のカメラや RenderTexture を使っている場合に発生することがあります。
一度 Play Mode を止めて再度試してみてください。

---

### 「Auto Setup 後もスクリーンショットが撮れない」

シーンに `_ClaudeBridge` という GameObject があるか確認してください。
ない場合は **Tools > Claude > Auto Setup** を再実行してください。

また、スクリーンショットは **Play Mode 中のみ**動作します。

---

## スクリーンショットの保存先

```
YourUnityProject/
└── Screenshots/
    ├── gameview_20260301_120000.png
    ├── gameview_20260301_120015.png
    └── ...
```

---

## 動作確認済み環境

| 項目 | 内容 |
|------|------|
| OS | Windows 10 / Windows 11 |
| Unity | 2021.3 LTS / 2022.3 LTS / Unity 6000.x |
| Node.js | v18 以上 |
| Claude Code | 最新版 |

---

## ライセンス

MIT License

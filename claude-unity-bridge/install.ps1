# install.ps1
# ClaudeCodeBridge.cs を指定した Unity プロジェクトにインストールするスクリプト
#
# 使い方:
#   .\install.ps1 -UnityProjectPath "C:\path\to\YourUnityProject"
#
# または引数なしで実行すると現在のフォルダをプロジェクトパスとして使います:
#   .\install.ps1

param(
    [string]$UnityProjectPath = ""
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Claude Code Bridge for Unity - インストーラー" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# --- Unityプロジェクトパスの決定 ---

if ($UnityProjectPath -eq "") {
    # 引数がない場合は対話入力
    Write-Host "Unity プロジェクトのフォルダパスを入力してください。" -ForegroundColor Yellow
    Write-Host "例: C:\Users\yourname\Documents\MyUnityProject" -ForegroundColor Gray
    Write-Host ""
    $UnityProjectPath = Read-Host "Unity プロジェクトのパス"
}

$UnityProjectPath = $UnityProjectPath.Trim('"').Trim("'")

# --- パスの検証 ---

if (-not (Test-Path $UnityProjectPath)) {
    Write-Host ""
    Write-Host "[エラー] 指定されたパスが見つかりません: $UnityProjectPath" -ForegroundColor Red
    exit 1
}

$assetsPath = Join-Path $UnityProjectPath "Assets"
if (-not (Test-Path $assetsPath)) {
    Write-Host ""
    Write-Host "[エラー] Unity プロジェクトの Assets フォルダが見つかりません。" -ForegroundColor Red
    Write-Host "        Unity プロジェクトのルートフォルダを指定してください。" -ForegroundColor Red
    exit 1
}

# --- コピー先の確認 ---

$editorPath = Join-Path $assetsPath "Editor"
$destFile = Join-Path $editorPath "ClaudeCodeBridge.cs"
$sourceFile = Join-Path $PSScriptRoot "ClaudeCodeBridge.cs"

if (-not (Test-Path $sourceFile)) {
    Write-Host ""
    Write-Host "[エラー] ClaudeCodeBridge.cs が見つかりません。" -ForegroundColor Red
    Write-Host "        このスクリプトと同じフォルダに ClaudeCodeBridge.cs を置いてください。" -ForegroundColor Red
    exit 1
}

# --- Editor フォルダの作成 ---

if (-not (Test-Path $editorPath)) {
    Write-Host "Assets/Editor フォルダを作成します..."
    New-Item -ItemType Directory -Path $editorPath | Out-Null
    Write-Host "  作成: $editorPath" -ForegroundColor Green
}

# --- 既存ファイルの確認 ---

if (Test-Path $destFile) {
    Write-Host ""
    Write-Host "ClaudeCodeBridge.cs はすでに存在します。上書きしますか？" -ForegroundColor Yellow
    Write-Host "  インストール先: $destFile"
    $answer = Read-Host "上書きする場合は 'y' を入力 [y/N]"
    if ($answer -ne "y" -and $answer -ne "Y") {
        Write-Host "インストールをキャンセルしました。" -ForegroundColor Gray
        exit 0
    }
}

# --- ファイルのコピー ---

Copy-Item -Path $sourceFile -Destination $destFile -Force
Write-Host ""
Write-Host "[完了] ClaudeCodeBridge.cs をインストールしました！" -ForegroundColor Green
Write-Host "  インストール先: $destFile" -ForegroundColor Green

# --- 次のステップ案内 ---

Write-Host ""
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "  次のステップ" -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Unity Editor を開いてください（自動でコンパイルが走ります）"
Write-Host "2. コンパイルが終わったら: Tools > Claude > Auto Setup を実行"
Write-Host "3. シーンを保存 (Ctrl+S)"
Write-Host ""
Write-Host "詳細は README.md を参照してください。"
Write-Host ""

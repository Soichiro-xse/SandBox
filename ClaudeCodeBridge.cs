// ClaudeCodeBridge.cs
// Unity Editor script that enables Claude Code to "see" the Game View.
//
// Setup:
//   1. Install MCP for Unity (com.coplaydev.unity-mcp)
//   2. Drop this file into Assets/Editor/
//   3. Attach ClaudeScreenCapture to any active GameObject in the scene
//      (or use Tools > Claude > Auto Setup)
//
// How it works:
//   Claude Code triggers "Tools/Claude/Screenshot" via MCP execute_menu_item,
//   then reads the saved PNG with its Read tool to visually inspect the Game View.
//
// License: MIT

#if UNITY_EDITOR

using UnityEngine;
using UnityEditor;
using System.IO;

// ═══════════════════════════════════════════════
//  1. Screenshot MonoBehaviour (runtime capture)
// ═══════════════════════════════════════════════

/// <summary>
/// Captures the Game View screen and saves it as PNG.
/// Attach to any active GameObject in the scene.
/// </summary>
public class ClaudeScreenCapture : MonoBehaviour
{
    private static ClaudeScreenCapture _instance;
    public static ClaudeScreenCapture Instance => _instance;

    [Tooltip("Screenshots are saved to {ProjectRoot}/Screenshots/")]
    [SerializeField] private float captureDelay = 0.1f;

    private void Awake()
    {
        _instance = this;
    }

    private void OnDestroy()
    {
        if (_instance == this) _instance = null;
    }

    /// <summary>
    /// Start a screenshot capture coroutine.
    /// </summary>
    public void Capture(float delay = -1f)
    {
        StartCoroutine(CaptureCoroutine(delay >= 0 ? delay : captureDelay));
    }

    private System.Collections.IEnumerator CaptureCoroutine(float delay)
    {
        if (delay > 0f) yield return new WaitForSeconds(delay);
        yield return new WaitForEndOfFrame();

        // IMPORTANT: RenderTexture.active must be null for ReadPixels
        // to capture the final composited frame (including UI Toolkit overlays).
        var prevRT = RenderTexture.active;
        RenderTexture.active = null;

        string dir = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "Screenshots"));
        if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

        int w = Screen.width;
        int h = Screen.height;
        var tex = new Texture2D(w, h, TextureFormat.RGB24, false);
        tex.ReadPixels(new Rect(0, 0, w, h), 0, 0);
        tex.Apply();

        RenderTexture.active = prevRT;

        string ts = System.DateTime.Now.ToString("yyyyMMdd_HHmmss");
        string path = Path.Combine(dir, $"gameview_{ts}.png");
        File.WriteAllBytes(path, tex.EncodeToPNG());
        Destroy(tex);

        Debug.Log($"[ClaudeBridge] Screenshot saved: {path} ({w}x{h})");
    }
}

// ═══════════════════════════════════════════════
//  2. Editor Menu Items (MCP entry points)
// ═══════════════════════════════════════════════

/// <summary>
/// Editor menu items that Claude Code can invoke via MCP execute_menu_item.
/// </summary>
public static class ClaudeCodeBridgeMenu
{
    // ─── Screenshot ───

    [MenuItem("Tools/Claude/Screenshot")]
    public static void TakeScreenshot()
    {
        if (!Application.isPlaying)
        {
            Debug.LogError("[ClaudeBridge] Screenshot requires Play mode.");
            return;
        }

        var capture = ClaudeScreenCapture.Instance;
        if (capture == null)
        {
            // Auto-find or create
            capture = Object.FindFirstObjectByType<ClaudeScreenCapture>();
            if (capture == null)
            {
                Debug.LogError("[ClaudeBridge] ClaudeScreenCapture not found. Use Tools > Claude > Auto Setup.");
                return;
            }
        }

        capture.Capture();
    }

    // ─── Play Mode Control ───

    [MenuItem("Tools/Claude/Enter Play Mode")]
    public static void EnterPlayMode()
    {
        if (!Application.isPlaying)
            EditorApplication.isPlaying = true;
    }

    [MenuItem("Tools/Claude/Exit Play Mode")]
    public static void ExitPlayMode()
    {
        if (Application.isPlaying)
            EditorApplication.isPlaying = false;
    }

    // ─── Scene Info ───

    [MenuItem("Tools/Claude/Log Scene Info")]
    public static void LogSceneInfo()
    {
        var scene = UnityEngine.SceneManagement.SceneManager.GetActiveScene();
        var roots = scene.GetRootGameObjects();
        Debug.Log($"[ClaudeBridge] Scene: {scene.name}, Root objects: {roots.Length}");
        foreach (var go in roots)
        {
            var components = go.GetComponents<Component>();
            string names = string.Join(", ", System.Array.ConvertAll(components, c => c?.GetType().Name ?? "null"));
            Debug.Log($"  {go.name} [{names}]");
        }
    }

    // ─── Console Shortcut ───

    [MenuItem("Tools/Claude/Clear Console")]
    public static void ClearConsole()
    {
        var logEntries = System.Type.GetType("UnityEditor.LogEntries, UnityEditor");
        if (logEntries != null)
        {
            var clear = logEntries.GetMethod("Clear",
                System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public);
            clear?.Invoke(null, null);
        }
    }

    // ─── Auto Setup ───

    [MenuItem("Tools/Claude/Auto Setup")]
    public static void AutoSetup()
    {
        // Find or create a persistent GameObject for ClaudeScreenCapture
        var existing = Object.FindFirstObjectByType<ClaudeScreenCapture>();
        if (existing != null)
        {
            Debug.Log($"[ClaudeBridge] Already set up on '{existing.gameObject.name}'.");
            return;
        }

        var go = new GameObject("_ClaudeBridge");
        go.AddComponent<ClaudeScreenCapture>();
        Debug.Log("[ClaudeBridge] Created _ClaudeBridge GameObject with ClaudeScreenCapture.");
    }
}

#endif

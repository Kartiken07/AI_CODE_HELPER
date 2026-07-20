import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Code, Copy, Check, Trash2, Sparkles } from "lucide-react";

const CodeEditor = ({ code, setCode, language, onLoadSample }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCode("");
  };

  const getMonacoLanguage = (lang) => {
    const map = {
      python: "python",
      javascript: "javascript",
      java: "java",
      cpp: "cpp",
      go: "go",
    };
    return map[lang] || "plaintext";
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-title">
          <Code size={18} />
          <span>Code Editor</span>
        </div>
        <div className="editor-actions">
          <button
            className="editor-btn"
            onClick={onLoadSample}
            title="Load sample code"
          >
            <Sparkles size={14} />
            <span>Sample</span>
          </button>
          <button
            className="editor-btn"
            onClick={handleCopy}
            title="Copy code"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            className="editor-btn danger"
            onClick={handleClear}
            title="Clear code"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>
      <div className="editor-wrapper">
        <Editor
          height="400px"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;

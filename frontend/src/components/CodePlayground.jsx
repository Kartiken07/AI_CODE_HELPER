import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Copy, Check, Maximize2, Minimize2 } from "lucide-react";

const CodePlayground = ({
  optimizedCode,
  language,
  onReAnalyze,
  loading,
}) => {
  const [code, setCode] = useState(optimizedCode || "");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    if (optimizedCode) {
      setCode(optimizedCode);
      setHistory([optimizedCode]);
      setHistoryIndex(0);
    }
  }, [optimizedCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReAnalyze = () => {
    if (onReAnalyze) {
      onReAnalyze(code);
    }
  };

  const handleReset = () => {
    if (optimizedCode) {
      setCode(optimizedCode);
      setHistory([optimizedCode]);
      setHistoryIndex(0);
    }
  };

  const handleCodeChange = (value) => {
    const newCode = value || "";
    setCode(newCode);
    const newHistory = [...history.slice(0, historyIndex + 1), newCode];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCode(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCode(history[historyIndex + 1]);
    }
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

  if (!optimizedCode) return null;

  return (
    <div className={`playground-container ${isExpanded ? "expanded" : ""}`}>
      <div className="playground-header">
        <div className="playground-title">
          <Play size={18} />
          <span>Code Playground</span>
          <span className="playground-badge">Edit & Re-Analyze</span>
        </div>
        <div className="playground-actions">
          <button
            className="playground-btn"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <RotateCcw size={14} />
          </button>
          <button
            className="playground-btn"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <RotateCcw size={14} style={{ transform: "scaleX(-1)" }} />
          </button>
          <button className="playground-btn" onClick={handleCopy} title="Copy">
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
          <button
            className="playground-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button className="playground-btn reset" onClick={handleReset} title="Reset to AI version">
            Reset
          </button>
          <button
            className="playground-btn analyze"
            onClick={handleReAnalyze}
            disabled={loading}
          >
            <Play size={14} />
            {loading ? "Analyzing..." : "Re-Analyze"}
          </button>
        </div>
      </div>

      <div className="playground-editor">
        <Editor
          height={isExpanded ? "500px" : "300px"}
          language={getMonacoLanguage(language)}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            padding: { top: 12, bottom: 12 },
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

      <div className="playground-footer">
        <span className="playground-info">
          Lines: {code.split("\n").length} &bull; Characters: {code.length}
        </span>
        <span className="playground-info">
          History: {historyIndex + 1}/{history.length}
        </span>
      </div>
    </div>
  );
};

export default CodePlayground;

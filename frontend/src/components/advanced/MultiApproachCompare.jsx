import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Copy, Check, Layers } from "lucide-react";

const MultiApproachCompare = ({ approaches }) => {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!approaches || approaches.length === 0) return null;

  const current = approaches[selected];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMonacoLang = (code) => {
    if (code.includes("def ") || code.includes("import ")) return "python";
    if (code.includes("function ") || code.includes("const ")) return "javascript";
    if (code.includes("public class") || code.includes("System.out")) return "java";
    return "plaintext";
  };

  return (
    <div className="approaches-container">
      <div className="approaches-header">
        <Layers size={18} />
        <span>Multiple Approaches</span>
      </div>

      <div className="approaches-tabs">
        {approaches.map((a, i) => (
          <button
            key={i}
            className={`approach-tab ${i === selected ? "active" : ""}`}
            onClick={() => setSelected(i)}
          >
            {a.name}
          </button>
        ))}
      </div>

      {current && (
        <div className="approach-body">
          <div className="approach-info">
            <div className="approach-complexity">
              <span className="ac-label">Time:</span>
              <span className="ac-value time">{current.time_complexity}</span>
              <span className="ac-label">Space:</span>
              <span className="ac-value space">{current.space_complexity}</span>
            </div>
            <p className="approach-explain">{current.explanation}</p>
            <div className="approach-pros-cons">
              {current.pros?.length > 0 && (
                <div className="approach-pros">
                  <span className="pc-label">Pros:</span>
                  <ul>
                    {current.pros.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}
              {current.cons?.length > 0 && (
                <div className="approach-cons">
                  <span className="pc-label">Cons:</span>
                  <ul>
                    {current.cons.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}
            </div>
            {current.best_for && (
              <div className="approach-best">
                <span>Best for:</span> {current.best_for}
              </div>
            )}
          </div>
          <div className="approach-code">
            <div className="approach-code-header">
              <span>{current.name}</span>
              <button className="approach-copy" onClick={handleCopy}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
            <Editor
              height="300px"
              language={getMonacoLang(current.code)}
              value={current.code}
              theme="vs-dark"
              options={{
                readOnly: true,
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                padding: { top: 8, bottom: 8 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiApproachCompare;

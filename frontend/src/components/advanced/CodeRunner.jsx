import { useState } from "react";
import { Play, Terminal, Loader2 } from "lucide-react";

const CodeRunner = ({ code, language }) => {
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);

  const runCode = async () => {
    setRunning(true);
    setOutput("");
    try {
      if (language === "python") {
        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: "python",
            version: "3.10",
            files: [{ content: code }],
            stdin: input,
          }),
        });
        const data = await res.json();
        setOutput(data.run?.output || data.message || "No output");
      } else {
        const langMap = { javascript: "nodejs", java: "java", cpp: "cpp", go: "go" };
        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: langMap[language] || language,
            files: [{ content: code }],
            stdin: input,
          }),
        });
        const data = await res.json();
        setOutput(data.run?.output || data.message || "No output");
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="runner-container">
      <div className="runner-header">
        <Terminal size={18} />
        <span>Code Runner</span>
        <button className="runner-run" onClick={runCode} disabled={running}>
          {running ? <Loader2 size={14} className="spinner" /> : <Play size={14} />}
          {running ? "Running..." : "Run Code"}
        </button>
      </div>
      <div className="runner-body">
        <div className="runner-section">
          <label>Input (stdin):</label>
          <textarea
            className="runner-input"
            placeholder="Optional input..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
          />
        </div>
        <div className="runner-section">
          <label>Output:</label>
          <pre className="runner-output">{output || "Click 'Run Code' to execute..."}</pre>
        </div>
      </div>
    </div>
  );
};

export default CodeRunner;

import { useState, useEffect, useRef } from "react";
import { GitBranch, Loader2, AlertCircle } from "lucide-react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#6366f1",
    primaryTextColor: "#e8e8f0",
    primaryBorderColor: "#4f46e5",
    lineColor: "#6366f1",
    secondaryColor: "#16163a",
    tertiaryColor: "#1e1e4a",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
  },
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "basis",
  },
});

let mermaidCounter = 0;

const FlowchartGenerator = ({ flowchart }) => {
  const [svg, setSvg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (flowchart) {
      renderFlowchart(flowchart);
    }
  }, [flowchart]);

  const renderFlowchart = async (mermaidCode) => {
    setLoading(true);
    setError("");
    setSvg("");

    try {
      const cleanCode = mermaidCode
        .replace(/^```mermaid\n?/i, "")
        .replace(/^```\n?/i, "")
        .replace(/\n?```$/i, "")
        .trim();

      if (!cleanCode.includes("graph") && !cleanCode.includes("flowchart")) {
        setError("Invalid flowchart format");
        setLoading(false);
        return;
      }

      mermaidCounter++;
      const id = `mermaid-${mermaidCounter}-${Date.now()}`;
      const { svg: renderedSvg } = await mermaid.render(id, cleanCode);
      setSvg(renderedSvg);
    } catch (err) {
      console.error("Mermaid render error:", err);
      setError("Failed to render flowchart — showing raw syntax below");
      setShowRaw(true);
    } finally {
      setLoading(false);
    }
  };

  if (!flowchart) return null;

  return (
    <div className="flowchart-container">
      <div className="flowchart-header">
        <GitBranch size={18} />
        <span>Code Flowchart</span>
        {svg && (
          <button className="flowchart-toggle" onClick={() => setShowRaw(!showRaw)}>
            {showRaw ? "Visual" : "Raw"}
          </button>
        )}
      </div>
      <div className="flowchart-body">
        {loading && (
          <div className="flowchart-loading">
            <Loader2 size={24} className="spinner" />
            <span>Generating flowchart...</span>
          </div>
        )}
        {error && !showRaw && (
          <div className="flowchart-error-msg">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {svg && !showRaw && !loading && (
          <div
            ref={containerRef}
            className="flowchart-svg"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
        {(showRaw || (!svg && !loading)) && (
          <pre className="flowchart-code">{flowchart}</pre>
        )}
      </div>
    </div>
  );
};

export default FlowchartGenerator;

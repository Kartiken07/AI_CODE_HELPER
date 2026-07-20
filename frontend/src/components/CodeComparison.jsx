import { useMemo } from "react";
import { diffLines } from "diff";
import { ArrowLeftRight } from "lucide-react";

const CodeComparison = ({ original, optimized }) => {
  const diffs = useMemo(() => {
    if (!original || !optimized) return [];
    return diffLines(original, optimized);
  }, [original, optimized]);

  if (!original || !optimized) return null;

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <ArrowLeftRight size={18} />
        <span>Code Comparison</span>
        <div className="comparison-legend">
          <span className="legend-item removed">- Removed</span>
          <span className="legend-item added">+ Added</span>
        </div>
      </div>
      <div className="comparison-body">
        <div className="comparison-pane">
          <div className="pane-header">Original Code</div>
          <pre className="pane-code">
            {diffs.map((part, i) => (
              <span
                key={i}
                className={part.added ? "hidden" : part.removed ? "diff-removed" : ""}
              >
                {part.value}
              </span>
            ))}
          </pre>
        </div>
        <div className="comparison-divider" />
        <div className="comparison-pane">
          <div className="pane-header">Optimized Code</div>
          <pre className="pane-code">
            {diffs.map((part, i) => (
              <span
                key={i}
                className={part.removed ? "hidden" : part.added ? "diff-added" : ""}
              >
                {part.value}
              </span>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeComparison;

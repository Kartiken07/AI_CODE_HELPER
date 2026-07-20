import { Flame } from "lucide-react";

const SEVERITY_COLORS = {
  high: { bg: "rgba(239, 68, 68, 0.25)", border: "#ef4444", text: "#fca5a5" },
  medium: { bg: "rgba(245, 158, 11, 0.25)", border: "#f59e0b", text: "#fcd34d" },
  low: { bg: "rgba(34, 197, 94, 0.25)", border: "#22c55e", text: "#86efac" },
};

const ComplexityHeatmap = ({ heatmapData, code }) => {
  if (!heatmapData || heatmapData.length === 0 || !code) return null;

  const lines = code.split("\n");
  const heatmapMap = {};
  heatmapData.forEach((h) => {
    heatmapMap[h.line] = h;
  });

  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <Flame size={18} />
        <span>Complexity Heatmap</span>
        <div className="heatmap-legend">
          <span className="legend-dot high" /> High
          <span className="legend-dot medium" /> Medium
          <span className="legend-dot low" /> Low
        </div>
      </div>
      <div className="heatmap-body">
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const data = heatmapMap[lineNum];
          const severity = data?.contribution || "low";
          const colors = SEVERITY_COLORS[severity];
          return (
            <div
              key={i}
              className="heatmap-line"
              style={{
                background: data ? colors.bg : "transparent",
                borderLeft: data ? `3px solid ${colors.border}` : "3px solid transparent",
              }}
            >
              <span className="heatmap-line-num">{lineNum}</span>
              <span className="heatmap-line-code">{line || " "}</span>
              {data && (
                <div className="heatmap-info">
                  <span
                    className="heatmap-severity"
                    style={{ color: colors.text, background: colors.bg }}
                  >
                    {data.severity?.toFixed(1)}
                  </span>
                  <span className="heatmap-reason">{data.reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplexityHeatmap;

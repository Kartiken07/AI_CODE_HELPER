import { Download, FileJson, FileText } from "lucide-react";

const ExportReport = ({ results, code, language }) => {
  const exportJSON = () => {
    const report = {
      timestamp: new Date().toISOString(),
      language,
      code,
      analysis: results,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complexity-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportText = () => {
    const lines = [
      "═══════════════════════════════════════════",
      "  CODE COMPLEXITY ANALYSIS REPORT",
      "═══════════════════════════════════════════",
      `  Date: ${new Date().toLocaleString()}`,
      `  Language: ${language}`,
      "───────────────────────────────────────────",
      "",
      "  COMPLEXITY ANALYSIS",
      "  ───────────────────",
      `  Time Complexity:  ${results.time_complexity}`,
      `  Space Complexity: ${results.space_complexity}`,
      "",
      "  Time Complexity Explanation:",
      `  ${results.time_complexity_explanation}`,
      "",
      "  Space Complexity Explanation:",
      `  ${results.space_complexity_explanation}`,
      "",
    ];

    if (results.bottlenecks?.length) {
      lines.push("  BOTTLENECKS");
      lines.push("  ───────────");
      results.bottlenecks.forEach((b, i) => lines.push(`  ${i + 1}. ${b}`));
      lines.push("");
    }

    if (results.suggestions?.length) {
      lines.push("  OPTIMIZATION SUGGESTIONS");
      lines.push("  ────────────────────────");
      results.suggestions.forEach((s, i) => lines.push(`  ${i + 1}. ${s}`));
      lines.push("");
    }

    if (results.algorithm_patterns?.length) {
      lines.push("  DETECTED PATTERNS");
      lines.push("  ─────────────────");
      results.algorithm_patterns.forEach((p) =>
        lines.push(`  • ${p.name} (${Math.round(p.confidence * 100)}%) - ${p.description}`)
      );
      lines.push("");
    }

    if (results.optimized_code) {
      lines.push("  OPTIMIZED CODE");
      lines.push("  ──────────────");
      lines.push(results.optimized_code);
    }

    lines.push("");
    lines.push("═══════════════════════════════════════════");

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complexity-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-container">
      <button className="export-btn" onClick={exportJSON}>
        <FileJson size={14} />
        Export JSON
      </button>
      <button className="export-btn" onClick={exportText}>
        <FileText size={14} />
        Export Report
      </button>
    </div>
  );
};

export default ExportReport;

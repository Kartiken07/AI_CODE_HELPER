import { useState, useEffect } from "react";
import { Bug, AlertTriangle, Info, AlertCircle, Shield, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { apiFetch } from "../../services/apiHelper";

const CodeSmellDetector = ({ code, language }) => {
  const [smells, setSmells] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);

  const detectSmells = async () => {
    if (!code) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/code-smells", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      });
      setSmells(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) detectSmells();
  }, [code, language]);

  const severityIcon = {
    critical: <AlertTriangle size={14} />,
    warning: <AlertCircle size={14} />,
    info: <Info size={14} />,
  };

  const severityColor = {
    critical: "#ef4444",
    warning: "#f59e0b",
    info: "#6366f1",
  };

  const categoryColor = {
    naming: "#8b5cf6",
    complexity: "#ef4444",
    duplication: "#f59e0b",
    length: "#06b6d4",
    coupling: "#ec4899",
    bloat: "#f97316",
  };

  if (loading && !smells) {
    return (
      <div className="smells-container">
        <div className="smells-header">
          <Bug size={18} />
          <span>Code Smell Detector</span>
        </div>
        <div className="smells-loading">
          <Loader2 size={20} className="spinner" />
          <span>Analyzing code smells...</span>
        </div>
      </div>
    );
  }

  if (!smells && !error) return null;

  return (
    <div className="smells-container">
      <button className="smells-header" onClick={() => setExpanded(!expanded)}>
        <Bug size={18} />
        <span>Code Smell Detector</span>
        {smells?.summary && (
          <div className="smells-summary-badges">
            {smells.summary.critical > 0 && (
              <span className="smell-badge critical">{smells.summary.critical} Critical</span>
            )}
            {smells.summary.warnings > 0 && (
              <span className="smell-badge warning">{smells.summary.warnings} Warning</span>
            )}
            {smells.summary.info > 0 && (
              <span className="smell-badge info">{smells.summary.info} Info</span>
            )}
          </div>
        )}
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && smells && (
        <div className="smells-body">
          {smells.summary && (
            <div className="smells-health">
              <div className="health-circle">
                <svg viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#2a2a5a" strokeWidth="6" />
                  <circle
                    cx="40" cy="40" r="35" fill="none"
                    stroke={smells.summary.health_score >= 70 ? "#22c55e" : smells.summary.health_score >= 40 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${(smells.summary.health_score / 100) * 220} 220`}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="health-score-text">
                  <span className="health-num">{smells.summary.health_score}</span>
                  <span className="health-label">{smells.summary.verdict}</span>
                </div>
              </div>
              <div className="health-stats">
                <div className="health-stat"><span>Total</span><strong>{smells.summary.total_smells}</strong></div>
                <div className="health-stat critical"><span>Critical</span><strong>{smells.summary.critical}</strong></div>
                <div className="health-stat warning"><span>Warnings</span><strong>{smells.summary.warnings}</strong></div>
                <div className="health-stat info"><span>Info</span><strong>{smells.summary.info}</strong></div>
              </div>
            </div>
          )}

          <div className="smells-list">
            {smells.smells?.map((smell, i) => (
              <div key={i} className={`smell-item ${smell.severity}`}>
                <div className="smell-top">
                  <span className="smell-icon" style={{ color: severityColor[smell.severity] }}>
                    {severityIcon[smell.severity]}
                  </span>
                  <span className="smell-name">{smell.name}</span>
                  <span className="smell-line">Line {smell.line}</span>
                  <span className="smell-category" style={{ background: categoryColor[smell.category] + "20", color: categoryColor[smell.category] }}>
                    {smell.category}
                  </span>
                </div>
                <p className="smell-desc">{smell.description}</p>
                <div className="smell-fix">
                  <Shield size={12} />
                  <span>{smell.suggestion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className="smells-error">{error}</div>}
    </div>
  );
};

export default CodeSmellDetector;

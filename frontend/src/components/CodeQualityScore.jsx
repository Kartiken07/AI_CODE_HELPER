import { Shield, AlertTriangle, TrendingUp } from "lucide-react";

const CodeQualityScore = ({ codeQuality }) => {
  if (!codeQuality) return null;

  const {
    overall_score,
    readability,
    maintainability,
    efficiency,
    best_practices,
    issues,
    improvements,
  } = codeQuality;

  const getScoreColor = (score) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 70) return "Fair";
    if (score >= 60) return "Needs Work";
    return "Poor";
  };

  const categories = [
    { label: "Readability", value: readability },
    { label: "Maintainability", value: maintainability },
    { label: "Efficiency", value: efficiency },
    { label: "Best Practices", value: best_practices },
  ];

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (overall_score / 100) * circumference;

  return (
    <div className="quality-container">
      <div className="quality-header">
        <Shield size={18} />
        <span>Code Quality Score</span>
      </div>

      <div className="quality-body">
        <div className="quality-circle-section">
          <div className="quality-circle">
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#2a2a5a"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getScoreColor(overall_score)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="quality-score-text">
              <span className="quality-number">{overall_score}</span>
              <span className="quality-label">{getScoreLabel(overall_score)}</span>
            </div>
          </div>
        </div>

        <div className="quality-bars">
          {categories.map((cat) => (
            <div key={cat.label} className="quality-bar-item">
              <div className="quality-bar-header">
                <span>{cat.label}</span>
                <span style={{ color: getScoreColor(cat.value) }}>{cat.value}/100</span>
              </div>
              <div className="quality-bar-track">
                <div
                  className="quality-bar-fill"
                  style={{
                    width: `${cat.value}%`,
                    background: getScoreColor(cat.value),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {(issues?.length > 0 || improvements?.length > 0) && (
        <div className="quality-details">
          {issues?.length > 0 && (
            <div className="quality-issues">
              <h4>
                <AlertTriangle size={14} /> Issues
              </h4>
              <ul>
                {issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {improvements?.length > 0 && (
            <div className="quality-improvements">
              <h4>
                <TrendingUp size={14} /> Improvements
              </h4>
              <ul>
                {improvements.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeQualityScore;

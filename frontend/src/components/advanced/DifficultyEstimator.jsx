import { BarChart3 } from "lucide-react";

const DifficultyEstimator = ({ estimate }) => {
  if (!estimate || !estimate.level) return null;

  const levelColors = {
    Easy: { bg: "rgba(34, 197, 94, 0.15)", color: "#22c55e", bar: "#22c55e" },
    Medium: { bg: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", bar: "#f59e0b" },
    Hard: { bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444", bar: "#ef4444" },
  };

  const colors = levelColors[estimate.level] || levelColors.Medium;
  const percentage = ((estimate.score || 3) / (estimate.max_score || 5)) * 100;

  return (
    <div className="difficulty-container">
      <div className="difficulty-header">
        <BarChart3 size={18} />
        <span>Difficulty Estimator</span>
      </div>
      <div className="difficulty-body">
        <div className="difficulty-main">
          <div
            className="difficulty-badge"
            style={{ background: colors.bg, color: colors.color, borderColor: colors.color }}
          >
            {estimate.level}
          </div>
          <div className="difficulty-bar-wrap">
            <div className="difficulty-bar-track">
              <div
                className="difficulty-bar-fill"
                style={{ width: `${percentage}%`, background: colors.bar }}
              />
            </div>
            <span className="difficulty-score">{estimate.score}/{estimate.max_score}</span>
          </div>
        </div>

        <p className="difficulty-reason">{estimate.reasoning}</p>

        {estimate.platform_difficulty && (
          <div className="difficulty-platforms">
            {Object.entries(estimate.platform_difficulty).map(([platform, diff]) => (
              <div key={platform} className="diff-platform">
                <span className="diff-platform-name">{platform}</span>
                <span
                  className="diff-platform-level"
                  style={{ color: levelColors[diff]?.color }}
                >
                  {diff}
                </span>
              </div>
            ))}
          </div>
        )}

        {estimate.prerequisites?.length > 0 && (
          <div className="difficulty-prereqs">
            <span className="prereq-label">Prerequisites:</span>
            <div className="prereq-tags">
              {estimate.prerequisites.map((p, i) => (
                <span key={i} className="prereq-tag">{p}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DifficultyEstimator;

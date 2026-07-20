import { Cpu } from "lucide-react";

const PatternDetection = ({ patterns }) => {
  if (!patterns || patterns.length === 0) return null;

  return (
    <div className="patterns-container">
      <div className="patterns-header">
        <Cpu size={18} />
        <span>Detected Algorithm Patterns</span>
      </div>
      <div className="patterns-grid">
        {patterns.map((pattern, i) => (
          <div key={i} className="pattern-card">
            <div className="pattern-top">
              <span className="pattern-name">{pattern.name}</span>
              <span className="pattern-confidence">
                {Math.round(pattern.confidence * 100)}%
              </span>
            </div>
            <div className="pattern-bar">
              <div
                className="pattern-fill"
                style={{ width: `${pattern.confidence * 100}%` }}
              />
            </div>
            <p className="pattern-desc">{pattern.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternDetection;

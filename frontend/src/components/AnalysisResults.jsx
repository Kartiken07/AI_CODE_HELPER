import {
  AlertTriangle,
  Lightbulb,
  Zap,
  Target,
  Code2,
  ArrowRight,
} from "lucide-react";

const AnalysisResults = ({ results }) => {
  if (!results) return null;

  return (
    <div className="results-container">
      <div className="complexity-cards">
        <div className="complexity-card time">
          <div className="card-icon">
            <Zap size={24} />
          </div>
          <div className="card-content">
            <h3>Time Complexity</h3>
            <div className="complexity-value">{results.time_complexity}</div>
            <p>{results.time_complexity_explanation}</p>
          </div>
        </div>

        <div className="complexity-card space">
          <div className="card-icon">
            <Target size={24} />
          </div>
          <div className="card-content">
            <h3>Space Complexity</h3>
            <div className="complexity-value">{results.space_complexity}</div>
            <p>{results.space_complexity_explanation}</p>
          </div>
        </div>
      </div>

      {results.bottlenecks && results.bottlenecks.length > 0 && (
        <div className="section bottleneck-section">
          <h3>
            <AlertTriangle size={18} />
            Identified Bottlenecks
          </h3>
          <ul className="bottleneck-list">
            {results.bottlenecks.map((item, i) => (
              <li key={i} className="bottleneck-item">
                <span className="bottleneck-marker">!</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.suggestions && results.suggestions.length > 0 && (
        <div className="section suggestions-section">
          <h3>
            <Lightbulb size={18} />
            Space Optimization Suggestions
          </h3>
          <ul className="suggestion-list">
            {results.suggestions.map((item, i) => (
              <li key={i} className="suggestion-item">
                <ArrowRight size={14} className="suggestion-arrow" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.platform_suggestions && results.platform_suggestions.length > 0 && (
        <div className="section platform-section">
          <h3>
            <Target size={18} />
            Platform-Specific Suggestions
          </h3>
          <ul className="platform-list">
            {results.platform_suggestions.map((item, i) => (
              <li key={i} className="platform-item">
                <ArrowRight size={14} className="suggestion-arrow" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.optimized_code && (
        <div className="section optimized-section">
          <h3>
            <Code2 size={18} />
            Optimized Code
          </h3>
          <pre className="optimized-code">
            <code>{results.optimized_code}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;

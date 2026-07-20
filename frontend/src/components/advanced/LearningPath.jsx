import { BookOpen, ExternalLink } from "lucide-react";

const LearningPath = ({ path }) => {
  if (!path || path.length === 0) return null;

  const diffColors = {
    beginner: "#22c55e",
    intermediate: "#f59e0b",
    advanced: "#ef4444",
  };

  return (
    <div className="learning-container">
      <div className="learning-header">
        <BookOpen size={18} />
        <span>Learning Path</span>
      </div>
      <div className="learning-list">
        {path.map((item, i) => (
          <div key={i} className="learning-card">
            <div className="learning-step">{i + 1}</div>
            <div className="learning-content">
              <div className="learning-top">
                <span className="learning-topic">{item.topic}</span>
                <span
                  className="learning-diff"
                  style={{ color: diffColors[item.difficulty] }}
                >
                  {item.difficulty}
                </span>
              </div>
              <p className="learning-desc">{item.description}</p>
              <p className="learning-relevance">{item.relevance}</p>
              <div className="learning-resource">
                <span className="learning-type">{item.resource}</span>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="learning-link">
                    <ExternalLink size={12} /> Open
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningPath;

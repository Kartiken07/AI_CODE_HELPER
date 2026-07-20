import { ExternalLink } from "lucide-react";

const SimilarProblems = ({ problems }) => {
  if (!problems || problems.length === 0) return null;

  const difficultyColor = {
    Easy: "#22c55e",
    Medium: "#f59e0b",
    Hard: "#ef4444",
  };

  return (
    <div className="similar-container">
      <div className="similar-header">
        <span className="similar-icon">🔗</span>
        <span>Similar Problems</span>
      </div>
      <div className="similar-grid">
        {problems.map((p, i) => (
          <a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="similar-card"
          >
            <div className="similar-top">
              <span className="similar-name">{p.name}</span>
              <ExternalLink size={12} />
            </div>
            <div className="similar-meta">
              <span
                className="similar-diff"
                style={{ color: difficultyColor[p.difficulty] }}
              >
                {p.difficulty}
              </span>
              <span className="similar-platform">{p.platform}</span>
              <span className="similar-pattern">{p.pattern}</span>
            </div>
            <p className="similar-desc">{p.description}</p>
            <p className="similar-reason">{p.similarity_reason}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SimilarProblems;

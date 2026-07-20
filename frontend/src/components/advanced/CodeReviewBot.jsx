import { useState, useEffect } from "react";
import { ClipboardCheck, Loader2, CheckCircle, AlertTriangle, AlertCircle, Info, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { apiFetch } from "../../services/apiHelper";

const CodeReviewBot = ({ code, language }) => {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedIssues, setExpandedIssues] = useState({});

  const fetchReview = async () => {
    if (!code) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/code-review", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      });
      setReview(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) fetchReview();
  }, [code, language]);

  const severityConfig = {
    critical: { icon: <AlertTriangle size={14} />, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
    major: { icon: <AlertCircle size={14} />, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
    minor: { icon: <Info size={14} />, color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)" },
    suggestion: { icon: <Info size={14} />, color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" },
  };

  const verdictConfig = {
    APPROVE: { icon: <CheckCircle size={18} />, color: "#22c55e", label: "Approved" },
    REQUEST_CHANGES: { icon: <AlertTriangle size={18} />, color: "#f59e0b", label: "Changes Requested" },
    COMMENT: { icon: <Info size={18} />, color: "#6366f1", label: "Comments" },
  };

  if (loading && !review) {
    return (
      <div className="review-container">
        <div className="review-header">
          <ClipboardCheck size={18} />
          <span>Code Review</span>
        </div>
        <div className="review-loading">
          <Loader2 size={20} className="spinner" />
          <span>Reviewing your code...</span>
        </div>
      </div>
    );
  }

  if (!review && !error) return null;

  const v = verdictConfig[review?.review?.verdict] || verdictConfig.COMMENT;

  return (
    <div className="review-container">
      <div className="review-header">
        <ClipboardCheck size={18} />
        <span>Code Review</span>
      </div>

      {error && <div className="review-error">{error}</div>}

      {review && (
        <div className="review-body">
          {review.review && (
            <div className="review-verdict-section">
              <div className="verdict-badge" style={{ background: v.color + "20", color: v.color, borderColor: v.color }}>
                {v.icon}
                <span>{v.label}</span>
              </div>
              <div className="verdict-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`star ${star <= review.review.overall_rating ? "filled" : ""}`}>★</span>
                ))}
                <span className="rating-text">{review.review.overall_rating}/5</span>
              </div>
              <p className="verdict-summary">{review.review.summary}</p>
            </div>
          )}

          {review.security && (
            <div className="review-security">
              <div className="security-top">
                <Shield size={16} />
                <span>Security Score: {review.security.score}/100</span>
              </div>
              {review.security.vulnerabilities?.length > 0 ? (
                <div className="security-vulns">
                  {review.security.vulnerabilities.map((vuln, i) => (
                    <div key={i} className="vuln-item">
                      <span className="vuln-type">{vuln.type}</span>
                      <span className="vuln-severity" style={{ color: severityConfig[vuln.severity]?.color }}>{vuln.severity}</span>
                      <span className="vuln-line">Line {vuln.line}</span>
                      <p className="vuln-desc">{vuln.description}</p>
                      <p className="vuln-fix">Fix: {vuln.fix}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="no-vulns">No vulnerabilities found</span>
              )}
            </div>
          )}

          {review.issues?.length > 0 && (
            <div className="review-issues">
              <h4>Issues ({review.issues.length})</h4>
              {review.issues.map((issue, i) => {
                const config = severityConfig[issue.severity] || severityConfig.minor;
                const isOpen = expandedIssues[i];
                return (
                  <div key={i} className="review-issue" style={{ borderLeftColor: config.color }}>
                    <button className="issue-header" onClick={() => setExpandedIssues((prev) => ({ ...prev, [i]: !isOpen }))}>
                      <span className="issue-icon" style={{ color: config.color }}>{config.icon}</span>
                      <span className="issue-title">{issue.title}</span>
                      <span className="issue-cat">{issue.category}</span>
                      <span className="issue-line">L{issue.line}</span>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {isOpen && (
                      <div className="issue-body">
                        <p>{issue.description}</p>
                        <p className="issue-suggestion">💡 {issue.suggestion}</p>
                        {issue.code_suggestion && (
                          <pre className="issue-code">{issue.code_suggestion}</pre>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {review.highlights?.length > 0 && (
            <div className="review-highlights">
              <h4>✨ Highlights</h4>
              {review.highlights.map((h, i) => (
                <div key={i} className="highlight-item">
                  <span className="highlight-line">Line {h.line}</span>
                  <span>{h.comment}</span>
                </div>
              ))}
            </div>
          )}

          {review.best_practices?.length > 0 && (
            <div className="review-practices">
              <h4>Best Practices</h4>
              <ul>
                {review.best_practices.map((bp, i) => <li key={i}>{bp}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeReviewBot;

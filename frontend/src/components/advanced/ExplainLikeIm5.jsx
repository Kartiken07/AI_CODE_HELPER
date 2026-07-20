import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const ExplainLikeIm5 = ({ explanation }) => {
  const [expanded, setExpanded] = useState(false);

  if (!explanation) return null;

  return (
    <div className="eli5-container">
      <button className="eli5-toggle" onClick={() => setExpanded(!expanded)}>
        <Sparkles size={18} />
        <span>Explain Like I'm 5</span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {expanded && (
        <div className="eli5-content">
          <div className="eli5-avatar">🧒</div>
          <p className="eli5-text">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default ExplainLikeIm5;

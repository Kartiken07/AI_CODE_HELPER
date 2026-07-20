import { Clock, Trash2, Code2 } from "lucide-react";

const AnalysisHistory = ({ history, onSelect, onClear }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="history-container">
      <div className="history-header">
        <div className="history-title">
          <Clock size={16} />
          <span>Recent Analyses</span>
        </div>
        <button className="history-clear" onClick={onClear}>
          <Trash2 size={12} />
          Clear
        </button>
      </div>
      <div className="history-list">
        {history.map((item, i) => (
          <button key={i} className="history-item" onClick={() => onSelect(item)}>
            <Code2 size={14} />
            <div className="history-info">
              <span className="history-lang">{item.language}</span>
              <span className="history-preview">
                {item.code.substring(0, 50).replace(/\n/g, " ")}...
              </span>
            </div>
            <div className="history-complexity">
              <span className="complexity-tag time">{item.results?.time_complexity}</span>
              <span className="complexity-tag space">{item.results?.space_complexity}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnalysisHistory;

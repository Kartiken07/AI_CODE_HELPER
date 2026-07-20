import { useState } from "react";
import { TestTube, CheckCircle, XCircle, Copy, Check } from "lucide-react";

const TestCaseGenerator = ({ testCases, language }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  if (!testCases || testCases.length === 0) return null;

  const displayCases = showAll ? testCases : testCases.slice(0, 4);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatInput = (input) => {
    if (typeof input === "object") return JSON.stringify(input, null, 2);
    return String(input);
  };

  return (
    <div className="testcases-container">
      <div className="testcases-header">
        <TestTube size={18} />
        <span>Generated Test Cases</span>
        <span className="testcases-count">{testCases.length} tests</span>
      </div>
      <div className="testcases-list">
        {displayCases.map((tc, i) => (
          <div
            key={i}
            className={`testcase-card ${tc.edge_case ? "edge-case" : ""}`}
          >
            <div className="testcase-top">
              <div className="testcase-label">
                {tc.edge_case ? (
                  <XCircle size={14} className="edge-icon" />
                ) : (
                  <CheckCircle size={14} className="normal-icon" />
                )}
                <span>Test {i + 1}</span>
                {tc.edge_case && <span className="edge-badge">Edge Case</span>}
              </div>
              <button
                className="testcase-copy"
                onClick={() => copyToClipboard(formatInput(tc.input), i)}
              >
                {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
            <p className="testcase-desc">{tc.description}</p>
            <div className="testcase-io">
              <div className="io-block">
                <span className="io-label">Input:</span>
                <pre className="io-value">{formatInput(tc.input)}</pre>
              </div>
              <div className="io-block">
                <span className="io-label">Expected:</span>
                <pre className="io-value">{formatInput(tc.expected_output)}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
      {testCases.length > 4 && (
        <button className="testcases-toggle" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : `Show All ${testCases.length} Tests`}
        </button>
      )}
    </div>
  );
};

export default TestCaseGenerator;

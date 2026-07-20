import { FileCode } from "lucide-react";

const LineAnnotations = ({ annotations, code }) => {
  if (!annotations || annotations.length === 0 || !code) return null;

  const lines = code.split("\n");
  const annotationMap = {};
  annotations.forEach((a) => {
    annotationMap[a.line] = a;
  });

  return (
    <div className="annotations-container">
      <div className="annotations-header">
        <FileCode size={18} />
        <span>Line-by-Line Analysis</span>
      </div>
      <div className="annotations-code">
        {lines.map((line, i) => {
          const lineNum = i + 1;
          const annotation = annotationMap[lineNum];
          return (
            <div key={i} className={`annotation-line ${annotation ? "annotated" : ""}`}>
              <span className="line-number">{lineNum}</span>
              <span className="line-code">{line || " "}</span>
              {annotation && (
                <span className="line-annotation">
                  <span className="annotation-badge">{annotation.complexity}</span>
                  <span className="annotation-text">{annotation.explanation}</span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LineAnnotations;

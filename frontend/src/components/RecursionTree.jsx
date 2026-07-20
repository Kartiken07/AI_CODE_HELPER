import { GitBranch } from "lucide-react";

const RecursionTree = ({ tree }) => {
  if (!tree) return null;

  const renderNode = (node, depth = 0) => {
    if (!node) return null;
    const maxDepth = 4;
    if (depth > maxDepth) {
      return (
        <div className="tree-node tree-truncated" style={{ marginLeft: depth * 20 }}>
          <span className="node-ellipsis">... more calls</span>
        </div>
      );
    }

    return (
      <div className="tree-node-wrapper" style={{ marginLeft: depth * 20 }}>
        <div className={`tree-node depth-${Math.min(depth, 3)}`}>
          <span className="node-label">{node.root}</span>
          {node.result && <span className="node-result">= {node.result}</span>}
        </div>
        {node.children && node.children.length > 0 && (
          <div className="tree-children">
            {node.children.map((child, i) => (
              <div key={i} className="tree-branch">
                <div className="branch-line" />
                {renderNode(child, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="recursion-tree-container">
      <div className="recursion-tree-header">
        <GitBranch size={18} />
        <span>Recursion Call Tree</span>
      </div>
      <div className="recursion-tree-body">{renderNode(tree)}</div>
    </div>
  );
};

export default RecursionTree;

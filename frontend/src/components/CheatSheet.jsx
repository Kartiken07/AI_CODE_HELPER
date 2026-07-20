import { useState } from "react";
import { BookOpen, X, ChevronDown, ChevronUp } from "lucide-react";

const CHEATSHEET_DATA = [
  {
    name: "O(1)",
    label: "Constant",
    color: "#22c55e",
    examples: ["Array index access", "Hash map lookup", "Stack push/pop"],
  },
  {
    name: "O(log n)",
    label: "Logarithmic",
    color: "#06b6d4",
    examples: ["Binary search", "Balanced BST operations", "Heap operations"],
  },
  {
    name: "O(n)",
    label: "Linear",
    color: "#6366f1",
    examples: ["Single loop through array", "Linear search", "Array copy"],
  },
  {
    name: "O(n log n)",
    label: "Linearithmic",
    color: "#8b5cf6",
    examples: ["Merge sort", "Quick sort (avg)", "Heap sort"],
  },
  {
    name: "O(n²)",
    label: "Quadratic",
    color: "#f59e0b",
    examples: ["Nested loops", "Bubble sort", "Selection sort"],
  },
  {
    name: "O(n³)",
    label: "Cubic",
    color: "#f97316",
    examples: ["Triple nested loops", "Matrix multiplication"],
  },
  {
    name: "O(2ⁿ)",
    label: "Exponential",
    color: "#ef4444",
    examples: ["Fibonacci (naive)", "Power set", "Subsets"],
  },
  {
    name: "O(n!)",
    label: "Factorial",
    color: "#dc2626",
    examples: ["Permutations", "N-Queens (brute force)", "Traveling salesman"],
  },
];

const CheatSheet = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  return (
    <div className="cheatsheet-wrapper">
      <button className="cheatsheet-toggle" onClick={() => setIsOpen(!isOpen)}>
        <BookOpen size={16} />
        <span>Complexity Cheat Sheet</span>
      </button>

      {isOpen && (
        <div className="cheatsheet-panel">
          <div className="cheatsheet-header">
            <h3>Big O Complexity Reference</h3>
            <button className="cheatsheet-close" onClick={() => setIsOpen(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="cheatsheet-list">
            {CHEATSHEET_DATA.map((item) => (
              <div
                key={item.name}
                className={`cheatsheet-item ${expandedItem === item.name ? "expanded" : ""}`}
                onClick={() =>
                  setExpandedItem(expandedItem === item.name ? null : item.name)
                }
              >
                <div className="cheatsheet-item-header">
                  <span className="complexity-badge" style={{ background: item.color }}>
                    {item.name}
                  </span>
                  <span className="complexity-label">{item.label}</span>
                  {expandedItem === item.name ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </div>
                {expandedItem === item.name && (
                  <div className="cheatsheet-examples">
                    <span className="examples-title">Examples:</span>
                    <ul>
                      {item.examples.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheatSheet;

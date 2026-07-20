import { useState, useEffect, useRef } from "react";
import { Search, FileCode, Clock, Settings, X, Command } from "lucide-react";

const CommandPalette = ({ onAction, history }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { id: "analyze", label: "Analyze Code", icon: <Search size={16} />, shortcut: "Ctrl+Enter" },
    { id: "theme", label: "Toggle Theme", icon: <Settings size={16} />, shortcut: "Ctrl+T" },
    { id: "history", label: "Toggle History", icon: <Clock size={16} />, shortcut: "Ctrl+H" },
    { id: "clear", label: "Clear Editor", icon: <FileCode size={16} />, shortcut: "Ctrl+L" },
    ...(history || []).slice(0, 5).map((item, i) => ({
      id: `history-${i}`,
      label: `${item.language} — ${item.code.substring(0, 40)}...`,
      icon: <Clock size={16} />,
      isHistory: true,
      data: item,
    })),
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
      setQuery("");
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      onAction(filtered[selected]);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="palette-overlay" onClick={() => setIsOpen(false)}>
      <div className="palette-modal" onClick={(e) => e.stopPropagation()}>
        <div className="palette-input-wrap">
          <Command size={16} className="palette-icon" />
          <input
            ref={inputRef}
            className="palette-input"
            placeholder="Type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="palette-close" onClick={() => setIsOpen(false)}>
            <X size={14} />
          </button>
        </div>
        <div className="palette-list">
          {filtered.map((cmd, i) => (
            <div
              key={cmd.id}
              className={`palette-item ${i === selected ? "selected" : ""}`}
              onClick={() => {
                onAction(cmd);
                setIsOpen(false);
              }}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="palette-item-icon">{cmd.icon}</span>
              <span className="palette-item-label">{cmd.label}</span>
              {cmd.shortcut && <kbd className="palette-shortcut">{cmd.shortcut}</kbd>}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="palette-empty">No matching commands</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

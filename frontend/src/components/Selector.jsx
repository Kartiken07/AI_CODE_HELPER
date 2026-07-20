const Selector = ({ options, value, onChange, label }) => {
  return (
    <div className="selector-group">
      <label className="selector-label">{label}</label>
      <div className="selector-options">
        {options.map((option) => (
          <button
            key={option.id ?? option.label}
            className={`selector-btn ${value === option.id ? "active" : ""}`}
            onClick={() => onChange(option.id)}
          >
            <span className="selector-icon">{option.icon}</span>
            <span className="selector-text">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Selector;

const SkeletonLoader = ({ type = "default" }) => {
  if (type === "cards") {
    return (
      <div className="skeleton-cards">
        <div className="skeleton-card">
          <div className="skeleton-icon" />
          <div className="skeleton-lines">
            <div className="skeleton-line short" />
            <div className="skeleton-line title" />
            <div className="skeleton-line long" />
          </div>
        </div>
        <div className="skeleton-card">
          <div className="skeleton-icon" />
          <div className="skeleton-lines">
            <div className="skeleton-line short" />
            <div className="skeleton-line title" />
            <div className="skeleton-line long" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "graph") {
    return (
      <div className="skeleton-graph">
        <div className="skeleton-bar-group">
          {[40, 65, 50, 80, 35, 70, 55, 45, 60].map((h, i) => (
            <div key={i} className="skeleton-bar" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-default">
      <div className="skeleton-line full" />
      <div className="skeleton-line full" />
      <div className="skeleton-line medium" />
      <div className="skeleton-line full" />
      <div className="skeleton-line short" />
    </div>
  );
};

export default SkeletonLoader;

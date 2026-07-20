import { useState, useEffect } from "react";
import { BarChart3, Loader2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { apiFetch } from "../../services/apiHelper";

const CodeMetricsDashboard = ({ code, language }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMetrics = async () => {
    if (!code) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/metrics", {
        method: "POST",
        body: JSON.stringify({ code, language }),
      });
      setMetrics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) fetchMetrics();
  }, [code, language]);

  if (loading && !metrics) {
    return (
      <div className="metrics-container">
        <div className="metrics-header">
          <BarChart3 size={18} />
          <span>Code Metrics Dashboard</span>
        </div>
        <div className="metrics-loading">
          <Loader2 size={20} className="spinner" />
          <span>Calculating metrics...</span>
        </div>
      </div>
    );
  }

  if (!metrics && !error) return null;

  const m = metrics?.metrics || {};
  const r = metrics?.ratings || {};

  const radarData = [
    { subject: "Maintainability", value: m.maintainability_index || 0 },
    { subject: "Readability", value: m.code_lines ? Math.min(100, (m.comment_lines || 0) / m.code_lines * 300 + 50) : 50 },
    { subject: "Simplicity", value: Math.max(0, 100 - (m.cyclomatic_complexity || 0) * 5) },
    { subject: "Testability", value: Math.max(0, 100 - (m.cognitive_complexity || 0) * 3) },
  ];

  const barData = metrics?.breakdown?.map((fn) => ({
    name: fn.function_name?.substring(0, 12) || "fn",
    lines: fn.lines || 0,
    cyclomatic: fn.cyclomatic || 0,
    nesting: fn.nesting || 0,
  })) || [];

  const ratingColor = { good: "#22c55e", fair: "#f59e0b", poor: "#ef4444", easy: "#22c55e", moderate: "#f59e0b", hard: "#ef4444", low: "#22c55e", medium: "#f59e0b", high: "#ef4444" };

  return (
    <div className="metrics-container">
      <div className="metrics-header">
        <BarChart3 size={18} />
        <span>Code Metrics Dashboard</span>
      </div>

      {error && <div className="metrics-error">{error}</div>}

      {metrics && (
        <div className="metrics-body">
          <div className="metrics-grid">
            <div className="metric-card big">
              <span className="metric-value">{m.lines_of_code || 0}</span>
              <span className="metric-label">Lines of Code</span>
              <div className="metric-breakdown">
                <span className="code">{m.code_lines || 0} code</span>
                <span className="blank">{m.blank_lines || 0} blank</span>
                <span className="comment">{m.comment_lines || 0} comments</span>
              </div>
            </div>
            <div className="metric-card">
              <span className="metric-value">{m.functions || 0}</span>
              <span className="metric-label">Functions</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">{m.classes || 0}</span>
              <span className="metric-label">Classes</span>
            </div>
            <div className="metric-card highlight">
              <span className="metric-value">{m.cyclomatic_complexity || 0}</span>
              <span className="metric-label">Cyclomatic Complexity</span>
            </div>
            <div className="metric-card highlight">
              <span className="metric-value">{m.cognitive_complexity || 0}</span>
              <span className="metric-label">Cognitive Complexity</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">{m.max_nesting_depth || 0}</span>
              <span className="metric-label">Max Nesting</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">{m.avg_function_length || 0}</span>
              <span className="metric-label">Avg Function Length</span>
            </div>
            <div className="metric-card">
              <span className="metric-value">{m.avg_params_per_function || 0}</span>
              <span className="metric-label">Avg Params</span>
            </div>
          </div>

          {Object.keys(r).length > 0 && (
            <div className="metrics-ratings">
              <h4>Ratings</h4>
              <div className="rating-chips">
                {Object.entries(r).map(([key, val]) => (
                  <span key={key} className="rating-chip" style={{ borderColor: ratingColor[val] }}>
                    <span className="rating-key">{key.replace(/_/g, " ")}</span>
                    <span className="rating-val" style={{ color: ratingColor[val] }}>{val}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="metrics-charts">
            {barData.length > 0 && (
              <div className="metrics-chart-card">
                <h4><TrendingUp size={14} /> Function Breakdown</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8, color: "#fff" }} />
                    <Bar dataKey="lines" fill="#6366f1" radius={[4, 4, 0, 0]} name="Lines" />
                    <Bar dataKey="cyclomatic" fill="#22c55e" radius={[4, 4, 0, 0]} name="Complexity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="metrics-chart-card">
              <h4>Code Profile</h4>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" stroke="#888" tick={{ fontSize: 10, fill: "#aaa" }} />
                  <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeMetricsDashboard;

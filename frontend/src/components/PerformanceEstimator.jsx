import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Gauge, Clock, HardDrive, AlertTriangle } from "lucide-react";

const PerformanceEstimator = ({ performanceEstimate }) => {
  const [view, setView] = useState("time");

  if (!performanceEstimate || !performanceEstimate.input_sizes) return null;

  const { input_sizes, bottleneck_operation, optimization_potential } =
    performanceEstimate;

  const formatTime = (ms) => {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
  };

  const formatMemory = (mb) => {
    if (mb < 0.001) return `${(mb * 1000000).toFixed(0)}B`;
    if (mb < 1) return `${(mb * 1000).toFixed(1)}KB`;
    if (mb < 1024) return `${mb.toFixed(1)}MB`;
    return `${(mb / 1024).toFixed(2)}GB`;
  };

  const chartData = input_sizes.map((s) => ({
    n: s.n.toLocaleString(),
    n_raw: s.n,
    time: s.time_ms,
    memory: s.memory_mb,
    time_label: formatTime(s.time_ms),
    memory_label: formatMemory(s.memory_mb),
  }));

  const potentialColors = {
    high: { bg: "rgba(34, 197, 94, 0.15)", color: "#22c55e" },
    medium: { bg: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" },
    low: { bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444" },
  };

  const potColor = potentialColors[optimization_potential] || potentialColors.medium;

  return (
    <div className="estimator-container">
      <div className="estimator-header">
        <Gauge size={18} />
        <span>Performance Estimator</span>
      </div>

      <div className="estimator-stats">
        <div className="estat-card">
          <Clock size={16} />
          <span className="estat-label">Bottleneck</span>
          <span className="estat-value">{bottleneck_operation || "N/A"}</span>
        </div>
        <div className="estat-card">
          <AlertTriangle size={16} />
          <span className="estat-label">Optimization Potential</span>
          <span
            className="estat-badge"
            style={{ background: potColor.bg, color: potColor.color }}
          >
            {optimization_potential || "N/A"}
          </span>
        </div>
      </div>

      <div className="estimator-tabs">
        <button
          className={`estab ${view === "time" ? "active" : ""}`}
          onClick={() => setView("time")}
        >
          <Clock size={14} /> Time
        </button>
        <button
          className={`estab ${view === "memory" ? "active" : ""}`}
          onClick={() => setView("memory")}
        >
          <HardDrive size={14} /> Memory
        </button>
      </div>

      <div className="estimator-chart">
        <ResponsiveContainer width="100%" height={280}>
          {view === "time" ? (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="n" stroke="#888" tick={{ fill: "#aaa", fontSize: 11 }} />
              <YAxis
                stroke="#888"
                tick={{ fill: "#aaa", fontSize: 11 }}
                tickFormatter={formatTime}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                formatter={(val) => [formatTime(val), "Time"]}
                labelFormatter={(n) => `n = ${n}`}
              />
              <defs>
                <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="time" stroke="#6366f1" strokeWidth={2} fill="url(#timeGrad)" />
            </AreaChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="n" stroke="#888" tick={{ fill: "#aaa", fontSize: 11 }} />
              <YAxis
                stroke="#888"
                tick={{ fill: "#aaa", fontSize: 11 }}
                tickFormatter={formatMemory}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid #333", borderRadius: "8px", color: "#fff" }}
                formatter={(val) => [formatMemory(val), "Memory"]}
                labelFormatter={(n) => `n = ${n}`}
              />
              <Bar dataKey="memory" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="estimator-table">
        <div className="etable-header">
          <span>Input Size</span>
          <span>Time</span>
          <span>Memory</span>
        </div>
        {input_sizes.map((s, i) => (
          <div key={i} className="etable-row">
            <span className="etable-n">n = {s.n.toLocaleString()}</span>
            <span className="etable-time">{formatTime(s.time_ms)}</span>
            <span className="etable-mem">{formatMemory(s.memory_mb)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceEstimator;

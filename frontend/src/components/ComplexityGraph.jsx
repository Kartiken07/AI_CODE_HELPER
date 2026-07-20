import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { useState } from "react";
import { BarChart3, TrendingUp, Activity } from "lucide-react";

const ComplexityGraph = ({ timeData, spaceData, timeComplexity, spaceComplexity }) => {
  const [activeTab, setActiveTab] = useState("time");
  const [chartType, setChartType] = useState("area");

  const renderChart = (data, dataKey, color, label) => {
    if (!data || data.length === 0) return <div className="no-data">No data available</div>;

    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 },
    };

    const commonElements = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis
          dataKey="n"
          stroke="#888"
          tick={{ fill: "#aaa", fontSize: 12 }}
          label={{ value: "Input Size (n)", position: "bottom", fill: "#888", offset: 0 }}
        />
        <YAxis
          stroke="#888"
          tick={{ fill: "#aaa", fontSize: 12 }}
          label={{ value: label, angle: -90, position: "insideLeft", fill: "#888" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a2e",
            border: "1px solid #333",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value) => [value.toLocaleString(), label]}
          labelFormatter={(n) => `n = ${n}`}
        />
        <Legend />
      </>
    );

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {commonElements}
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case "line":
        return (
          <LineChart {...commonProps}>
            {commonElements}
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        );
      default:
        return (
          <AreaChart {...commonProps}>
            {commonElements}
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              fill={`url(#gradient-${dataKey})`}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="graph-container">
      <div className="graph-header">
        <div className="graph-tabs">
          <button
            className={`graph-tab ${activeTab === "time" ? "active" : ""}`}
            onClick={() => setActiveTab("time")}
          >
            <TrendingUp size={16} />
            Time Complexity
          </button>
          <button
            className={`graph-tab ${activeTab === "space" ? "active" : ""}`}
            onClick={() => setActiveTab("space")}
          >
            <Activity size={16} />
            Space Complexity
          </button>
        </div>
        <div className="chart-type-selector">
          <button
            className={`chart-btn ${chartType === "area" ? "active" : ""}`}
            onClick={() => setChartType("area")}
          >
            Area
          </button>
          <button
            className={`chart-btn ${chartType === "line" ? "active" : ""}`}
            onClick={() => setChartType("line")}
          >
            Line
          </button>
          <button
            className={`chart-btn ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
          >
            <BarChart3 size={14} />
          </button>
        </div>
      </div>

      <div className="complexity-badge">
        {activeTab === "time" ? timeComplexity : spaceComplexity}
      </div>

      <div className="graph-chart">
        <ResponsiveContainer width="100%" height={350}>
          {activeTab === "time"
            ? renderChart(timeData, "operations", "#6366f1", "Operations")
            : renderChart(spaceData, "memory", "#22c55e", "Memory (units)")}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplexityGraph;

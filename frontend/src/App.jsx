import { useState, useCallback, useEffect, useRef } from "react";
import CodeEditor from "./components/CodeEditor";
import ComplexityGraph from "./components/ComplexityGraph";
import AnalysisResults from "./components/AnalysisResults";
import Selector from "./components/Selector";
import FileUpload from "./components/FileUpload";
import CodeComparison from "./components/CodeComparison";
import ExportReport from "./components/ExportReport";
import AnalysisHistory from "./components/AnalysisHistory";
import CheatSheet from "./components/CheatSheet";
import LineAnnotations from "./components/LineAnnotations";
import RecursionTree from "./components/RecursionTree";
import PatternDetection from "./components/PatternDetection";
import ThemeToggle from "./components/ThemeToggle";
import CodePlayground from "./components/CodePlayground";
import ComplexityHeatmap from "./components/ComplexityHeatmap";
import TestCaseGenerator from "./components/TestCaseGenerator";
import PerformanceEstimator from "./components/PerformanceEstimator";
import MultiLanguageCompare from "./components/MultiLanguageCompare";
import AlgorithmAnimation from "./components/AlgorithmAnimation";
import CodeQualityScore from "./components/CodeQualityScore";
import ParticleBackground from "./components/ui/ParticleBackground";
import AnimatedTitle from "./components/ui/AnimatedTitle";
import CelebrationConfetti from "./components/ui/CelebrationConfetti";
import CommandPalette from "./components/ui/CommandPalette";
import SkeletonLoader from "./components/ui/SkeletonLoader";
import AIChat from "./components/advanced/AIChat";
import CodeRunner from "./components/advanced/CodeRunner";
import FlowchartGenerator from "./components/advanced/FlowchartGenerator";
import SimilarProblems from "./components/advanced/SimilarProblems";
import ExplainLikeIm5 from "./components/advanced/ExplainLikeIm5";
import MultiApproachCompare from "./components/advanced/MultiApproachCompare";
import DifficultyEstimator from "./components/advanced/DifficultyEstimator";
import LearningPath from "./components/advanced/LearningPath";
import CodeSmellDetector from "./components/advanced/CodeSmellDetector";
import CodeMetricsDashboard from "./components/advanced/CodeMetricsDashboard";
import CodeReviewBot from "./components/advanced/CodeReviewBot";
import { analyzeCode, checkHealth } from "./services/api";
import { SAMPLE_CODES, LANGUAGES, PLATFORMS } from "./services/constants";
import {
  Loader2,
  Search,
  AlertCircle,
  CheckCircle2,
  Terminal,
  History,
  Keyboard,
} from "lucide-react";
import "./App.css";

const HISTORY_KEY = "codescope_history";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [platform, setPlatform] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [showHistory, setShowHistory] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const saveToHistory = (codeText, lang, plat, res) => {
    const entry = {
      code: codeText,
      language: lang,
      platform: plat,
      results: res,
      timestamp: Date.now(),
    };
    const updated = [entry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  };

  const checkBackend = useCallback(async () => {
    const status = await checkHealth();
    setBackendStatus(status);
    return status.status === "ok";
  }, []);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError("Please enter some code to analyze");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    setShowSkeleton(true);
    const isHealthy = await checkBackend();
    if (!isHealthy) {
      setError("Backend server is not running. Start it with: cd backend && python main.py");
      setLoading(false);
      setShowSkeleton(false);
      return;
    }
    try {
      const data = await analyzeCode(code, language, platform);
      setResults(data);
      saveToHistory(code, language, platform, data);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 500);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  };

  const handleLoadSample = () => {
    const samples = SAMPLE_CODES[language];
    if (samples) {
      const firstSample = Object.values(samples)[0];
      setCode(firstSample);
      setCurrentFile(null);
    }
  };

  const handleFileUpload = (fileCode, fileLang, fileName) => {
    setCode(fileCode);
    setLanguage(fileLang);
    setCurrentFile(fileName);
  };

  const handleClearFile = () => {
    setCurrentFile(null);
    setCode("");
  };

  const handleHistorySelect = (item) => {
    setCode(item.code);
    setLanguage(item.language);
    setPlatform(item.platform);
    setResults(item.results);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handlePlaygroundReAnalyze = async (newCode) => {
    setLoading(true);
    setError(null);
    setShowSkeleton(true);
    try {
      const data = await analyzeCode(newCode, language, platform);
      setResults(data);
      setCode(newCode);
      saveToHistory(newCode, language, platform, data);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleAnalyze();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "l") {
        e.preventDefault();
        setCode("");
        setResults(null);
        setCurrentFile(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "t") {
        e.preventDefault();
        toggleTheme();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "h") {
        e.preventDefault();
        setShowHistory((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [code, language, platform, theme]);

  const handleCommandAction = (cmd) => {
    if (cmd.id === "analyze") handleAnalyze();
    else if (cmd.id === "theme") toggleTheme();
    else if (cmd.id === "history") setShowHistory((prev) => !prev);
    else if (cmd.id === "clear") { setCode(""); setResults(null); }
    else if (cmd.isHistory && cmd.data) handleHistorySelect(cmd.data);
  };

  return (
    <div className="app" data-theme={theme}>
      <ParticleBackground />
      <CelebrationConfetti trigger={showConfetti} />
      <CommandPalette onAction={handleCommandAction} history={history} />

      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Terminal size={28} className="logo-icon-spin" />
            <AnimatedTitle />
            <span className="subtitle">AI-Powered Complexity Analyzer</span>
          </div>
          <div className="header-actions">
            <kbd className="shortcut-hint" title="Press Ctrl+K for commands">
              <Keyboard size={14} /> ⌘K
            </kbd>
            {history.length > 0 && (
              <button className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
                <History size={16} />
                <span>{history.length}</span>
              </button>
            )}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            {backendStatus && (
              <div className={`status-badge ${backendStatus.status === "ok" ? "online" : "offline"}`}>
                {backendStatus.status === "ok" ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                {backendStatus.status === "ok" ? "Connected" : "Disconnected"}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {showHistory && (
          <AnalysisHistory history={history} onSelect={handleHistorySelect} onClear={handleClearHistory} />
        )}

        <div className="controls-row">
          <Selector label="Language" options={LANGUAGES} value={language} onChange={setLanguage} />
          <Selector label="Platform" options={PLATFORMS} value={platform} onChange={setPlatform} />
        </div>

        <div className="editor-section-top">
          <FileUpload onFileUpload={handleFileUpload} currentFile={currentFile} onClearFile={handleClearFile} />
          <CheatSheet />
        </div>

        <CodeEditor code={code} setCode={setCode} language={language} onLoadSample={handleLoadSample} />

        <div className="analyze-section">
          <button className="analyze-btn" onClick={handleAnalyze} disabled={loading || !code.trim()}>
            {loading ? (
              <><Loader2 size={18} className="spinner" /> Analyzing...</>
            ) : (
              <><Search size={18} /> Analyze Complexity</>
            )}
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {showSkeleton && (
          <div className="results-wrapper">
            <SkeletonLoader type="cards" />
            <SkeletonLoader type="graph" />
          </div>
        )}

        {results && !showSkeleton && (
          <div className="results-wrapper" ref={resultsRef}>
            <div className="results-top-bar">
              <AnalysisResults results={results} />
              <ExportReport results={results} code={code} language={language} />
            </div>

            <DifficultyEstimator estimate={results.difficulty_estimate} />
            <CodeQualityScore codeQuality={results.code_quality} />
            <PatternDetection patterns={results.algorithm_patterns} />
            <ExplainLikeIm5 explanation={results.eli5_explanation} />
            <ComplexityHeatmap heatmapData={results.heatmap_data} code={code} />
            <PerformanceEstimator performanceEstimate={results.performance_estimate} />
            <FlowchartGenerator flowchart={results.flowchart} code={code} />
            <SimilarProblems problems={results.similar_problems} />
            <LearningPath path={results.learning_path} />
            <CodeRunner code={code} language={language} />
            <CodeSmellDetector code={code} language={language} />
            <CodeMetricsDashboard code={code} language={language} />
            <CodeReviewBot code={code} language={language} />
            <CodeComparison original={code} optimized={results.optimized_code} />
            <CodePlayground optimizedCode={results.optimized_code} language={language} onReAnalyze={handlePlaygroundReAnalyze} loading={loading} />
            <MultiApproachCompare approaches={results.multi_approaches} />
            <TestCaseGenerator testCases={results.test_cases} language={language} />
            <MultiLanguageCompare originalCode={code} sourceLanguage={language} />
            <AlgorithmAnimation animationSteps={results.animation_steps} code={code} />
            <LineAnnotations annotations={results.line_annotations} code={code} />
            <RecursionTree tree={results.recursion_tree} />
            <ComplexityGraph timeData={results.time_graph_data} spaceData={results.space_graph_data} timeComplexity={results.time_complexity} spaceComplexity={results.space_complexity} />
          </div>
        )}
      </main>

      <AIChat code={code} language={language} analysisContext={results} />

      <footer className="app-footer">
        <p>Powered by Groq AI &bull; Built with React + FastAPI</p>
      </footer>
    </div>
  );
}

export default App;

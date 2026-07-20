import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Film } from "lucide-react";

const AlgorithmAnimation = ({ animationSteps, code }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && animationSteps) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= animationSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, animationSteps]);

  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, [animationSteps]);

  if (!animationSteps || animationSteps.length === 0) return null;

  const step = animationSteps[currentStep];
  const lines = code ? code.split("\n") : [];

  const handlePlay = () => {
    if (currentStep >= animationSteps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(animationSteps.length - 1, prev + 1));
  };

  return (
    <div className="animation-container">
      <div className="animation-header">
        <Film size={18} />
        <span>Algorithm Animation</span>
        <span className="animation-step-label">
          Step {currentStep + 1} / {animationSteps.length}
        </span>
      </div>

      <div className="animation-body">
        <div className="animation-code">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isHighlighted = step?.code_highlight?.includes(lineNum);
            return (
              <div
                key={i}
                className={`anim-line ${isHighlighted ? "highlighted" : ""}`}
              >
                <span className="anim-line-num">{lineNum}</span>
                <span className="anim-line-code">{line || " "}</span>
              </div>
            );
          })}
        </div>

        <div className="animation-sidebar">
          <div className="anim-description">
            <span className="anim-desc-label">What's happening:</span>
            <p>{step?.description}</p>
          </div>

          <div className="anim-state">
            <span className="anim-state-label">Variable State:</span>
            <div className="anim-variables">
              {step?.state?.variables &&
                Object.entries(step.state.variables).map(([key, val]) => (
                  <div key={key} className="anim-var">
                    <span className="var-name">{key}</span>
                    <span className="var-value">= {JSON.stringify(val)}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="anim-ops">
            <span className="anim-ops-label">Operations:</span>
            <span className="anim-ops-count">{step?.operation_count || 0}</span>
          </div>
        </div>
      </div>

      <div className="animation-controls">
        <button className="anim-btn" onClick={handleReset} title="Reset">
          <RotateCcw size={16} />
        </button>
        <button className="anim-btn" onClick={handlePrev} disabled={currentStep === 0}>
          <SkipBack size={16} />
        </button>
        <button className="anim-btn play" onClick={handlePlay}>
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          className="anim-btn"
          onClick={handleNext}
          disabled={currentStep >= animationSteps.length - 1}
        >
          <SkipForward size={16} />
        </button>
        <div className="anim-speed">
          <label>Speed:</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="anim-speed-select"
          >
            <option value={2000}>0.5x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={250}>4x</option>
          </select>
        </div>
      </div>

      <div className="animation-progress">
        <div
          className="animation-progress-fill"
          style={{ width: `${((currentStep + 1) / animationSteps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default AlgorithmAnimation;

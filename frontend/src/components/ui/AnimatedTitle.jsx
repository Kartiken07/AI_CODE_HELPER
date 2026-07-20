import { useState, useEffect } from "react";

const AnimatedTitle = () => {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`animated-title ${glitch ? "glitch" : ""}`}>
      <h1 className="title-text" data-text="CodeScope">
        CodeScope
      </h1>
      <div className="title-cursor" />
    </div>
  );
};

export default AnimatedTitle;

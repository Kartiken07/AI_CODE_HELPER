import { useEffect, useState } from "react";

const CelebrationConfetti = ({ trigger }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ["#6366f1", "#8b5cf6", "#22c55e", "#06b6d4", "#f59e0b", "#ef4444"];
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      velocityX: (Math.random() - 0.5) * 8,
      velocityY: Math.random() * -15 - 5,
      shape: Math.random() > 0.5 ? "circle" : "square",
    }));

    setParticles(newParticles);
    const timeout = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timeout);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`confetti-particle confetti-${p.shape}`}
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            "--vx": `${p.velocityX * 20}px`,
            "--vy": `${p.velocityY * 20}px`,
            "--rot": `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
};

export default CelebrationConfetti;

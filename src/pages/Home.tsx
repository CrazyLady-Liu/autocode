import { useEffect, useRef, useState } from "react";

function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const gridSize = 60;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offset += 0.15;

      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const dx = x - canvas.width / 2;
          const dy = y - canvas.height / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.sqrt(
            (canvas.width / 2) ** 2 + (canvas.height / 2) ** 2
          );
          const alpha = Math.max(0, 0.06 - (dist / maxDist) * 0.04);
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.fillRect(x + (Math.sin(offset + y * 0.01) * 2), y, 1, 1);
        }
      }

      requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

function FloatingOrb({
  className,
  delay,
}: {
  className: string;
  delay: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-float ${className}`}
      style={{ animationDelay: delay }}
    />
  );
}

function TypewriterText({
  text,
  delay = 0,
  speed = 120,
  className,
  gradient = false,
  onDone,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  gradient?: boolean;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      onDone?.();
      const blink = setInterval(() => setShowCursor((v) => !v), 530);
      return () => clearInterval(blink);
    }
  }, [displayed, started, text, speed, onDone]);

  const spanClass = gradient
    ? "bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-rose bg-clip-text text-transparent"
    : "";

  return (
    <span className={className}>
      <span className={spanClass}>{displayed}</span>
      {showCursor && (
        <span className="inline-block w-[3px] h-[0.85em] bg-accent-cyan ml-1 align-middle animate-pulse" />
      )}
    </span>
  );
}

export default function Home() {
  const [helloDone, setHelloDone] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-violet/5 animate-gradient" />

      <GridBackground />

      <FloatingOrb
        className="w-96 h-96 bg-accent-cyan/30 -top-20 -left-20"
        delay="0s"
      />
      <FloatingOrb
        className="w-80 h-80 bg-accent-violet/30 -bottom-10 -right-10"
        delay="2s"
      />
      <FloatingOrb
        className="w-64 h-64 bg-accent-rose/20 top-1/3 right-1/4"
        delay="4s"
      />

      <div className="relative z-10 text-center px-4">
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <p className="font-mono text-xs tracking-[0.4em] text-accent-cyan/60 uppercase mb-6">
            Welcome to
          </p>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <h1 className="font-display font-extrabold text-7xl sm:text-8xl md:text-9xl tracking-tight text-white animate-glow">
            <TypewriterText
              text="Hello"
              delay={800}
              speed={150}
              onDone={() => setHelloDone(true)}
            />
          </h1>
        </div>

        <div
          className="animate-line mt-8 mx-auto h-px w-48 bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent origin-center"
          style={{ animationDelay: helloDone ? "0s" : "999s" }}
        />

        {helloDone && (
          <div className="animate-fade-in-up">
            <p className="font-mono text-sm text-white/30 mt-8 tracking-wider">
              built with React + Vite + Tailwind
            </p>
          </div>
        )}

        {helloDone && (
          <div className="flex items-center justify-center gap-3 mt-10 animate-fade-in-up">
            {["bg-accent-cyan", "bg-accent-violet", "bg-accent-rose"].map(
              (color, i) => (
                <span
                  key={color}
                  className={`w-1.5 h-1.5 rounded-full ${color} animate-dot`}
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              )
            )}
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-fade-in-up" style={{ animationDelay: "2s" }}>
        <div className="w-5 h-8 rounded-full border border-white/10 flex items-start justify-center p-1">
          <div className="w-0.5 h-2 rounded-full bg-accent-cyan/50 animate-float" style={{ animationDuration: "2s" }} />
        </div>
      </div>
    </div>
  );
}

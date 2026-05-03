"use client";
import { useEffect, useRef, useState } from "react";

interface MarqueeProps {
  items: React.ReactNode[];
  speed?: number;
}

export function Marquee({ items, speed = 60 }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const state = useRef({
    x: 0,
    speed,
    targetSpeed: speed,
    lastTime: 0,
    raf: 0,
  });

  useEffect(() => {
    const s = state.current;

    function tick(now: number) {
      const track = trackRef.current;
      if (!track) {
        return;
      }
      if (!s.lastTime) s.lastTime = now;
      const dt = Math.min((now - s.lastTime) / 1000, 0.05);
      s.lastTime = now;

      // Smooth lerp toward target speed
      s.speed += (s.targetSpeed - s.speed) * (1 - Math.pow(0.005, dt * 6));

      // Always move left only — scroll has zero effect on direction
      s.x -= s.speed * dt;

      // Seamless wrap: track is 3× the original item set
      const unit = track.scrollWidth / 3;
      if (s.x <= -unit) s.x += unit;

      track.style.transform = `translate3d(${s.x}px, 0, 0)`;
      s.raf = requestAnimationFrame(tick);
    }

    s.raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(s.raf);
      s.lastTime = 0;
    };
  }, [speed]);

  const len = items.length;
  const tripled = [...items, ...items, ...items];

  function handleMouseEnter(i: number) {
    setHoveredIndex(i % len);
    state.current.targetSpeed = 0;
  }

  function handleMouseLeave() {
    setHoveredIndex(null);
    state.current.targetSpeed = speed;
  }

  return (
    <div className="overflow-hidden w-full relative">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

      <div
        ref={trackRef}
        className="flex items-center"
        style={{ width: "max-content", willChange: "transform" }}
      >
        {tripled.map((item, i) => {
          const isHighlighted =
            hoveredIndex !== null && i % len === hoveredIndex;
          const isDimmed = hoveredIndex !== null && !isHighlighted;
          return (
            <div
              key={i}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={handleMouseLeave}
              style={{
                flexShrink: 0,
                padding: "0 2.5rem",
                transition:
                  "opacity 0.35s ease, transform 0.35s ease, filter 0.35s ease",
                opacity: isDimmed ? 0.3 : 1,
                transform: isHighlighted ? "scale(1.1)" : "scale(1)",
                filter: isHighlighted
                  ? "brightness(1.4) drop-shadow(0 0 14px rgba(255,255,255,0.18))"
                  : "none",
                cursor: "default",
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

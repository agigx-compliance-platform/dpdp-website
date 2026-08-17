"use client";

import React, { useState, useEffect, useRef } from "react";

// Clock hand angles (hour, minute)
const H = { h: 0, m: 180 };
const V = { h: 270, m: 90 };
const TL = { h: 180, m: 270 };
const TR = { h: 0, m: 270 };
const BL = { h: 180, m: 90 };
const BR = { h: 0, m: 90 };
const E = { h: 135, m: 135 }; // Diagonal resting state

// 4x6 Grid matrix for numbers 0-9
const digits = [
  [
    BR,
    H,
    H,
    BL,
    V,
    BR,
    BL,
    V,
    V,
    V,
    V,
    V,
    V,
    V,
    V,
    V,
    V,
    TR,
    TL,
    V,
    TR,
    H,
    H,
    TL,
  ], // 0
  [
    BR,
    H,
    BL,
    E,
    TR,
    BL,
    V,
    E,
    E,
    V,
    V,
    E,
    E,
    V,
    V,
    E,
    BR,
    TL,
    TR,
    BL,
    TR,
    H,
    H,
    TL,
  ], // 1
  [
    BR,
    H,
    H,
    BL,
    TR,
    H,
    BL,
    V,
    BR,
    H,
    TL,
    V,
    V,
    BR,
    H,
    TL,
    V,
    TR,
    H,
    BL,
    TR,
    H,
    H,
    TL,
  ], // 2
  [
    BR,
    H,
    H,
    BL,
    TR,
    H,
    BL,
    V,
    E,
    BR,
    TL,
    V,
    E,
    TR,
    BL,
    V,
    BR,
    H,
    TL,
    V,
    TR,
    H,
    H,
    TL,
  ], // 3
  [
    BR,
    BL,
    BR,
    BL,
    V,
    V,
    V,
    V,
    V,
    TR,
    TL,
    V,
    TR,
    H,
    BL,
    V,
    E,
    E,
    V,
    V,
    E,
    E,
    TR,
    TL,
  ], // 4
  [
    BR,
    H,
    H,
    BL,
    V,
    BR,
    H,
    TL,
    V,
    TR,
    H,
    BL,
    TR,
    H,
    BL,
    V,
    BR,
    H,
    TL,
    V,
    TR,
    H,
    H,
    TL,
  ], // 5
  [
    BR,
    H,
    H,
    BL,
    V,
    BR,
    H,
    TL,
    V,
    TR,
    H,
    BL,
    V,
    BR,
    BL,
    V,
    V,
    TR,
    TL,
    V,
    TR,
    H,
    H,
    TL,
  ], // 6
  [
    BR,
    H,
    H,
    BL,
    TR,
    H,
    BL,
    V,
    E,
    E,
    V,
    V,
    E,
    E,
    V,
    V,
    E,
    E,
    V,
    V,
    E,
    E,
    TR,
    TL,
  ], // 7
  [
    BR,
    H,
    H,
    BL,
    V,
    BR,
    BL,
    V,
    V,
    TR,
    TL,
    V,
    V,
    BR,
    BL,
    V,
    V,
    TR,
    TL,
    V,
    TR,
    H,
    H,
    TL,
  ], // 8
  [
    BR,
    H,
    H,
    BL,
    V,
    BR,
    BL,
    V,
    V,
    TR,
    TL,
    V,
    TR,
    H,
    BL,
    V,
    BR,
    H,
    TL,
    V,
    TR,
    H,
    H,
    TL,
  ], // 9
];

// Ensures the clock hands take the shortest, most natural rotation path
const normalizeAngle = (next: number, prev: number) => {
  const delta = (((next - prev) % 360) + 360) % 360;
  return prev + delta;
};

const randomAngle = () => Math.floor(Math.random() * 90);

// Single Clock Node Component
const Clock = ({
  h,
  m,
  initial,
}: {
  h: number;
  m: number;
  initial: boolean;
}) => {
  const clockRef = useRef<HTMLDivElement>(null);
  const [angles, setAngles] = useState({ h: 0, m: 0 });

  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  // NEW: We add a state to track the total cumulative spins
  const [spinOffset, setSpinOffset] = useState({ h: 0, m: 0 });

  useEffect(() => {
    queueMicrotask(() => {
      setAngles((prev) => ({
        h: normalizeAngle(h, prev.h),
        m: normalizeAngle(m, prev.m),
      }));
    });
  }, [h, m]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!clockRef.current) return;

      const rect = clockRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

      const shouldHover = distance < 50;

      if (shouldHover !== isHoveredRef.current) {
        isHoveredRef.current = shouldHover;
        setIsHovered(shouldHover);

        // THE MAGIC: Only when the mouse *enters* the radius, we push the gears forward
        // exactly one rotation. Because it's 360 degrees, it lands back on the exact right time.
        if (shouldHover) {
          setSpinOffset((prev) => ({
            h: prev.h + 360,
            m: prev.m - 360,
          }));
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Add our permanent hover spins to the underlying correct time
  let displayH = angles.h + spinOffset.h;
  let displayM = angles.m + spinOffset.m;

  return (
    <div
      ref={clockRef}
      className={`relative w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-5 md:h-5 rounded-full shrink-0 border transition-all duration-500 ${
        isHovered
          ? "border-primary/50 bg-card z-30 shadow-glow-primary"
          : "border-border bg-background z-0 shadow-sm"
      }`}
      style={
        {
          "--hour-angle": initial ? randomAngle() : displayH,
          "--minute-angle": initial ? randomAngle() : displayM,
          // Constant 1.5s duration gives it that heavy, premium inertia
          // even if your mouse leaves the clock before the spin finishes
          "--dur": 1.5,
        } as React.CSSProperties
      }
    >
      {/* Hour Hand */}
      <div
        className={`absolute top-1/2 left-1/2 h-[1px] md:h-[2px] w-[45%] bg-primary rounded-full origin-left ease-in-out ${
          isHovered ? "shadow-glow-primary" : ""
        }`}
        style={{
          transform: `translate(0, -50%) rotate(calc(var(--hour-angle) * 1deg))`,
          transitionProperty: "transform",
          transitionDuration: `calc(var(--dur) * 1s)`,
        }}
      />
      {/* Minute Hand */}
      <div
        className={`absolute top-1/2 left-1/2 h-[1px] md:h-[2px] w-[45%] bg-primary/70 rounded-full origin-left ease-in-out ${
          isHovered ? "shadow-glow-primary" : "shadow-sm"
        }`}
        style={{
          transform: `translate(0, -50%) rotate(calc(var(--minute-angle) * 1deg))`,
          transitionProperty: "transform",
          transitionDuration: `calc(var(--dur) * 1s)`,
        }}
      />
    </div>
  );
};

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    d: "000",
    h: "00",
    m: "00",
    s: "00",
  });
  const [initial, setInitial] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setIsMounted(true));

    const getTimeRemaining = () => {
      const total = Date.parse(targetDate) - Date.parse(new Date().toString());
      if (total <= 0) return { d: "000", h: "00", m: "00", s: "00" };

      const days = Math.floor(total / (1000 * 60 * 60 * 24));
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const seconds = Math.floor((total / 1000) % 60);

      return {
        d: String(days).padStart(3, "0"),
        h: hours < 10 ? `0${hours}` : String(hours),
        m: minutes < 10 ? `0${minutes}` : String(minutes),
        s: seconds < 10 ? `0${seconds}` : String(seconds),
      };
    };

    let updateTimerId: NodeJS.Timeout;

    const updateTime = () => {
      setTimeLeft(getTimeRemaining());
      const now = Date.now();
      const delay = 1000 - (now % 1000);
      updateTimerId = setTimeout(updateTime, delay);
    };

    const initialTimerId = setTimeout(() => {
      setInitial(false);
      updateTime();
    }, 800);

    return () => {
      clearTimeout(updateTimerId);
      clearTimeout(initialTimerId);
    };
  }, [targetDate]);

  if (!isMounted) return null;

  const groups = [
    { label: "DAYS", value: timeLeft.d },
    { label: "HOURS", value: timeLeft.h },
    { label: "MINUTES", value: timeLeft.m },
    { label: "SECONDS", value: timeLeft.s },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full py-12 overflow-hidden">
      <p className="mb-8 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
        Time remaining until enforcement
      </p>

      <div className="flex items-start space-x-3 sm:space-x-6 md:space-x-10">
        {groups.map((group, groupIdx) => (
          <React.Fragment key={group.label}>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 min-h-[2.5rem] sm:min-h-[3.5rem] md:min-h-[5rem]">
                {group.value.split("").map((char, digitIdx) => (
                  <div
                    key={digitIdx}
                    className="grid grid-cols-4 gap-[2px] sm:gap-[3px]"
                  >
                    {digits[Number(char)].map(({ h, m }, clockIdx) => (
                      <Clock key={clockIdx} h={h} m={m} initial={initial} />
                    ))}
                  </div>
                ))}
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.25em] text-slate-500 uppercase">
                {group.label}
              </span>
            </div>

            {groupIdx < groups.length - 1 && (
              <div className="flex flex-col justify-center space-y-4 sm:space-y-6 min-h-[2.5rem] sm:min-h-[3.5rem] md:min-h-[5rem] self-start">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/40 shadow-sm animate-pulse" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary/40 shadow-sm animate-pulse" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

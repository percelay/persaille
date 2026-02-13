"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import InteractiveStrip from "./interactive-strip";

const NAV_ITEMS = [
  "contact",
  "writing",
  "product",
  "website",
  "resume",
  "cold call",
  "linkedin",
];

function SidebarItem({
  item,
  isHovered,
  isNeighbor,
  onEnter,
  onLeave,
}: {
  item: string;
  isHovered: boolean;
  isNeighbor: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const hoverStart = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    if (!ref.current) return;
    const elapsed = (Date.now() - hoverStart.current) / 1000;
    // Intensity grows from 1px to 6px over ~3 seconds, then caps
    const intensity = Math.min(1 + elapsed * 2, 6);
    const t = Date.now() / 50;
    const x = Math.sin(t) * intensity * (0.6 + 0.4 * Math.sin(t * 0.7));
    const y = Math.cos(t * 1.3) * intensity * 0.3;
    ref.current.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.1)`;
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isHovered) {
      hoverStart.current = Date.now();
      rafRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(rafRef.current);
      if (ref.current) {
        ref.current.style.transform = "";
      }
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered, animate]);

  let scale = "scale-100";
  let color = "text-neutral-600";
  let glow = "";

  if (isHovered) {
    color = "text-white";
    glow = "sidebar-glow";
    // scale handled by JS transform
  } else if (isNeighbor) {
    scale = "scale-105";
    color = "text-neutral-400";
  }

  return (
    <button
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`
        text-left text-sm italic tracking-wide origin-left
        transition-colors duration-300 ease-out cursor-pointer
        py-1.5
        ${isHovered ? "" : scale} ${color} ${glow}
      `}
      style={{ transition: isHovered ? "color 0.3s" : "all 0.3s ease-out" }}
    >
      {item}
    </button>
  );
}

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-52 flex flex-col justify-center pl-10 z-40">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <SidebarItem
              key={item}
              item={item}
              isHovered={hoveredIndex === i}
              isNeighbor={
                hoveredIndex !== null && Math.abs(hoveredIndex - i) === 1
              }
              onEnter={() => setHoveredIndex(i)}
              onLeave={() => setHoveredIndex(null)}
            />
          ))}
        </nav>
      </aside>

      {/* Interactive art strip */}
      <InteractiveStrip />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-center px-8 py-6">
          <span className="text-xl font-bold tracking-tight">persaille</span>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-none">
            Fast.
            <br />
            Reliable.
            <br />
            Affordable.
          </h1>

          <p className="mt-12 text-xl text-neutral-400">
            Web Design, SEO, Marketing
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-12 bg-neutral-700" />
            <p className="text-sm text-neutral-500">Dale Percelay</p>
            <div className="h-px w-12 bg-neutral-700" />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-8 text-center">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} Persaille
          </p>
        </footer>
      </div>
    </div>
  );
}

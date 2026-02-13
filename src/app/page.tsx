"use client";

import { useState } from "react";
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

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-52 flex flex-col justify-center pl-10 z-40">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const isNeighbor =
              hoveredIndex !== null && Math.abs(hoveredIndex - i) === 1;

            let scale = "scale-100";
            let color = "text-neutral-600";
            let glow = "";
            let shake = "";

            if (isHovered) {
              scale = "scale-110";
              color = "text-white";
              glow = "sidebar-glow";
              shake = "sidebar-shake";
            } else if (isNeighbor) {
              scale = "scale-105";
              color = "text-neutral-400";
            }

            return (
              <button
                key={item}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  text-left text-sm italic tracking-wide origin-left
                  transition-all duration-300 ease-out cursor-pointer
                  py-1.5
                  ${scale} ${color} ${glow} ${shake}
                `}
              >
                {item}
              </button>
            );
          })}
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

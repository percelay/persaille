"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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

const STATS = [
  { number: "Cal Poly",    label: "Engineering",              pos: "left-[6%] top-[15%] md:left-[14%] md:top-[26%]"        },
  { number: "48hr",        label: "Design Changes, Guaranteed", pos: "right-[6%] top-[12%] md:right-[16%] md:top-[20%]"   },
  { number: "Full Stack",  label: "Engineer",                 pos: "left-[8%] bottom-[16%] md:left-[16%] md:bottom-[22%]"  },
  { number: "$299",        label: "Sites From",               pos: "right-[10%] bottom-[16%] md:right-[18%] md:bottom-[22%]" },
];

// ─── Floating Stat ──────────────────────────────────────────────────────────────

function FloatingStat({
  number,
  label,
  className,
}: {
  number: string;
  label: string;
  className: string;
}) {
  return (
    <div
      className={`absolute ${className} text-center pointer-events-none select-none`}
    >
      <p className="text-lg font-black tracking-tight text-white/80 leading-none">
        {number}
      </p>
      <p className="text-[10px] tracking-[0.18em] text-neutral-500 mt-1 uppercase">
        {label}
      </p>
    </div>
  );
}

// ─── Sidebar Item ───────────────────────────────────────────────────────────────

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
      if (ref.current) ref.current.style.transform = "";
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovered, animate]);

  return (
    <button
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`
        text-left text-sm italic tracking-wide origin-left
        transition-colors duration-300 ease-out cursor-pointer py-1.5
        ${isHovered ? "text-white sidebar-glow" : isNeighbor ? "scale-105 text-neutral-400" : "scale-100 text-neutral-600"}
      `}
      style={{ transition: isHovered ? "color 0.3s" : "all 0.3s ease-out" }}
    >
      {item}
    </button>
  );
}

// ─── Persaille Title (with hover animation) ─────────────────────────────────────

function PersailleTitle({
  onClick,
  triggered,
}: {
  onClick: () => void;
  triggered: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const ref = useRef<HTMLHeadingElement>(null);
  const rafRef = useRef<number>(0);
  const currentTiltRef = useRef({ x: 0, y: 0 });
  const targetTiltRef  = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLHeadingElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top)  / rect.height;
    setMousePos({ x: nx, y: ny });
    // Tilt: -6° to +6°
    targetTiltRef.current = { x: (ny - 0.5) * -6, y: (nx - 0.5) * 6 };
  }, []);

  // Smooth tilt lerp loop
  useEffect(() => {
    if (!hovered) {
      targetTiltRef.current = { x: 0, y: 0 };
    }
    const loop = () => {
      const cur = currentTiltRef.current;
      const tgt = targetTiltRef.current;
      cur.x += (tgt.x - cur.x) * 0.12;
      cur.y += (tgt.y - cur.y) * 0.12;
      if (ref.current) {
        ref.current.style.transform = `perspective(600px) rotateX(${cur.x}deg) rotateY(${cur.y}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hovered]);

  // Spotlight gradient position
  const gradX = Math.round(mousePos.x * 100);
  const gradY = Math.round(mousePos.y * 100);

  return (
    <h1
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
      className="font-black tracking-tighter leading-none select-none cursor-default"
      style={{
        fontSize: "clamp(3.5rem, 13vw, 9.5rem)",
        // Base color + triggered flash
        color: triggered ? "#ffffff" : "rgba(255,255,255,0.88)",
        // Hover: letter-shimmer via background-clip text
        backgroundImage: hovered && !triggered
          ? `radial-gradient(ellipse 60% 80% at ${gradX}% ${gradY}%, rgba(255,255,255,1) 0%, rgba(200,255,0,0.55) 35%, rgba(255,255,255,0.65) 100%)`
          : triggered
          ? "none"
          : "none",
        WebkitBackgroundClip: hovered && !triggered ? "text" : "unset",
        backgroundClip:       hovered && !triggered ? "text"  : "unset",
        WebkitTextFillColor:  hovered && !triggered ? "transparent" : "unset",
        // Glow on hover
        filter: hovered && !triggered
          ? "drop-shadow(0 0 28px rgba(200,255,0,0.18)) drop-shadow(0 0 8px rgba(255,255,255,0.12))"
          : triggered
          ? "drop-shadow(0 0 60px rgba(255,255,255,0.4))"
          : "none",
        transition: triggered
          ? "color 200ms ease, filter 200ms ease"
          : "filter 300ms ease",
        willChange: "transform, filter",
      }}
    >
      persaille
    </h1>
  );
}

// ─── Home ───────────────────────────────────────────────────────────────────────

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [triggered, setTriggered] = useState(false);
  const router = useRouter();

  const handlePersailleClick = useCallback(() => {
    if (triggered) return;
    setTriggered(true);
    setTimeout(() => router.push("/secret"), 220);
  }, [triggered, router]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-52 flex flex-col justify-center pl-10 z-40">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <SidebarItem
              key={item}
              item={item}
              isHovered={hoveredIndex === i}
              isNeighbor={hoveredIndex !== null && Math.abs(hoveredIndex - i) === 1}
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
        {/* Top micro-label */}
        <div className="flex items-center justify-center px-8 py-6">
          <span className="text-xs tracking-[0.35em] uppercase text-neutral-700">
            web · seo · marketing
          </span>
        </div>

        {/* Hero — relative so floating stats are positioned against it */}
        <main className="flex-1 relative flex flex-col items-center justify-center px-8 text-center">
          {/* Floating stats */}
          {STATS.map((s) => (
            <FloatingStat
              key={s.number}
              number={s.number}
              label={s.label}
              className={s.pos}
            />
          ))}

          <PersailleTitle onClick={handlePersailleClick} triggered={triggered} />

          <p className="mt-10 text-xl text-neutral-500">
            Fast. Reliable. Affordable.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px w-12 bg-neutral-800" />
            <p className="text-sm text-neutral-500">Dale Percelay</p>
            <div className="h-px w-12 bg-neutral-800" />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-8 text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <a
              href="mailto:dale@persaille.com"
              className="text-xs text-neutral-600 hover:text-neutral-300 transition-colors duration-200 tracking-wide"
            >
              dale@persaille.com
            </a>
            <div className="h-3 w-px bg-neutral-800" />
            <a
              href="tel:2012137155"
              className="text-xs text-neutral-600 hover:text-neutral-300 transition-colors duration-200 tracking-wide"
            >
              (201) 213-7155
            </a>
          </div>
          <p className="text-xs text-neutral-800">
            &copy; {new Date().getFullYear()} Persaille
          </p>
        </footer>
      </div>
    </div>
  );
}

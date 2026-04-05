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

type Phase = "idle" | "white" | "img0" | "img1" | "img2" | "fadeout";

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const router = useRouter();

  // Preload transition images so slams are instant
  useEffect(() => {
    ["/1.png", "/2.png", "/3.png"].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handlePersailleClick = useCallback(() => {
    if (phase !== "idle") return;

    setPhase("white");
    setTimeout(() => setPhase("img0"), 300);
    setTimeout(() => setPhase("img1"), 750);
    setTimeout(() => setPhase("img2"), 1200);
    setTimeout(() => setPhase("fadeout"), 1650);
    setTimeout(() => router.push("/secret"), 2100);
  }, [phase, router]);

  const showOverlay = phase !== "idle" && phase !== "white";
  const imgSrc =
    phase === "img0"
      ? "/1.png"
      : phase === "img1"
      ? "/2.png"
      : phase === "img2"
      ? "/3.png"
      : null;

  const transitioning = phase !== "idle";

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex overflow-hidden">
      {/* Full-screen transition overlay */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-[9999]"
          style={{
            backgroundColor: "#000",
            backgroundImage: imgSrc ? `url(${imgSrc})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: phase === "fadeout" ? 0 : 1,
            transition: phase === "fadeout" ? "opacity 400ms ease-out" : "none",
          }}
        />
      )}

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
        {/* Top micro-label */}
        <div className="flex items-center justify-center px-8 py-6">
          <span
            className="text-xs tracking-[0.35em] uppercase"
            style={{
              color: transitioning
                ? "rgba(255,255,255,0.3)"
                : "rgb(64,64,64)",
              transition: "color 300ms ease",
            }}
          >
            web · seo · marketing
          </span>
        </div>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          {/* The clickable persaille — the whole Easter egg lives here */}
          <h1
            onClick={handlePersailleClick}
            className="font-black tracking-tighter leading-none select-none cursor-default"
            style={{
              fontSize: "clamp(3.5rem, 13vw, 9.5rem)",
              color: transitioning
                ? "#ffffff"
                : "rgba(255, 255, 255, 0.88)",
              textShadow: transitioning
                ? "0 0 60px rgba(255,255,255,0.3), 0 0 120px rgba(255,255,255,0.1)"
                : "none",
              transition: "color 280ms ease, text-shadow 280ms ease",
            }}
          >
            persaille
          </h1>

          <p
            className="mt-10 text-xl"
            style={{
              color: transitioning
                ? "rgba(255,255,255,0.4)"
                : "rgb(115,115,115)",
              transition: "color 280ms ease",
            }}
          >
            Fast. Reliable. Affordable.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div
              className="h-px w-12"
              style={{
                backgroundColor: transitioning
                  ? "rgba(255,255,255,0.18)"
                  : "rgb(64,64,64)",
                transition: "background-color 280ms ease",
              }}
            />
            <p
              className="text-sm"
              style={{
                color: transitioning
                  ? "rgba(255,255,255,0.4)"
                  : "rgb(115,115,115)",
                transition: "color 280ms ease",
              }}
            >
              Dale Percelay
            </p>
            <div
              className="h-px w-12"
              style={{
                backgroundColor: transitioning
                  ? "rgba(255,255,255,0.18)"
                  : "rgb(64,64,64)",
                transition: "background-color 280ms ease",
              }}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-8 text-center">
          <p
            className="text-xs"
            style={{
              color: transitioning
                ? "rgba(255,255,255,0.2)"
                : "rgb(82,82,82)",
              transition: "color 280ms ease",
            }}
          >
            &copy; {new Date().getFullYear()} Persaille
          </p>
        </footer>
      </div>
    </div>
  );
}

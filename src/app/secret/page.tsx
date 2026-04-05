"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Press_Start_2P } from "next/font/google";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });

type Phase = "idle" | "white" | "img2" | "img1" | "img0" | "fadeout";

const FACTS = [
  { stat: "48HR",    label: "TURNAROUND"  },
  { stat: "100%",    label: "HAND-CODED"  },
  { stat: "SEO",     label: "BUILT IN"    },
  { stat: "NEXT.JS", label: "POWERED"     },
  { stat: "MOBILE",  label: "FIRST"       },
  { stat: "ZERO",    label: "TEMPLATES"   },
];

export default function SecretPage() {
  const [visible, setVisible]   = useState(false);
  const [cursor, setCursor]     = useState(true);
  const [phase, setPhase]       = useState<Phase>("idle");
  const router = useRouter();

  useEffect(() => {
    // Fade in on mount
    const t = setTimeout(() => setVisible(true), 60);
    // Blinking cursor
    const blink = setInterval(() => setCursor((c) => !c), 530);
    // Preload images for reverse transition
    ["/1.png", "/2.png", "/3.png"].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    return () => {
      clearTimeout(t);
      clearInterval(blink);
    };
  }, []);

  // Reverse transition: 3 → 2 → 1 → fade → home
  const handleBack = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("white");
    setTimeout(() => setPhase("img2"), 300);   // show 3.png
    setTimeout(() => setPhase("img1"), 750);   // show 2.png
    setTimeout(() => setPhase("img0"), 1200);  // show 1.png
    setTimeout(() => setPhase("fadeout"), 1650);
    setTimeout(() => router.push("/"), 2100);
  }, [phase, router]);

  const showOverlay = phase !== "idle" && phase !== "white";
  const imgSrc =
    phase === "img2" ? "/3.png"
    : phase === "img1" ? "/2.png"
    : phase === "img0" ? "/1.png"
    : null;

  const transitioning = phase !== "idle";

  return (
    <div
      className={pixel.className}
      style={{
        minHeight: "100vh",
        backgroundColor: "#050505",
        // Subtle horizontal scanlines — the retro CRT soul of the page
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.014) 3px, rgba(255,255,255,0.014) 4px)",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        opacity: visible ? 1 : 0,
        transition: "opacity 650ms ease-out",
      }}
    >
      {/* Transition overlay — reverse image sequence */}
      {showOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#000",
            backgroundImage: imgSrc ? `url(${imgSrc})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: phase === "fadeout" ? 0 : 1,
            transition: phase === "fadeout" ? "opacity 400ms ease-out" : "none",
          }}
        />
      )}

      {/* Back button — very quiet, top-left */}
      <BackButton onClick={handleBack} fontFamily={pixel.style.fontFamily} />

      {/* Main content — vertically + horizontally centered */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "5rem 2rem",
          gap: "2.75rem",
          maxWidth: "58rem",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <h1
            onClick={handleBack}
            style={{
              fontFamily: pixel.style.fontFamily,
              fontSize: "clamp(1.75rem, 5.5vw, 4rem)",
              color: "#ffffff",
              lineHeight: 1.2,
              cursor: "default",
              userSelect: "none",
              textShadow: transitioning
                ? "0 0 50px rgba(255,255,255,0.5)"
                : "none",
              transition: "text-shadow 280ms ease",
              letterSpacing: "-0.02em",
            }}
          >
            PERSAILLE
            {/* Blinking cursor — terminal heartbeat */}
            <span
              style={{
                opacity: cursor ? 1 : 0,
                transition: "opacity 0.04s",
                marginLeft: "0.12em",
                display: "inline-block",
              }}
            >
              _
            </span>
          </h1>

          <p
            style={{
              fontFamily: pixel.style.fontFamily,
              fontSize: "0.45rem",
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.28em",
              marginTop: "1.1rem",
            }}
          >
            DALE PERCELAY // WEB + SEO + MARKETING
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />
          <span
            style={{
              fontFamily: pixel.style.fontFamily,
              fontSize: "0.45rem",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            ■
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
          />
        </div>

        {/* Fact boxes — the white boxes with black text, pixelated */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(10rem, 1fr))",
            gap: "1rem",
            width: "100%",
          }}
        >
          {FACTS.map((fact, i) => (
            <FactBox
              key={i}
              stat={fact.stat}
              label={fact.label}
              fontFamily={pixel.style.fontFamily}
            />
          ))}
        </div>

        {/* Footer line */}
        <p
          style={{
            fontFamily: pixel.style.fontFamily,
            fontSize: "0.38rem",
            color: "rgba(255,255,255,0.1)",
            letterSpacing: "0.22em",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} PERSAILLE. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
}

// ─── Fact Box ──────────────────────────────────────────────────────────────────

function FactBox({
  stat,
  label,
  fontFamily,
}: {
  stat: string;
  label: string;
  fontFamily: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#ffffff",
        padding: "1.4rem 1.2rem 1.2rem",
        // The defining pixel-aesthetic: hard offset shadow, no blur, no radius
        transform: hovered ? "translate(-3px, -3px)" : "translate(0, 0)",
        boxShadow: hovered
          ? "6px 6px 0px rgba(255,255,255,0.22)"
          : "4px 4px 0px rgba(255,255,255,0.1)",
        transition: "transform 110ms ease-out, box-shadow 110ms ease-out",
        cursor: "default",
        // Subtle scanline overlay inside the box — faint grain
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)",
      }}
    >
      {/* Stat — big pixel number/word */}
      <div
        style={{
          fontFamily,
          fontSize: "clamp(1rem, 2.2vw, 1.5rem)",
          color: "#000000",
          lineHeight: 1.1,
          marginBottom: "0.6rem",
          letterSpacing: "-0.02em",
        }}
      >
        {stat}
      </div>
      {/* Label — small pixel subtext */}
      <div
        style={{
          fontFamily,
          fontSize: "0.5rem",
          color: "#444444",
          letterSpacing: "0.14em",
          lineHeight: 1.7,
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── Back Button ───────────────────────────────────────────────────────────────

function BackButton({
  onClick,
  fontFamily,
}: {
  onClick: () => void;
  fontFamily: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: "fixed", top: "1.25rem", left: "1.5rem", zIndex: 40 }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily,
          fontSize: "0.44rem",
          color: hovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.18)",
          letterSpacing: "0.12em",
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "color 140ms ease",
          padding: "0.25rem 0",
        }}
      >
        [← BACK]
      </button>
    </div>
  );
}

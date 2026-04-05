"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Press_Start_2P } from "next/font/google";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const FACTS = [
  { stat: "48HR",    label: "TURNAROUND"  },
  { stat: "100%",    label: "HAND-CODED"  },
  { stat: "SEO",     label: "BUILT IN"    },
  { stat: "NEXT.JS", label: "POWERED"     },
  { stat: "MOBILE",  label: "FIRST"       },
  { stat: "ZERO",    label: "TEMPLATES"   },
];

export default function SecretPage() {
  const [visible, setVisible] = useState(false);
  const [cursor, setCursor]   = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t     = setTimeout(() => setVisible(true), 60);
    const blink = setInterval(() => setCursor((c) => !c), 530);
    return () => { clearTimeout(t); clearInterval(blink); };
  }, []);

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        // 1.png is the page itself — not a transition buffer
        backgroundImage: "url('/1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Dark overlay — ensures pixel text is legible over the green image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.62)",
          // Subtle scanline grain sits on top of the overlay
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.18) 3px, rgba(0,0,0,0.18) 4px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Back button */}
      <BackButton onClick={handleBack} fontFamily={pixel.style.fontFamily} />

      {/* All content sits above the overlay */}
      <div
        className={pixel.className}
        style={{
          position: "relative",
          zIndex: 1,
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
          color: "#fff",
          opacity: visible ? 1 : 0,
          transition: "opacity 650ms ease-out",
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
              // Text shadow for extra pop against the image
              textShadow:
                "0 2px 12px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)",
              letterSpacing: "-0.02em",
            }}
          >
            PERSAILLE
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
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.28em",
              marginTop: "1.1rem",
              textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            }}
          >
            DALE PERCELAY // WEB + SEO + MARKETING
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.25)" }} />
          <span style={{ fontFamily: pixel.style.fontFamily, fontSize: "0.45rem", color: "rgba(255,255,255,0.35)" }}>
            ■
          </span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(255,255,255,0.25)" }} />
        </div>

        {/* Fact boxes — white boxes, black text, hard pixel shadow */}
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

        {/* Copyright */}
        <p
          style={{
            fontFamily: pixel.style.fontFamily,
            fontSize: "0.38rem",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.22em",
            textAlign: "center",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
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
        transform: hovered ? "translate(-3px, -3px)" : "translate(0, 0)",
        // Hard-offset shadow — the white box "lifts" off the image on hover
        boxShadow: hovered
          ? "6px 6px 0px rgba(255,255,255,0.35)"
          : "4px 4px 0px rgba(255,255,255,0.15)",
        transition: "transform 110ms ease-out, box-shadow 110ms ease-out",
        cursor: "default",
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)",
      }}
    >
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
    <div style={{ position: "fixed", top: "1.25rem", left: "1.5rem", zIndex: 10 }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          fontFamily,
          fontSize: "0.44rem",
          color: hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
          letterSpacing: "0.12em",
          background: "none",
          border: "none",
          cursor: "pointer",
          transition: "color 140ms ease",
          padding: "0.25rem 0",
          textShadow: "0 1px 6px rgba(0,0,0,0.9)",
        }}
      >
        [← BACK]
      </button>
    </div>
  );
}

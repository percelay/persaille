"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  isNeon: boolean;
}

const NEON = "rgb(200, 255, 0)";
const NODE_COUNT = 28;
const CONNECT_DIST = 100;
const MOUSE_RADIUS = 120;
const NEON_FRACTION = 0.05;

export default function InteractiveStrip() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      initNodes(rect.width, rect.height);
    };

    const initNodes = (w: number, h: number) => {
      const nodes: Node[] = [];
      const neonCount = Math.max(1, Math.round(NODE_COUNT * NEON_FRACTION));
      const neonIndices = new Set<number>();
      while (neonIndices.size < neonCount) {
        neonIndices.add(Math.floor(Math.random() * NODE_COUNT));
      }

      for (let i = 0; i < NODE_COUNT; i++) {
        const x = Math.random() * w;
        const y =
          (h / (NODE_COUNT + 1)) * (i + 1) + (Math.random() - 0.5) * 40;
        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          radius: 1.5 + Math.random() * 2,
          isNeon: neonIndices.has(i),
        });
      }
      nodesRef.current = nodes;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    // Snap to cardinal/diagonal directions for angular movement
    const snapAngle = (vx: number, vy: number): [number, number] => {
      const mag = Math.sqrt(vx * vx + vy * vy);
      if (mag < 0.01) return [0, 0];
      const angle = Math.atan2(vy, vx);
      // Snap to nearest 45-degree increment
      const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
      return [Math.cos(snapped) * mag, Math.sin(snapped) * mag];
    };

    const draw = () => {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const nodes = nodesRef.current;

      // Update positions — angular, snappy movement
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 3;
          const [sx, sy] = snapAngle(-dx, -dy);
          const mag = Math.sqrt(sx * sx + sy * sy);
          if (mag > 0) {
            node.vx += (sx / mag) * force;
            node.vy += (sy / mag) * force;
          }
        }

        // Spring back — with snapping for angular return
        const returnDx = node.baseX - node.x;
        const returnDy = node.baseY - node.y;
        const returnDist = Math.sqrt(returnDx * returnDx + returnDy * returnDy);

        if (returnDist > 1) {
          const [sx, sy] = snapAngle(returnDx, returnDy);
          const mag = Math.sqrt(sx * sx + sy * sy);
          if (mag > 0) {
            node.vx += (sx / mag) * returnDist * 0.04;
            node.vy += (sy / mag) * returnDist * 0.04;
          }
        }

        // Heavy damping for stiff, snappy feel
        node.vx *= 0.75;
        node.vy *= 0.75;

        // Quantize movement to whole pixels for angular look
        const moveX = Math.abs(node.vx) > 0.3 ? node.vx : 0;
        const moveY = Math.abs(node.vy) > 0.3 ? node.vy : 0;
        node.x += moveX;
        node.y += moveY;
      }

      // Draw connections — straight lines only
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const opacity = 1 - dist / CONNECT_DIST;

            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(Math.round(a.x), Math.round(a.y));
            ctx.lineTo(Math.round(b.x), Math.round(b.y));
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nearMouse = dist < MOUSE_RADIUS;
        const proximity = nearMouse ? 1 - dist / MOUSE_RADIUS : 0;

        const px = Math.round(node.x);
        const py = Math.round(node.y);

        // Neon nodes glow only when mouse is near
        if (node.isNeon && nearMouse && proximity > 0.3) {
          // Intense neon glow
          const glowRadius = node.radius + 14 * proximity;
          const grad = ctx.createRadialGradient(
            px, py, 0,
            px, py, glowRadius
          );
          grad.addColorStop(0, `rgba(200, 255, 0, ${proximity * 0.9})`);
          grad.addColorStop(0.4, `rgba(200, 255, 0, ${proximity * 0.3})`);
          grad.addColorStop(1, "rgba(200, 255, 0, 0)");
          ctx.beginPath();
          ctx.arc(px, py, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Bright core
          ctx.beginPath();
          ctx.arc(px, py, node.radius + 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 255, 0, ${0.8 + proximity * 0.2})`;
          ctx.fill();

          // White-hot center
          ctx.beginPath();
          ctx.arc(px, py, node.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${proximity})`;
          ctx.fill();
        } else {
          // Regular white node
          ctx.beginPath();
          ctx.arc(px, py, node.radius, 0, Math.PI * 2);
          if (nearMouse) {
            ctx.fillStyle = `rgba(255, 255, 255, ${0.2 + proximity * 0.5})`;
          } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          }
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <aside className="fixed right-0 top-0 h-screen w-52 z-40">
      <canvas ref={canvasRef} className="w-full h-full" />
    </aside>
  );
}

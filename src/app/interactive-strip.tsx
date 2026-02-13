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
}

const NEON = "#d4ff00";
const NODE_COUNT = 28;
const CONNECT_DIST = 100;
const MOUSE_RADIUS = 150;

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
      ctx.scale(devicePixelRatio, devicePixelRatio);
      initNodes(rect.width, rect.height);
    };

    const initNodes = (w: number, h: number) => {
      const nodes: Node[] = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        const x = Math.random() * w;
        const y = (h / (NODE_COUNT + 1)) * (i + 1) + (Math.random() - 0.5) * 40;
        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          radius: 1.5 + Math.random() * 2,
        });
      }
      nodesRef.current = nodes;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const draw = () => {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const nodes = nodesRef.current;

      // Update node positions
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          // Repel from mouse
          node.vx -= (dx / dist) * force * 2;
          node.vy -= (dy / dist) * force * 2;
        }

        // Spring back to base position
        node.vx += (node.baseX - node.x) * 0.03;
        node.vy += (node.baseY - node.y) * 0.03;

        // Damping
        node.vx *= 0.9;
        node.vy *= 0.9;

        node.x += node.vx;
        node.y += node.vy;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const opacity = 1 - dist / CONNECT_DIST;

            // Check if connection is near mouse
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const mouseDist = Math.sqrt(
              (mouse.x - midX) ** 2 + (mouse.y - midY) ** 2
            );
            const nearMouse = mouseDist < MOUSE_RADIUS;

            if (nearMouse) {
              const mouseProx = 1 - mouseDist / MOUSE_RADIUS;
              ctx.strokeStyle = `rgba(212, 255, 0, ${opacity * mouseProx * 0.6})`;
              ctx.lineWidth = 1 + mouseProx;
            } else {
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
              ctx.lineWidth = 0.5;
            }

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
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

        // Glow
        if (nearMouse && proximity > 0.2) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 8 * proximity, 0, Math.PI * 2);
          const grad = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.radius + 8 * proximity
          );
          grad.addColorStop(0, `rgba(212, 255, 0, ${proximity * 0.3})`);
          grad.addColorStop(1, "rgba(212, 255, 0, 0)");
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        if (nearMouse) {
          const r = Math.round(212 + (255 - 212) * (1 - proximity));
          const g = Math.round(255);
          const b = Math.round(0 + 255 * (1 - proximity));
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + proximity * 0.7})`;
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        }
        ctx.fill();
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

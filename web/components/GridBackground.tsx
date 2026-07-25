"use client";

import React, { useEffect, useRef } from "react";

export interface GridBackgroundProps {
  speed?: number; // Speed of propagation in px/s (default: 450)
  thickness?: number; // Thickness of active wave ring in px (default: 120)
  accentColor?: string; // Hex color of active cells (default: violet #c084fc)
  gridSpacing?: number; // Grid spacing in px (default: 20)
  cellSize?: number; // Size of square cell in px (default: 19)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function GridBackground({
  speed = 450,
  thickness = 120,
  accentColor = "#c084fc", // Premium light violet accent
  gridSpacing = 20,
  cellSize = 19,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<{ cx: number; cy: number; startTime: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const rgb = hexToRgb(accentColor) || { r: 192, g: 132, b: 252 };
    const defaultR = 244;
    const defaultG = 241;
    const defaultB = 232;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resize);
    resize();

    // Core animation rendering loop running continuously for maximum reliability
    const loop = () => {
      const now = performance.now();
      const ripples = ripplesRef.current;

      // Update active ripples and filter out completed waves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const ripple = ripples[i];
        const elapsed = now - ripple.startTime;
        const radius = (speed * elapsed) / 1000;
        const maxRadius = Math.sqrt(
          Math.max(ripple.cx, width - ripple.cx) ** 2 + Math.max(ripple.cy, height - ripple.cy) ** 2
        );

        // Remove ripple when it is completely out of view
        if (radius - thickness > maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 1. Clear background
      ctx.clearRect(0, 0, width, height);

      // 2. Draw static horizontal & vertical grid lines (slate-200 lines at 30% opacity)
      ctx.strokeStyle = "rgba(226, 232, 240, 0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();

      const cols = Math.ceil(width / gridSpacing);
      const rows = Math.ceil(height / gridSpacing);
      const offsetX = (width % gridSpacing) / 2;
      const offsetY = (height % gridSpacing) / 2;

      for (let col = 0; col <= cols; col++) {
        const x = Math.floor(col * gridSpacing + offsetX) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }

      for (let row = 0; row <= rows; row++) {
        const y = Math.floor(row * gridSpacing + offsetY) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 3. Render active ripple overlays
      if (ripples.length > 0) {
        const riseW = thickness * 0.25;
        const decayW = thickness * 0.75;

        for (let col = 0; col < cols; col++) {
          const x = col * gridSpacing + offsetX;
          for (let row = 0; row < rows; row++) {
            const y = row * gridSpacing + offsetY;

            // Calculate Euclidean center of cell
            const cellCenterX = x + gridSpacing / 2;
            const cellCenterY = y + gridSpacing / 2;

            let maxIntensity = 0;

            // Check wave propagation for all concurrent ripples
            for (let i = 0; i < ripples.length; i++) {
              const ripple = ripples[i];
              const dx = cellCenterX - ripple.cx;
              const dy = cellCenterY - ripple.cy;
              const d = Math.sqrt(dx * dx + dy * dy);

              const elapsed = now - ripple.startTime;
              const radius = (speed * elapsed) / 1000;
              const z = radius - d; // Wavefront distance coordinate

              if (z >= 0) {
                let intensity = 0;
                if (z <= riseW) {
                  const t = z / riseW;
                  intensity = Math.sin((t * Math.PI) / 2);
                } else if (z <= riseW + decayW) {
                  const t = (z - riseW) / decayW;
                  intensity = Math.pow(Math.cos((t * Math.PI) / 2), 2);
                }
                if (intensity > maxIntensity) {
                  maxIntensity = intensity;
                }
              }
            }

            // Fill active cell background color
            if (maxIntensity > 0.005) {
              const r = Math.round(defaultR + (rgb.r - defaultR) * maxIntensity);
              const g = Math.round(defaultG + (rgb.g - defaultG) * maxIntensity);
              const b = Math.round(defaultB + (rgb.b - defaultB) * maxIntensity);

              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              
              const cellOffset = (gridSpacing - cellSize) / 2;
              ctx.fillRect(x + cellOffset, y + cellOffset, cellSize, cellSize);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [speed, thickness, accentColor, gridSpacing, cellSize]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    ripplesRef.current.push({
      cx: e.clientX,
      cy: e.clientY,
      startTime: performance.now(),
    });
  };

  return (
    <div
      onClick={handleContainerClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#F4F1E8",
        zIndex: 0,
        cursor: "pointer",
        pointerEvents: "auto",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default GridBackground;

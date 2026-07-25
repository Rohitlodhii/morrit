"use client";

import React, { useState } from "react";
import { motion } from "motion/react";

interface CopyButtonProps {
  text: string;
  className?: string;
  defaultLabel?: string;
  copiedLabel?: string;
  onCopy?: () => void;
  useImage?: boolean;
}

export default function CopyButton({
  text,
  className = "",
  defaultLabel = "Copy",
  copiedLabel = "Copied!",
  onCopy,
  useImage = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    const audio = new Audio("/keysound.mp3");
    audio.play().catch((err) => {
      console.warn("Audio playback was prevented or failed:", err);
    });

    if (onCopy) {
      onCopy();
    }

    setTimeout(() => setCopied(false), 2000);
  };

  if (useImage) {
    // Filter position classes to keep placement but remove text/border/bg styling
    const positionClasses = className
      .split(" ")
      .filter((c) => 
        c.startsWith("absolute") || 
        c.startsWith("relative") || 
        c.startsWith("top-") || 
        c.startsWith("right-") || 
        c.startsWith("left-") || 
        c.startsWith("bottom-") || 
        c.startsWith("z-")
      )
      .join(" ") || "absolute top-3 right-3";

    return (
      <motion.button
        onClick={handleCopy}
        className={`${positionClasses} z-10 flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer select-none`}
        whileHover={{
          scale: 1.05,
          y: -1,
          filter: "brightness(1.05)",
        }}
        whileTap={{
          scale: 0.95,
          y: 1,
          filter: "brightness(0.9)",
        }}
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 15,
        }}
        style={{
          border: "none",
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        }}
      >
        <img
          src="/copybtn.png"
          alt="Copy"
          className="h-[28px] w-auto object-contain pointer-events-none"
          draggable={false}
        />
      </motion.button>
    );
  }

  return (
    <button onClick={handleCopy} className={className}>
      {copied ? copiedLabel : defaultLabel}
    </button>
  );
}

"use client";

import React from "react";
import { motion } from "motion/react";

interface StepNumberProps {
  num: number;
  className?: string;
}

export default function StepNumber({ num, className = "" }: StepNumberProps) {
  const handleClick = () => {
    const audio = new Audio("/keysound.mp3");
    audio.play().catch((err) => {
      console.warn("Audio playback was prevented or failed:", err);
    });
  };

  const imageSrc = `/key${num}.png`;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.08, ease: "easeInOut" }}
      className={`inline-flex items-center justify-center p-0 border-0 bg-transparent cursor-pointer focus:outline-none select-none \${className}`}
    >
      <img
        src={imageSrc}
        alt={`Step \${num}`}
        className="w-8 h-8 sm:w-10 sm:h-10 object-contain pointer-events-none"
      />
    </motion.button>
  );
}

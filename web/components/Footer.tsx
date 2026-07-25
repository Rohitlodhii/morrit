"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function Footer() {
  const [spiderY, setSpiderY] = useState(-200); // Start completely hidden behind the card

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      const scrollYPosition = window.scrollY;

      // Distance from the absolute bottom of the page
      const scrollFromBottom = scrollHeight - clientHeight - scrollYPosition;

      // Start revealing when the user is within 250px of the bottom
      const startRevealAt = 250;

      if (scrollFromBottom <= startRevealAt) {
        // Map scrollFromBottom [250, 0] to spiderY [-200, 140]
        const progress = Math.max(0, (startRevealAt - scrollFromBottom) / startRevealAt);
        const targetY = -200 + progress * 340; // At bottom, y is 140 (hanging down)
        setSpiderY(targetY);
      } else {
        setSpiderY(-200);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Trigger initially

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const letters = [
    { src: "/m.png", alt: "m", delay: 0 },
    { src: "/o.png", alt: "o", delay: 0.05 },
    { src: "/r.png", alt: "r", delay: 0.1 },
    { src: "/r.png", alt: "r", delay: 0.15 },
    { src: "/i.png", alt: "i", delay: 0.2 },
    { src: "/t.png", alt: "t", delay: 0.25 },
  ];

  return (
    <footer className="pointer-events-auto w-full max-w-6xl px-6 mt-16 mb-44 flex flex-col items-center relative">
      {/* Spider-man PNG placed behind the card */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center z-0 overflow-visible pointer-events-none">
        <motion.div
          animate={{ y: spiderY }}
          transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
          className="relative"
        >
          <img 
            src="/spider.png" 
            alt="Spider-man" 
            className="h-44 w-auto object-contain" 
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Outer Card (has z-10 so it covers Spider-man) */}
      <div 
        className="w-full bg-[#f8f5ef] border border-stone-200/60 rounded-3xl p-8 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center relative z-10 overflow-hidden"
      >
        {/* Background decorative soft blur */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-stone-300/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-orange-900/5 blur-3xl pointer-events-none" />

        {/* Brand spelling: morrit */}
        <div className="flex items-center justify-center -space-x-2 sm:-space-x-3 md:-space-x-4 mb-6 select-none">
          {letters.map((letter, idx) => (
            <motion.img
              key={idx}
              src={letter.src}
              alt={letter.alt}
              className="h-16 sm:h-20 md:h-24 w-auto object-contain cursor-pointer drop-shadow-sm"
              initial={{ opacity: 0, y: 15, rotate: idx % 2 === 0 ? -6 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: letter.delay,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              whileHover={{ 
                y: -12, 
                rotate: idx % 2 === 0 ? 6 : -6,
                scale: 1.1,
                filter: "brightness(1.05)",
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              draggable={false}
            />
          ))}
        </div>

        {/* Description / Subtitle */}
        <p 
          className="text-stone-500 font-bold text-sm tracking-wider uppercase mb-8"
          style={{ fontFamily: "var(--font-nunito), sans-serif" }}
        >
          For lovely begineer frontend devs 
        </p>

        {/* Divider line */}
        <div className="w-full h-px bg-stone-200/60 mb-8" />

        {/* Footer Social Buttons (Keycaps) */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {[
            { src: "/dc.png", alt: "Discord", href: "https://discord.com/users/userid/1125125295880556644" },
            { src: "/linkedin.png", alt: "LinkedIn", href: "https://www.linkedin.com/in/rohitlodhiii/" },
            { src: "/git.png", alt: "GitHub", href: "https://github.com/Rohitlodhii/morrit" }
          ].map((social, i) => {
            const handleClick = () => {
              const audio = new Audio("/keysound.mp3");
              audio.play().catch((err) => {
                console.warn("Audio playback was prevented or failed:", err);
              });
            };

            return (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                className="cursor-pointer select-none focus:outline-none flex items-center justify-center"
                whileHover={{
                  scale: 1.08,
                  y: -2,
                  filter: "brightness(1.05)",
                }}
                whileTap={{
                  scale: 0.92,
                  y: 2,
                  filter: "brightness(0.9)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 600,
                  damping: 15,
                }}
              >
                <img
                  src={social.src}
                  alt={social.alt}
                  className="h-[48px] sm:h-[56px] w-auto object-contain pointer-events-none"
                  draggable={false}
                />
              </motion.a>
            );
          })}
        </div>

        {/* Copyright notice */}
        <p 
          className="text-stone-400 text-xs font-semibold"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          made for frontend devs by <a alt="rohit's website" href="https://rohitlodhi.in">rohitlodhii</a>
        </p>
      </div>
    </footer>
  );
}

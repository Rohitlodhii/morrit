"use client";

import React, { useState } from "react";
import GridBackground from "@/components/GridBackground";
import { motion, AnimatePresence } from "motion/react";
import InstallationPage from "@/components/InstallationPage";
import Footer from "@/components/Footer";
import { installationPrompt } from "@/prompts/prompt";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npm i -d morrit");
    setCopied(true);
    setShowGlow(true);

    // Play sound.mp3 from the public folder
    const audio = new Audio("/sound.mp3");
    audio.play().catch((err) => {
      console.warn("Audio playback was prevented or failed:", err);
    });

    setTimeout(() => setShowGlow(false), 1000);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(installationPrompt);
    setPromptCopied(true);
   

    // Play keysound.mp3 from the public folder
    const audio = new Audio("/keysound.mp3");
    audio.play().catch((err) => {
      console.warn("Audio playback was prevented or failed:", err);
    });

    setTimeout(() => setShowGlow(false), 1000);
    setTimeout(() => setPromptCopied(false), 2000);
  };



  return (
    <>
      {/* Interactive Grid & Ripple Background Layer (Fixed backdrop) */}
      <GridBackground
        speed={450}
        thickness={120}
        accentColor="#e9e3d5" // White ripple that highlights cells on hover
        gridSpacing={20} // 20px grid cells
        cellSize={19} // 19px grid cell squares (leaves 1px spacing)
      />

      {/* Floating Hero Content Overlay */}
      <main
        className="relative min-h-screen w-full flex flex-col items-center justify-start select-none pointer-events-none pb-24"
        style={{ zIndex: 1 }}
      >
        {/* Centered Hero Wrapper */}
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-6 text-center">

          {/* Centered Logo & Title */}
          <div className="pointer-events-auto flex justify-center mb-10">
            <div className=" px-4 py-2.5 flex items-center gap-3 rounded-xl ">
              <img
                src="/logo.png"
                alt="Morrit Logo"
                className="h-10 w-auto object-contain hover:scale-[1.03] transition-all duration-300 -rotate-12"
              />
              <span
                className="text-2xl font-extrabold text-orange-950 tracking-tight"
                style={{ fontFamily: "var(--font-nunito), sans-serif" }}
              >
                Morrit
              </span>
            </div>
          </div>

          {/* Main Title (Nunito) */}
          <h1
            className="pointer-events-auto text-4xl sm:text-5xl md:text-8xl font-bold tracking-tight text-orange-950 max-w-5xl mb-6 leading-[0.76]"
            style={{ fontFamily: "var(--font-nunito), sans-serif" }}
          >
            fastest
            <motion.img
              src="/formula.png"
              alt="Formula"
              className="inline-block h-[0.9em] w-auto mx-1  align-middle cursor-pointer"
              whileHover={{ scale: 2.25, rotate: 6 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />
            way to navigate
            <motion.img
              src="/compass.png"
              alt="Compass"
              className="inline-block h-[0.9em] w-auto mx-1  align-middle cursor-pointer"
              whileHover={{ scale: 2.25, rotate: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />
            your react codebase
          </h1>

          {/* Subtitle (Geist Sans) */}
          <p
            className="pointer-events-auto text-xs sm:text-sm md:text-[16px] text-[#475569] max-w-2xl leading-tight mb-10 font-medium"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Morrit is a compile-time React Inspector that lets you jump from any rendered element directly to its source code in one click. Built for React and Next.js applications of any size.
          </p>

          {/* Action Buttons Row */}
          <div className="pointer-events-auto flex flex-col sm:flex-row items-center gap-6 md:gap-1 justify-center w-full max-w-md sm:max-w-none px-6 sm:px-0">
            {/* Monospace Copy Button */}
            <motion.button
              onClick={handleCopy}
              className="
relative
flex items-center gap-3
py-3.5
rounded-xl
cursor-pointer
active:scale-[0.98]
group
select-none
overflow-hidden

border border-[#d9d0be]

bg-gradient-to-b
from-[#f8f5ef]
via-[#f2eee5]
to-[#e9e3d5]

shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_-1px_0_rgba(225,218,201,0.8)_inset,0_8px_18px_rgba(170,150,120,0.14)]

hover:from-[#faf7f2]
hover:via-[#f4f0e7]
hover:to-[#ebe5d8]

transition-colors
w-full
sm:w-auto
justify-center
"
              initial={{ paddingLeft: "1.25rem", paddingRight: "1.25rem" }}
              whileHover={{ paddingLeft: "2.25rem", paddingRight: "2.25rem" }}
              transition={{ type: "spring", stiffness: 350, damping: 12 }}
            >
              <span
                className="
    pointer-events-none
    absolute
    inset-[1px]
    rounded-[11px]
    border
    border-white/70
  "
              />
              <span className="font-mono text-sm text-slate-700 font-semibold select-none">
                npm i -d morrit
              </span>
              <div className="w-5 h-5 flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors">
                {copied ? (
                  // Checkmark
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                  // Copy icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                )}
              </div>
            </motion.button>

            {/* Copy Prompt Button with CatOK reveal */}
            <div className="relative overflow-visible w-full sm:w-auto flex justify-center">
              <AnimatePresence>
                {promptCopied && (
                  <motion.img
                    src="/catok.png"
                    alt="Ok Cat"
                    className="absolute left-1/2 -translate-x-1/2 z-0 h-16 w-auto object-contain pointer-events-none"
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: -52, opacity: 1 }}
                    exit={{ y: 15, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  />
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={handleCopyPrompt}
                whileHover={{
                  scale: 1.02,
                  y: -2,
                  filter: "brightness(1.05)",
                }}
                whileTap={{
                  scaleX: 0.98,
                  scaleY: 0.94,
                  y: 3,
                  filter: "brightness(0.9)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 700,
                  damping: 22,
                  mass: 0.25,
                }}
                className="relative z-10 p-0 border-0 bg-transparent cursor-pointer focus:outline-none select-none w-full sm:w-auto flex justify-center"
              >
                <img
                  src="/press.png"
                  alt="Copy Prompt"
                  className="h-14 w-auto object-contain pointer-events-none"
                  draggable={false}
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Installation Section */}
        <InstallationPage />

        {/* Footer Section */}
        <Footer />
      </main>

      {/* Page Border Gradient Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-700 ease-out"
        style={{
          opacity: showGlow ? 1 : 0
        }}
      >
        {/* Soft, spreading blur background container */}
        <div className="absolute inset-0 blur-[30px] opacity-70">
          {/* Top glow border */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-r from-[#c084fc] via-[#f43f5e] via-[#3b82f6] to-[#10b981]" />
          {/* Bottom glow border */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-[#c084fc] via-[#f43f5e] via-[#3b82f6] to-[#10b981]" />
          {/* Left glow border */}
          <div className="absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-b from-[#c084fc] via-[#f43f5e] via-[#3b82f6] to-[#10b981]" />
          {/* Right glow border */}
          <div className="absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-b from-[#c084fc] via-[#f43f5e] via-[#3b82f6] to-[#10b981]" />
        </div>

        {/* Slightly sharper overlay to give structure but still soft */}
        <div className="absolute inset-0 blur-[8px] opacity-40">
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#c084fc] via-[#f43f5e] via-[#3b82f6] to-[#10b981]" />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-[#c084fc] via-[#f43f5e] via-[#3b82f6] to-[#10b981]" />
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-b from-[#c084fc] via-[#f43f5e] via-[#3b82f6] to-[#10b981]" />
          <div className="absolute top-0 bottom-0 right-0 w-4 bg-gradient-to-b from-[#c084fc] via-[#f43f5e] via-[#3b82f6] to-[#10b981]" />
        </div>

        {/* Ambient full-page inset glow */}
        <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(192,132,252,0.4),_inset_0_0_100px_rgba(59,130,246,0.3)]" />
      </div>
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import CopyButton from "@/components/CopyButton";
import StepNumber from "@/components/StepNumber";

const viteConfigCode = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import morrit from 'morrit/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    morrit({
      rootDir: __dirname,
    }),
  ],
  optimizeDeps: {
    include: ['morrit'],
  },
})`;

const viteInspectorCode = `
import { MorritInspector } from 'morrit'

function App() {
  return (
    <>
      {/* your app */}
      <MorritInspector />
    </>
  )
}`;

const nextConfigCode = `
const { withMorrit } = require('morrit/next')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your config
}

module.exports = withMorrit(nextConfig)`;

const nextInspectorCode = `
import { MorritInspector } from 'morrit/next/client'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <MorritInspector />
      </body>
    </html>
  )
}`;

// Self-contained CodeBox component with CatOK easter egg
const CodeBox = ({ 
  code, 
  bgClass = "bg-stone-200/50 text-neutral-950 rounded-xl" 
}: { 
  code: string; 
  bgClass?: string; 
}) => {
  const [showCat, setShowCat] = useState(false);

  const handleCopy = () => {
    setShowCat(true);
    // Hide the cat after 1.8 seconds
    setTimeout(() => {
      setShowCat(false);
    }, 1800);
  };

  return (
    <div className="relative overflow-visible">
      {/* CatOK image animating from behind the pre block */}
      <AnimatePresence>
        {showCat && (
          <motion.img
            src="/catok.png"
            alt="Ok Cat"
            className="absolute right-4 z-0 h-16 w-auto object-contain pointer-events-none"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: -52, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
          />
        )}
      </AnimatePresence>

      <pre className={`${bgClass} relative z-10 font-mono text-xs sm:text-sm p-4 sm:p-5 overflow-x-auto leading-relaxed`}>
        <code>{code}</code>
      </pre>

      <CopyButton
        text={code}
        className="absolute top-3 right-3 z-20"
        useImage={true}
        onCopy={handleCopy}
      />
    </div>
  );
};

export default function InstallationPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [pm, setPm] = useState<"npm" | "pnpm" | "yarn" | "bun">("npm");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="pointer-events-auto w-full max-w-6xl px-3 sm:px-6 mt-12 flex flex-col items-center">
      
      {/* Installation Section Header */}
      <div className="text-center mb-8">
        <h2 
          className="text-3xl sm:text-5xl font-extrabold text-orange-950 mb-2 tracking-tight"
          style={{ fontFamily: "var(--font-nunito), sans-serif" }}
        >
           <motion.img
            src="/catthink.png"
            alt="Thinking Cat"
            className="inline-block h-[0.9em] w-auto mx-2 align-middle cursor-pointer"
            whileHover={{ scale: 2.25, rotate: 6 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          />
          How to install ? {" "}
         
        </h2>
      </div>

      {/* Tab Selector Container */}
      <div className="relative mb-8 w-full max-w-[250px] sm:max-w-xs md:max-w-sm flex justify-center">
        
        {/* Spiderman sliding out to the right */}
        <motion.div
          className="absolute left-full top-1/2 -translate-y-1/2 -ml-14 z-0 pointer-events-none flex items-center"
          animate={{
            x: activeTab === 1 ? (isMobile ? 28 : 64) : -180,
            opacity: activeTab === 1 ? 1 : 0,
            scale: activeTab === 1 ? (isMobile ? 0.75 : 1) : 0.7,
            rotate: activeTab === 1 ? 0 : -10
          }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 15,
            mass: 0.8
          }}
        >
          <img
            src="/spiderman.png"
            alt="Spiderman"
            className="h-[34px] sm:h-[40px] w-auto object-contain"
            draggable={false}
          />
        </motion.div>

        {/* Simple Tab Selector */}
        <div className="relative z-10 flex bg-stone-200 p-1 rounded-full w-full">
          <div className="relative flex w-full">
            {["Vite + React", "Next.js"].map((tabTitle, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className="flex-1 h-10 relative cursor-pointer focus:outline-none rounded-full"
                >
                  {isActive && (
                    <motion.div
                      layoutId="simple-active-tab"
                      className="absolute inset-0 bg-orange-950 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span
                    style={{ fontFamily: "var(--font-nunito), sans-serif" }}
                    className={`
                      relative z-10 w-full h-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors duration-200
                      ${isActive ? "text-white" : "text-stone-600 hover:text-stone-900"}
                    `}
                  >
                    {tabTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content panel */}
      <div className="w-full bg-[#f8f5ef] border border-stone-200/60 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
        <AnimatePresence mode="wait">
          {activeTab === 0 ? (
            <motion.div
              key="vite"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="p-4 sm:p-8"
            >
              <div className="text-left">
                <div className="space-y-8">
                  {/* Step 1 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <StepNumber num={1} />
                      <h4 className="text-sm md:text-base  font-extrabold text-stone-900  tracking-tight animate-pulse-subtle" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                        Install the library
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm text-stone-500 mb-4 font-medium" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                      Choose your package manager and install the inspector:
                    </p>
                    
                    {/* Package Manager Switches */}
                    <div className="flex gap-2 mb-3 bg-stone-200/50 p-1 rounded-xl w-fit flex-wrap sm:flex-nowrap">
                      {(["npm", "pnpm", "yarn", "bun"] as const).map((manager) => (
                        <button
                          key={manager}
                          onClick={() => setPm(manager)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            pm === manager 
                              ? "bg-white text-stone-900 shadow-xs" 
                              : "text-stone-600 hover:text-stone-900"
                          }`}
                          style={{ fontFamily: "var(--font-nunito), sans-serif" }}
                        >
                          {manager}
                        </button>
                      ))}
                    </div>

                    {/* Command Code Box */}
                    <CodeBox 
                      code={pm === "npm" ? "npm install morrit" : pm === "pnpm" ? "pnpm add morrit" : pm === "yarn" ? "yarn add morrit" : "bun add morrit"}
                    />
                  </div>

                  {/* Step 2 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <StepNumber num={2} />
                      <h4 className="text-xs md:text-sm md:text-base font-extrabold text-stone-900  tracking-tight" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                        Add the plugin
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm text-stone-500 mb-4 font-medium" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                      Configure the plugin in your <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">vite.config.ts</code> file:
                    </p>
                    <CodeBox 
                      code={viteConfigCode}
                    />
                  </div>

                  {/* Step 3 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <StepNumber num={3} />
                      <h4 className="text-xs md:text-sm md:text-base font-extrabold text-stone-900  tracking-tight" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                        Add the inspector
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm text-stone-500 mb-4 font-medium" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                      Import and mount the <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">MorritInspector</code> component in App.tsx:
                    </p>
                    <CodeBox 
                      code={viteInspectorCode}
                    />
                    <p className="text-xs md:text-sm text-stone-500 mt-3 font-semibold italic" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                      Toggle the inspector with flaoting icon on bottom right, then click any element to open its source.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="next"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="p-4 sm:p-8"
            >
              <div className="text-left">
                <div className="space-y-8">
                  {/* Step 1 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <StepNumber num={1} />
                      <h4 className="text-xs md:text-sm font-extrabold text-stone-900  tracking-tight" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                        Install the library
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm text-stone-500 mb-4 font-medium" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                      Choose your package manager and install the inspector:
                    </p>
                    
                    {/* Package Manager Switches */}
                    <div className="flex gap-2 mb-3 bg-stone-200/50 p-1 rounded-xl w-fit flex-wrap sm:flex-nowrap">
                      {(["npm", "pnpm", "yarn", "bun"] as const).map((manager) => (
                        <button
                          key={manager}
                          onClick={() => setPm(manager)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            pm === manager 
                              ? "bg-white text-stone-900 shadow-xs" 
                              : "text-stone-600 hover:text-stone-900"
                          }`}
                          style={{ fontFamily: "var(--font-nunito), sans-serif" }}
                        >
                          {manager}
                        </button>
                      ))}
                    </div>

                    {/* Command Code Box */}
                    <CodeBox 
                      code={pm === "npm" ? "npm install morrit" : pm === "pnpm" ? "pnpm add morrit" : pm === "yarn" ? "yarn add morrit" : "bun add morrit"}
                      bgClass="bg-stone-200/50 text-neutral-950 rounded-2xl "
                    />
                  </div>

                  {/* Step 2 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <StepNumber num={2} />
                      <h4 className="text-xs md:text-sm font-extrabold text-stone-900  tracking-tight" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                        Wrap your Next.js config
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm text-stone-500 mb-4 font-medium" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                      Wrap your Next.js config using <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">withMorrit</code> in <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">next.config.js</code>:
                    </p>
                    <CodeBox 
                      code={nextConfigCode}
                      bgClass="bg-stone-200/50 text-neutral-950 rounded-2xl "
                    />
                  </div>

                  {/* Step 3 */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <StepNumber num={3} />
                      <h4 className="text-xs md:text-sm font-extrabold text-stone-900  tracking-tight" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
                        Add the inspector to your layout
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm text-stone-500 mb-4 font-medium" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                      Import and mount the client-side <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">MorritInspector</code> in <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">app/layout.tsx</code>:
                    </p>
                    <CodeBox 
                      code={nextInspectorCode}
                      bgClass="bg-stone-200/50 text-neutral-950 rounded-2xl "
                    />
                    <p className="text-xs md:text-sm text-stone-400 mt-3 font-semibold italic" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                      That's it. on the package.json use command npm run dev --webpack to run without errors
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

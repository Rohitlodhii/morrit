"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import CopyButton from "@/components/CopyButton";
import StepNumber from "@/components/StepNumber";
import Footer from "@/components/Footer";

// Gooey filter component
const GooeyFilter = ({
  id = "goo-filter",
  strength = 10,
}: {
  id?: string;
  strength?: number;
}) => {
  return (
    <svg className="hidden absolute">
      <defs>
        <filter id={id}>
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={strength}
            result="blur"
          />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

export { GooeyFilter };

const viteConfigCode = `// vite.config.ts
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

const viteInspectorCode = `// src/main.tsx or src/App.tsx
import { MorritInspector } from 'morrit'

function App() {
  return (
    <>
      {/* your app */}
      <MorritInspector />
    </>
  )
}`;

const nextConfigCode = `// next.config.js
const { withMorrit } = require('morrit/next')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your config
}

module.exports = withMorrit(nextConfig)`;

const nextInspectorCode = `// app/layout.tsx
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

export default function InstallPage() {
  const [activeTab, setActiveTab] = useState<"vite" | "next">("vite");
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
    <div 
      className="min-h-screen flex flex-col items-center justify-start py-16 px-4 sm:px-6 relative"
      style={{ backgroundColor: "#F4F1E8" }}
    >
      {/* Back Button */}
      <div className="w-full max-w-2xl mb-8">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-bold text-sm transition-colors group"
          style={{ fontFamily: "var(--font-nunito), sans-serif" }}
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Home
        </a>
      </div>

      {/* Page Header */}
      <header className="text-center mb-12">
        <h1 
          className="text-4xl sm:text-5xl font-extrabold text-[#0f172a] mb-4 tracking-tight"
          style={{ fontFamily: "var(--font-nunito), sans-serif" }}
        >
          Installation Guide
        </h1>
        <p 
          className="text-[#475569] font-medium max-w-md mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          Integrate Morrit source code links into your local React build tool config in just a few steps.
        </p>
      </header>

      {/* Gooey Tab Selector */}
      <div className="relative mb-10 select-none flex justify-center w-fit mx-auto">
        
        {/* Spiderman sliding out to the right */}
        <motion.div
          className="absolute left-full top-1/2 -translate-y-1/2 -ml-14 z-0 pointer-events-none flex items-center"
          animate={{
            x: activeTab === "next" ? (isMobile ? 28 : 64) : -180,
            opacity: activeTab === "next" ? 1 : 0,
            scale: activeTab === "next" ? (isMobile ? 0.75 : 1) : 0.7,
            rotate: activeTab === "next" ? 0 : -10
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

        <div className="relative z-10">
          <GooeyFilter id="goo-filter" strength={6} />
          
          {/* Filtered Background Layer */}
          <div 
            className="flex items-center bg-stone-200 p-1 rounded-full relative" 
            style={{ filter: "url(#goo-filter)" }}
          >
            <motion.div
              className="absolute bg-orange-950 h-10 rounded-full"
              animate={{
                x: activeTab === "vite" ? 4 : 132,
                width: 124,
              }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 14,
              }}
            />
            {/* Symmetrical placeholders */}
            <div className="w-[128px] h-10 rounded-full" />
            <div className="w-[128px] h-10 rounded-full" />
          </div>

          {/* Action Click Labels (Unfiltered overlay) */}
          <div className="absolute inset-0 flex items-center p-1 pointer-events-none">
            <button
              onClick={() => setActiveTab("vite")}
              className={`w-[128px] h-10 flex items-center justify-center font-bold text-sm rounded-full pointer-events-auto transition-colors duration-300 ${
                activeTab === "vite" ? "text-white" : "text-stone-600 hover:text-stone-900"
              }`}
              style={{ fontFamily: "var(--font-nunito), sans-serif" }}
            >
              Vite + React
            </button>
            <button
              onClick={() => setActiveTab("next")}
              className={`w-[128px] h-10 flex items-center justify-center font-bold text-sm rounded-full pointer-events-auto transition-colors duration-300 ${
                activeTab === "next" ? "text-white" : "text-stone-600 hover:text-stone-900"
              }`}
              style={{ fontFamily: "var(--font-nunito), sans-serif" }}
            >
              Next.js
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Panel */}
      <main className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {activeTab === "vite" ? (
            <motion.div
              key="vite"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-white/80 border border-stone-200/60 rounded-3xl p-4 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] backdrop-blur-sm"
            >
              <h2 
                className="text-2xl font-bold text-stone-900 mb-6"
                style={{ fontFamily: "var(--font-nunito), sans-serif" }}
              >
                Vite Setup Guide
              </h2>
              <div className="space-y-8 text-stone-700 font-medium">
                {/* Step 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <StepNumber num={1} />
                    <span className="font-bold text-stone-900 text-base" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Install the library:</span>
                  </div>
                  <div className="mt-2 bg-stone-100/80 border border-stone-200 rounded-xl p-3 flex justify-between items-center ml-0 sm:ml-11">
                    <code className="font-mono text-sm text-stone-800">npm install morrit</code>
                    <CopyButton 
                      text="npm install morrit"
                      className="text-stone-500 hover:text-stone-800 text-xs px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors font-sans cursor-pointer active:scale-95 bg-white shadow-xs"
                      defaultLabel="Copy"
                      copiedLabel="Copied!"
                    />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <StepNumber num={2} />
                    <span className="font-bold text-stone-900 text-base" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Add the plugin:</span>
                  </div>
                  <p className="text-stone-500 text-sm mt-1 mb-2 ml-0 sm:ml-11">Configure the plugin in your <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">vite.config.ts</code> file:</p>
                  <div className="mt-2 ml-0 sm:ml-11">
                    <CodeBox 
                      code={viteConfigCode}
                      bgClass="bg-neutral-600 text-neutral-50 rounded-2xl shadow-sm"
                    />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <StepNumber num={3} />
                    <span className="font-bold text-stone-900 text-base" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Add the inspector:</span>
                  </div>
                  <p className="text-stone-500 text-sm mt-1 mb-2 ml-0 sm:ml-11">Import and mount the <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">MorritInspector</code> component:</p>
                  <div className="mt-2 ml-0 sm:ml-11">
                    <CodeBox 
                      code={viteInspectorCode}
                      bgClass="bg-neutral-600 text-neutral-50 rounded-2xl shadow-sm"
                    />
                  </div>
                  <p className="text-xs text-stone-500 mt-2 ml-0 sm:ml-11 italic font-semibold">
                    Toggle the inspector with <kbd className="bg-stone-200 px-1.5 py-0.5 rounded border border-stone-300 text-[10px] font-mono shadow-xs">Ctrl+Shift+I</kbd>, then click any element to open its source.
                  </p>
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
              className="bg-white/80 border border-stone-200/60 rounded-3xl p-4 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] backdrop-blur-sm"
            >
              <h2 
                className="text-2xl font-bold text-stone-900 mb-6"
                style={{ fontFamily: "var(--font-nunito), sans-serif" }}
              >
                Next.js Setup Guide
              </h2>
              <div className="space-y-8 text-stone-700 font-medium">
                {/* Step 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <StepNumber num={1} />
                    <span className="font-bold text-stone-900 text-base" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Install the inspector:</span>
                  </div>
                  <div className="mt-2 bg-stone-100/80 border border-stone-200 rounded-xl p-3 flex justify-between items-center ml-0 sm:ml-11">
                    <code className="font-mono text-sm text-stone-800">npm install morrit</code>
                    <CopyButton 
                      text="npm install morrit"
                      className="text-stone-500 hover:text-stone-800 text-xs px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 transition-colors font-sans cursor-pointer active:scale-95 bg-white shadow-xs"
                      defaultLabel="Copy"
                      copiedLabel="Copied!"
                    />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <StepNumber num={2} />
                    <span className="font-bold text-stone-900 text-base" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Wrap your Next.js config:</span>
                  </div>
                  <p className="text-stone-500 text-sm mt-1 mb-2 ml-0 sm:ml-11">Wrap your Next.js config using <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">withMorrit</code> in <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">next.config.js</code>:</p>
                  <div className="mt-2 ml-0 sm:ml-11">
                    <CodeBox 
                      code={nextConfigCode}
                      bgClass="bg-neutral-600 text-neutral-50 rounded-2xl shadow-sm"
                    />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <StepNumber num={3} />
                    <span className="font-bold text-stone-900 text-base" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>Add the inspector to your layout:</span>
                  </div>
                  <p className="text-stone-500 text-sm mt-1 mb-2 ml-0 sm:ml-11">Import and mount the client-side <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">MorritInspector</code> in <code className="bg-stone-200/60 px-1 rounded font-mono text-xs">app/layout.tsx</code>:</p>
                  <div className="mt-2 ml-0 sm:ml-11">
                    <CodeBox 
                      code={nextInspectorCode}
                      bgClass="bg-neutral-600 text-neutral-50 rounded-2xl shadow-sm"
                    />
                  </div>
                  <p className="text-xs text-stone-400 mt-2 ml-0 sm:ml-11 italic font-semibold">
                    That's it. No Babel config, no API routes, no custom server. SWC stays enabled.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

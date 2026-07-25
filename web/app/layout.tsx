import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Nunito } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Morrit",
  description: "Locate and open React JSX component source files in VS Code directly from your browser. Morrit injects compile-time source metadata with zero runtime dependencies.",
  openGraph: {
    title: "Morrit",
    description: "Locate and open React JSX component source files in VS Code directly from your browser. Morrit injects compile-time source metadata with zero runtime dependencies.",
    images: [
      {
        url: "https://i.ibb.co/tMmTNW4F/preview-2026-07-25-15-29-49.png",
        width: 1200,
        height: 630,
        alt: "Morrit Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morrit",
    description: "Locate and open React JSX component source files in VS Code directly from your browser. Morrit injects compile-time source metadata with zero runtime dependencies.",
    images: ["https://i.ibb.co/tMmTNW4F/preview-2026-07-25-15-29-49.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

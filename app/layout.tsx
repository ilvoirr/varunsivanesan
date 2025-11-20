import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Varun Sivanesan",
  description: "Portfolio of Varun Sivanesan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-white`}
      >
        {/* =======================================================
            1. MOBILE BLOCKER (Visible only on screens < 1024px)
        ======================================================== */}
        <div className="lg:hidden fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 px-6 text-center">
          
          {/* Decorative Icon Container */}
          <div className="mb-8 p-6 rounded-full bg-neutral-900/50 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-md">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-purple-400"
            >
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          </div>

          {/* Gradient Title */}
          <h2 className="text-5xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500">
            Only Visible on <br /> PC & Laptops
          </h2>
          
          {/* Divider */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-6"></div>

          {/* Polished Message */}
          <p className="text-neutral-300 text-lg leading-relaxed max-w-xs font-medium">
            Large Screen Support Only
          </p>

          {/* Cheeky Subtext */}
          <p className="mt-2 text-xs font-mono text-neutral-500 max-w-[200px]">
            Writing Code for Mobile Screen is in Process
          </p>

          {/* Positioned at the bottom */}
          <p className="absolute bottom-16 text-xs uppercase tracking-widest text-neutral-600 font-semibold">
            Please Switch Devices
          </p>
        </div>

        {/* =======================================================
            2. ACTUAL WEBSITE (Hidden on small screens)
        ======================================================== */}
        <div className="hidden lg:block min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
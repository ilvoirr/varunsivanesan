"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Globe } from "lucide-react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  AnimatePresence,
  MotionValue
} from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ------------------------------------------------------------------
// Utilities & Dock Components (UNTOUCHED)
// ------------------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FloatingDock = ({
  items,
  desktopClassName,
  onNavigate,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  onNavigate?: (path: string) => void;
}) => {
  return (
    <FloatingDockDesktop items={items} className={desktopClassName} onNavigate={onNavigate} />
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  onNavigate,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  onNavigate?: (path: string) => void;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-neutral-50 px-4 pb-3 md:flex dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/50",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} onNavigate={onNavigate} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onNavigate,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  onNavigate?: (path: string) => void;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val: number) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  let width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  let height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  let widthIcon = useSpring(widthTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });
  let heightIcon = useSpring(heightTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);
  const isExternal = href.startsWith("http");

  return (
    <a 
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        if ((href === "/" || href === "/notes") && onNavigate) {
            e.preventDefault();
            onNavigate(href);
        }
        else if (href === "#") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit rounded-md border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}

// ------------------------------------------------------------------
// Project Types & Data (UNTOUCHED)
// ------------------------------------------------------------------
interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tech: string[];
  liveLink?: string;
  githubLink: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "BachatBox",
    description: "ACM Hacks 10.0 Prototype. An intelligent personal finance platform built to empower users with automated expense tracking from SMS messages and receipts, personalized AI-driven financial advice, and powerful data visualizations.",
    image: "/proj1.png",
    tech: ["Next.js", "PYTHON", "Webhooks", "LLM"],
    liveLink: "https://bachatbox.vercel.app",
    githubLink: "https://github.com/ilvoirr/bachatbox",
  },
  {
    id: 2,
    title: "SERP Engine",
    description: "Innovate Hackathon Prototype. A fully functional custom SERP Engine that scrapes web results live and structures them on the frontend, utilizing a Local LLM to generate concise summaries of the search results.",
    image: "/proj2.png",
    tech: ["Web Scraping", "Local LLM", "NEXT.JS", "Python"],
    liveLink: "https://serp-engine.vercel.app",
    githubLink: "https://github.com/ilvoirr/serp-engine",
  },
  {
    id: 3,
    title: "BioLuminescence",
    description: "Smart India Hackathon '25 Prototype. An AI-powered microscope image analysis application designed to detect and identify biological species in microscopy images using advanced deep learning models.",
    image: "/proj3.png",
    tech: ["RCNN MODEL", "embedded systems","next.js", "Python"],
    githubLink: "https://github.com/ilvoirr/bioluminescence",
  },
  {
    id: 4,
    title: "Diet Tracker Dashboard",
    description: "A significantly improved statistical dashboard for a casual diet weight tracker. Reconstructed the UI to fix usability issues and added better data visualization for tracking progress.",
    image: "/proj4.png",
    tech: ["Data Visualisaton", "Real world", "next.js"],
    liveLink: "https://diet-tracker-v55z.vercel.app/",
    githubLink: "https://github.com/ilvoirr/diet-tracker",
  },
  {
    id: 5,
    title: "Voice Assistant Template",
    description: "A quick, clean UI template for voice assistant interfaces. Designed with no component or docker dependencies for easy modification. Includes one page.tsx and 3 plug-and-play API routes.",
    image: "/proj5.png",
    tech: ["Conversatonal Assistant", "Deepgram", "Next.js"],
    liveLink: "https://voice-assistant-template-cml1-hdluum8yw.vercel.app/",
    githubLink: "https://github.com/ilvoirr/varun-voice-assistant-template",
  },
  {
    id: 6,
    title: "Master Agent UI",
    description: "CSC Hackathon Prototype. A Master Agent UI Interface that converses with multiple worker agents to provide an immaculate, automated banker experience for customers.",
    image: "/proj6.png",
    tech: ["Multi-Agent", "LANGCHAIN", "NEXT.JS"],
    liveLink: "https://csc-hackathon-prototype-i66i.vercel.app/",
    githubLink: "https://github.com/ilvoirr/csc-hackathon-prototype",
  },
  {
    id: 7,
    title: "Code Progress Bar",
    description: "A modern web application that helps developers measure their code's alignment with specific goals. Provides real-time feedback and interactive visualizations to track coding practice improvements.",
    image: "/proj7.png",
    tech: ["Next.js", "Components", "LLM"],
    liveLink: "https://varun-sivanesan-code-progress-bar.vercel.app/",
    githubLink: "https://github.com/ilvoirr/code-progress-bar",
  },
];

// ------------------------------------------------------------------
// Page Logic Components
// ------------------------------------------------------------------

const BlurFade = ({ delay, children, className }: { delay: number; children: React.ReactNode, className?: string }) => (
  <div className={`animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both ${className}`} style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

const CometCard = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`relative bg-zinc-900/30 border border-white/5 backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

export default function ProjectsPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [exitDuration, setExitDuration] = useState(0.6); // Default speed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Unified Handler with Dynamic Speed
  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    
    // Logic: If going to Notes (Sibling), fast. If Home, slow.
   if (path === "/notes") {
      router.push(path);
      return;
    }

    setExitDuration(0.6);
    setIsExiting(true);

    setTimeout(() => {
      router.push(path);
    }, 600); // 0.6 * 1000
  };

  const dockItems = [
    { title: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, href: "/" },
    { title: "Notes", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>, href: "/notes" },
    { title: "Projects", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 18 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.21 4.5 2.6 4.5-2.6"/><polyline points="7.5 19.79 7.5 14.6 3 12"/></svg>, href: "#" },
    { title: "GitHub", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>, href: "https://github.com/ilvoirr" },
    { title: "LinkedIn", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>, href: "https://www.linkedin.com/in/varun-sivanesan-397928205/" },
    { title: "Twitter", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>, href: "https://x.com/varunnetworks" },
    { title: "Instagram", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>, href: "https://www.instagram.com/ilvoirr/" },
    { title: "Gmail", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, href: "mailto:contactvarun04@gmail.com" },
    { title: "Call", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, href: "tel:7827919494" },
  ];

  return (
   <main className="min-h-screen bg-black text-white px-4 pt-24 pb-6 md:pb-24 md:p-12 lg:py-24 lg:px-36 relative overflow-x-hidden">
      
      {/* 2. EXIT CURTAIN (Conditional Speed Up from Bottom) */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: exitDuration, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
          >
           <h1 className="relative z-10 text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 font-sans">
                Varun Sivanesan
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* TOP BAR / LIQUID NAVIGATION (MOBILE ONLY)                          */}
      {/* ------------------------------------------------------------------ */}
      
      {/* Top Blur & Vignette (Fixed h-25 equivalent) */}
      <div 
        className="block md:hidden fixed top-0 left-0 w-full h-24 z-[55] pointer-events-none backdrop-blur-xl" 
        style={{
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)"
        }}
      />
      <div className="block md:hidden fixed top-0 left-0 w-full h-24 z-[55] pointer-events-none bg-gradient-to-b from-neutral-950/20 to-transparent" />

      {/* Floating Notch Menu Trigger (MOBILE ONLY) */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.0 }} 
        className="block md:hidden fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-[65vw] max-w-[280px]"
      >
        <button
            onClick={() => setIsMenuOpen(true)}
            className="group w-full flex items-center justify-between px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_20px_-5px_rgba(0,0,0,0.2)] hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-95"
        >
            <span className="text-[11px] font-semibold text-neutral-300 tracking-wider group-hover:text-white transition-colors">Menu</span>
            
            <div className="flex flex-col gap-[3px] items-end">
                <span className="w-5 h-[2px] bg-neutral-400 rounded-full group-hover:bg-white group-hover:w-6 transition-all duration-300"></span>
                <span className="w-3 h-[2px] bg-neutral-400 rounded-full group-hover:bg-white group-hover:w-6 transition-all duration-300"></span>
            </div>
        </button>
      </motion.div>

      {/* "LIQUID GLASS" MENU OVERLAY (MOBILE ONLY) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="block md:hidden fixed inset-0 z-[70] flex flex-col items-center justify-start pt-28 px-4">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-neutral-950/40 backdrop-blur-md"
            />
              
            {/* Menu Window */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ scale: 0.95, opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[300px] bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
            >
               <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

               <div className="p-6 relative z-10">
                   <div className="flex justify-between items-center mb-6 px-1">
                       <span className="text-sm font-semibold text-neutral-200 tracking-wide">Navigation</span>
                       <button onClick={() => setIsMenuOpen(false)} className="group p-2 -mr-2 text-neutral-300 hover:text-white transition-colors">
                           <div className="w-6 h-6 flex items-center justify-center relative">
                                <span className="absolute w-4 h-[1.5px] bg-current rotate-45 transition-transform"></span>
                                <span className="absolute w-4 h-[1.5px] bg-current -rotate-45 transition-transform"></span>
                           </div>
                       </button>
                   </div>

                   <div className="grid grid-cols-3 gap-y-6 gap-x-2">
                    {dockItems.map((item, idx) => (
                        <a 
                          key={item.title} 
                          href={item.href}
                          onClick={(e) => {
                            // Intercept Navigation
                            if ((item.href === "/" || item.href === "/notes") && handleNavigation) {
                                e.preventDefault();
                                handleNavigation(item.href);
                            } else {
                                setIsMenuOpen(false);
                            }
                          }}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="flex flex-col items-center justify-center gap-2 group cursor-pointer"
                        >
                          <div className="p-3 rounded-2xl bg-transparent group-hover:bg-white/10 transition-colors duration-300">
                             <div className="text-neutral-300 group-hover:text-purple-300 transition-colors duration-300 drop-shadow-sm">
                               {React.cloneElement(item.icon as any, { className: "w-6 h-6 stroke-[1.5]" })}
                             </div>
                          </div>
                          <span className="text-[11px] font-medium text-neutral-400 group-hover:text-white transition-colors">{item.title}</span>
                        </a>
                    ))}
                   </div>
                   
                   <div className="mt-8 pt-4 border-t border-white/10 flex justify-center text-center">
                       <p className="text-[10px] text-neutral-400 font-medium">
                           Designed by Varun Sivanesan
                       </p>
                   </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* END MOBILE ONLY SECTION                                            */}
      {/* ------------------------------------------------------------------ */}

      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-10 md:mb-20 border-b border-white/10 pb-8 md:pb-10">
        <BlurFade delay={0.1}>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            Selected Works<span className="text-pink-500">.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl font-light leading-relaxed">
            A curated archive of prototypes, hackathons, and personal tools.
          </p>
        </BlurFade>
      </div>

      {/* Projects List */}
      <div className="max-w-6xl mx-auto flex flex-col gap-12 md:gap-24">
        {PROJECTS.map((project, index) => (
          <BlurFade key={project.id} delay={0.2 + index * 0.1}>
            {/* MOBILE: Dark card with border and padding 
              DESKTOP (md:): No background, no border, no padding (reverts to original row layout)
            */}
            <div className="group flex flex-col md:flex-row gap-6 md:gap-12 items-start p-4 md:p-0 bg-zinc-900/40 md:bg-transparent border border-white/5 md:border-none rounded-3xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none transition-all">
              
              {/* 1. Image Section (Left) - UNTOUCHED */}
              <div className="w-full md:w-3/5 relative">
                  <CometCard className="rounded-xl overflow-hidden aspect-video border border-white/10 transition-all duration-500">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                        {project.liveLink && (
                            <Link
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75"
                            >
                            <Globe size={15} /> Demo
                            </Link>
                        )}
                        <Link
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-100"
                        >
                            <Github size={15} /> Code
                        </Link>
                    </div>
                  </CometCard>
              </div>

              {/* 2. Content Section (Right) */}
              <div className="w-full md:w-2/5 flex flex-col pt-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
                
                {/* Title: Always pink on Mobile */}
                <h2 className="text-3xl font-bold mb-4 tracking-tight transition-colors duration-300 text-pink-500 md:text-white md:group-hover:text-pink-500">
                  {project.title}
                </h2>
                
                <p className="text-zinc-400 leading-relaxed mb-8 text-sm font-light">
                  {project.description}
                </p>
                
                {/* ========================================================= */}
                {/* BUTTONS: SEPARATED MOBILE VS DESKTOP TO PREVENT REGRESSION */}
                {/* ========================================================= */}
                
                {/* DESKTOP LINKS (Original Style: Subtle text, hover pink) */}
                <div className="hidden md:flex items-center gap-4 mt-auto opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-pink-500 transition-colors"
                    >
                      <Globe size={14} /> Live Preview
                    </Link>
                  )}
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    <Github size={14} /> View Source
                  </Link>
                </div>

                {/* MOBILE BUTTONS (New Luxurious Style) */}
                <div className="flex md:hidden items-center gap-3 mt-2 w-full">
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-pink-900/40 to-purple-900/40  text-pink-200 font-semibold text-sm shadow-[0_0_15px_-5px_rgba(236,72,153,0.3)] hover:bg-pink-900/60 transition-all duration-300"
                    >
                      <Globe size={16} /> 
                      <span>Live Preview</span>
                    </Link>
                  )}
                  <Link
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900  text-zinc-400 font-semibold text-sm hover:bg-zinc-800 transition-all duration-300"
                  >
                    <Github size={16} /> 
                    <span>View Source</span>
                  </Link>
                </div>

              </div>

            </div>
          </BlurFade>
        ))}
      </div>

      {/* Floating Dock Fixed at Bottom - HIDDEN ON MOBILE (md:flex) */}
      <div className="hidden md:flex fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock 
          items={dockItems} 
          desktopClassName="bg-zinc-900/80 border border-zinc-800 backdrop-blur-md"
          onNavigate={handleNavigation} 
        />
      </div>

    </main>
  );
}
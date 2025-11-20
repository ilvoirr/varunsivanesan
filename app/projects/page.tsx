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
// Utilities & Dock Components
// ------------------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  onHomeClick,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  onHomeClick?: () => void;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} onHomeClick={onHomeClick} />
      <FloatingDockMobile items={items} className={mobileClassName} onHomeClick={onHomeClick} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
  onHomeClick,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  onHomeClick?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  key={item.title}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (item.href === "#") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else if (item.href === "/" && onHomeClick) {
                      e.preventDefault();
                      onHomeClick();
                    }
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="h-4 w-4">{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-500 dark:text-neutral-400"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  onHomeClick,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  onHomeClick?: () => void;
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
        <IconContainer mouseX={mouseX} key={item.title} {...item} onHomeClick={onHomeClick} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  onHomeClick,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  onHomeClick?: () => void;
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
        if (href === "#") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (href === "/" && onHomeClick) {
            e.preventDefault();
            onHomeClick();
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
// Project Types & Data
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

  // Logic to trigger the exit animation then push route
  const handleHomeClick = () => {
    setIsExiting(true);
    // Wait for animation (600ms) before pushing route
    setTimeout(() => {
      router.push("/");
    }, 600);
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
    <main className="min-h-screen bg-black text-white p-6 md:p-12 lg:py-24 lg:px-36 pb-24">
      {/* White Transition Overlay with Text */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
          >
           <h1 className="relative z-10 text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 font-sans">
                Varun Sivanesan
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-20 border-b border-white/10 pb-10">
        <BlurFade delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            Selected Works<span className="text-pink-500">.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl font-light leading-relaxed">
            A curated archive of prototypes, hackathons, and personal tools.
          </p>
        </BlurFade>
      </div>

      {/* Projects List */}
      <div className="max-w-6xl mx-auto flex flex-col gap-24">
        {PROJECTS.map((project, index) => (
          <BlurFade key={project.id} delay={0.2 + index * 0.1}>
            <div className="group flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              
              {/* 1. Image Section (Left) */}
              <div className="w-full md:w-3/5 relative">
                  <CometCard className="rounded-xl overflow-hidden aspect-video border border-white/10 transition-all duration-500">
                    {/* Image */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover" 
                    />
                    
                    {/* Interactive Overlay with Buttons */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                        
                        {/* Live Demo Button */}
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

                        {/* GitHub Code Button */}
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
                
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[10px] uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-pink-500 transition-colors duration-300">
                  {project.title}
                </h2>

                {/* Description */}
                <p className="text-zinc-400 leading-relaxed mb-8 text-sm font-light">
                  {project.description}
                </p>

                {/* Text Links */}
                <div className="flex items-center gap-4 mt-auto opacity-40 group-hover:opacity-100 transition-opacity duration-500">
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
              </div>

            </div>
          </BlurFade>
        ))}
      </div>

      {/* Floating Dock Fixed at Bottom */}
      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock 
          items={dockItems} 
          desktopClassName="bg-zinc-900/80 border border-zinc-800 backdrop-blur-md"
          onHomeClick={handleHomeClick} 
        />
      </div>

    </main>
  );
}
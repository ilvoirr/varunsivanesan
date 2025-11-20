"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  X, 
  Download, 
  ChevronRight, 
  BookOpen,
  Code2,
  Cpu,
  Layers,
  Globe
} from "lucide-react";
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
// 1. Data Configuration (Updated with your specific files)
// ------------------------------------------------------------------

const NOTES_DATA = [
  {
    id: 1,
    title: "C Programming Notes",
    category: "C Fundamentals",
    file: "/C NOTES.pdf",
    color: "from-blue-900 to-slate-900",
    icon: <Code2 />
  },
  {
    id: 2,
    title: "CPP 01: Introduction",
    category: "C++ Series",
    file: "/CPP  1 INTRODUCTION.pdf",
    color: "from-blue-700 to-indigo-900",
    icon: <Code2 />
  },
  {
    id: 3,
    title: "CPP 02: Types & Operators",
    category: "C++ Series",
    file: "/CPP 2 TYPES AND OPERATORS.pdf",
    color: "from-indigo-700 to-purple-900",
    icon: <Code2 />
  },
  {
    id: 4,
    title: "CPP 03: Control Flow",
    category: "C++ Series",
    file: "/CPP 3 CONTROL FLOW & TEMPLATES.pdf",
    color: "from-purple-700 to-pink-900",
    icon: <Code2 />
  },
  {
    id: 5,
    title: "CPP 04: Compound Data",
    category: "C++ Series",
    file: "/CPP 4 COMPOUND DATA TYPES.pdf",
    color: "from-pink-700 to-rose-900",
    icon: <Code2 />
  },
  {
    id: 6,
    title: "CPP 05: Arrays",
    category: "C++ Series",
    file: "/CPP 5 ARRAYS.pdf",
    color: "from-rose-700 to-orange-900",
    icon: <Layers />
  },
  {
    id: 7,
    title: "CPP 06: OOPs",
    category: "Advanced C++",
    file: "/CPP 6 OOPS .pdf",
    color: "from-orange-700 to-amber-900",
    icon: <BookOpen />
  },
  {
    id: 8,
    title: "CPP 07: Op Overloads",
    category: "Advanced C++",
    file: "/CPP 7 OPERATOR OVERLOADS & MOVE SEMANTICS.docx .pdf",
    color: "from-amber-700 to-yellow-900",
    icon: <Code2 />
  },
  {
    id: 9,
    title: "CPP 08: Inheritance",
    category: "Advanced C++",
    file: "/CPP 8 INHERITANCE & POLYMORPHISM.pdf",
    color: "from-yellow-700 to-lime-900",
    icon: <Layers />
  },
  
  {
    id: 11,
    title: "Machine Learning",
    category: "Mathematics",
    file: "/ML.pdf",
    color: "from-teal-700 to-cyan-900",
    icon: <Cpu />
  },
  {
    id: 12,
    title: "Structures & Analysis",
    category: "Mathematics",
    file: "/STRUCTURES & ANALYSIS.pdf",
    color: "from-cyan-700 to-sky-900",
    icon: <Layers />
  },
  {
    id: 13,
    title: "Web Development",
    category: "Full Stack",
    file: "/WEBDEV.pdf",
    color: "from-sky-700 to-blue-900",
    icon: <Globe />
  },
];

// ------------------------------------------------------------------
// 2. Utilities & Components
// ------------------------------------------------------------------

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BlurFade = ({ delay, children, className }: { delay: number; children: React.ReactNode, className?: string }) => (
  <div className={`animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both ${className}`} style={{ animationDelay: `${delay}s` }}>
    {children}
  </div>
);

/* --- FLOATING DOCK (Exact Copy) --- */
export const FloatingDock = ({ items, desktopClassName, mobileClassName, onHomeClick }: any) => (
  <>
    <FloatingDockDesktop items={items} className={desktopClassName} onHomeClick={onHomeClick} />
    <FloatingDockMobile items={items} className={mobileClassName} onHomeClick={onHomeClick} />
  </>
);

const FloatingDockMobile = ({ items, className, onHomeClick }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div layoutId="nav" className="absolute inset-x-0 bottom-full mb-2 flex flex-col gap-2">
            {items.map((item: any, idx: number) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  onClick={(e) => {
                    if (item.href === "#") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }
                    else if (item.href === "/" && onHomeClick) { e.preventDefault(); onHomeClick(); }
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
      <button onClick={() => setOpen(!open)} className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-neutral-500 dark:text-neutral-400"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({ items, className, onHomeClick }: any) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-neutral-50 px-4 pb-3 md:flex dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/50", className)}
    >
      {items.map((item: any) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} onHomeClick={onHomeClick} />
      ))}
    </motion.div>
  );
};

function IconContainer({ mouseX, title, icon, href, onHomeClick }: any) {
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
        if (href === "#") { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); } 
        else if (href === "/" && onHomeClick) { e.preventDefault(); onHomeClick(); }
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
        <motion.div style={{ width: widthIcon, height: heightIcon }} className="flex items-center justify-center">
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}

// ------------------------------------------------------------------
// 3. Main Page Component
// ------------------------------------------------------------------

export default function NotesPage() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);
  const [selectedNote, setSelectedNote] = useState<typeof NOTES_DATA[0] | null>(null);

  const handleHomeClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  // Prevent scrolling when PDF modal is open
  useEffect(() => {
    if (selectedNote) { document.body.style.overflow = 'hidden'; } 
    else { document.body.style.overflow = 'unset'; }
  }, [selectedNote]);

  const dockItems = [
    { title: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, href: "/" },
    { title: "Notes", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>, href: "#" },
    { title: "Projects", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 18 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.21 4.5 2.6 4.5-2.6"/><polyline points="7.5 19.79 7.5 14.6 3 12"/></svg>, href: "/projects" },
    { title: "GitHub", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>, href: "https://github.com/ilvoirr" },
    { title: "LinkedIn", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>, href: "https://www.linkedin.com/in/varun-sivanesan-397928205/" },
    { title: "Twitter", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>, href: "https://x.com/varunnetworks" },
    { title: "Instagram", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>, href: "https://www.instagram.com/ilvoirr/" },
    { title: "Gmail", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, href: "mailto:contactvarun04@gmail.com" },
    { title: "Call", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, href: "tel:7827919494" },
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 lg:py-24 lg:px-36 pb-24 relative">
      
      {/* White Transition Overlay */}
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
            Self Written Notes<span className="text-pink-500">.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl font-light leading-relaxed">
            A personal archive of documentations, mind maps, and coding fundamentals.
          </p>
        </BlurFade>
      </div>

      {/* Notes Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {NOTES_DATA.map((note, index) => (
          <BlurFade key={note.id} delay={0.2 + index * 0.1}>
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => setSelectedNote(note)}
              className="group cursor-pointer"
            >
              {/* Card that looks like a Document Snapshot */}
              <div className="relative aspect-[3/4] bg-zinc-900 rounded-xl border border-white/10 overflow-hidden flex flex-col transition-all duration-300 group-hover:border-pink-500/50 group-hover:shadow-[0_0_30px_-10px_rgba(236,72,153,0.3)]">
                
                {/* 1. Beautiful Gradient Cover (Replaces Screenshot) */}
                <div className={`h-36 w-full bg-gradient-to-br ${note.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                    <div className="text-white/50 transform scale-150">
                        {note.icon}
                    </div>
                    {/* "PDF" Badge */}
                    <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-md border border-white/10 px-2 py-1 rounded text-[10px] font-mono font-bold tracking-widest">
                        PDF
                    </div>
                </div>
                
                {/* 2. Card Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-auto">
                    <p className="text-xs font-medium text-pink-500 mb-2 tracking-widest uppercase">
                        {note.category}
                    </p>
                    <h3 className="text-xl font-bold text-white group-hover:text-pink-500 transition-colors line-clamp-2">
                        {note.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 mt-4">
                    <span className="flex items-center gap-2">
                        <FileText size={12} /> Read File
                    </span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform text-pink-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </BlurFade>
        ))}
      </div>

      {/* PDF Side Panel Viewer */}
      <AnimatePresence>
        {selectedNote && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNote(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[850px] bg-zinc-900 border-l border-white/10 z-[70] flex flex-col shadow-2xl"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/90 backdrop-blur">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedNote.title}</h2>
                  <p className="text-sm text-pink-500">{selectedNote.category}</p>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={selectedNote.file} 
                    download 
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    title="Download PDF"
                  >
                    <Download size={20} />
                  </a>
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-pink-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* PDF Content Iframe */}
              <div className="flex-1 bg-zinc-950 relative">
                 <iframe 
                    src={selectedNote.file} 
                    className="w-full h-full border-none"
                    title={selectedNote.title}
                 />
                 {/* Fallback / Loading State */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 text-zinc-600 gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <div className="text-center">
                        <p>Loading Document...</p>
                        <p className="text-xs opacity-50">If it doesn't load, use the download button.</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
"use client";
import React, { useState, useEffect, useRef, useMemo, ComponentPropsWithoutRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  motion, 
  useInView, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  MotionValue, 
  AnimatePresence 
} from "framer-motion";

// --- Utility Helper ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// =========================================
// FLOATING DOCK COMPONENT
// =========================================

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
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
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
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
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
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

// =========================================
// MARQUEE COMPONENT
// =========================================

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

// =========================================
// COMET CARD COMPONENT
// =========================================

const CometCard = ({
  rotateDepth = 10,
  translateDepth = 10,
  className,
  children,
}: {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`-${rotateDepth}deg`, `${rotateDepth}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`${rotateDepth}deg`, `-${rotateDepth}deg`]);
  const translateX = useTransform(mouseXSpring, [-0.5, 0.5], [`-${translateDepth}px`, `${translateDepth}px`]);
  const translateY = useTransform(mouseYSpring, [-0.5, 0.5], [`${translateDepth}px`, `-${translateDepth}px`]);
    
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className={cn("perspective-[1000px]", className)} style={{ perspective: "1000px" }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ scale: 1, z: 0 }}
        whileHover={{
          scale: 1.05,
          z: 20,
          transition: { duration: 0.2 },
        }}
        className="relative w-full h-full transform-style-3d"
      >
        {children}
      </motion.div>
    </div>
  );
};

// =========================================
// PIXEL IMAGE COMPONENT
// =========================================

type Grid = { rows: number; cols: number };
const DEFAULT_GRIDS: Record<string, Grid> = {
  "6x4": { rows: 4, cols: 6 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 3, cols: 8 },
  "4x6": { rows: 6, cols: 4 },
  "3x8": { rows: 8, cols: 3 },
};
type PredefinedGridKey = keyof typeof DEFAULT_GRIDS;

interface PixelImageProps {
  src: string;
  grid?: PredefinedGridKey;
  customGrid?: Grid;
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number; 
  maxAnimationDelay?: number; 
  colorRevealDelay?: number; 
  className?: string;
}

const PixelImage = ({
  src,
  grid = "6x4",
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  customGrid,
  className,
}: PixelImageProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [pieces, setPieces] = useState<{ clipPath: string; delay: number }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const MIN_GRID = 1;
  const MAX_GRID = 16;

  const { rows, cols } = useMemo(() => {
    const isValidGrid = (grid?: Grid) => {
      if (!grid) return false;
      const { rows, cols } = grid;
      return Number.isInteger(rows) && Number.isInteger(cols) && rows >= MIN_GRID && cols >= MIN_GRID && rows <= MAX_GRID && cols <= MAX_GRID;
    };
    return isValidGrid(customGrid) ? customGrid! : DEFAULT_GRIDS[grid];
  }, [customGrid, grid]);

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
      const colorTimeout = setTimeout(() => setShowColor(true), colorRevealDelay);
      return () => clearTimeout(colorTimeout);
    }
  }, [colorRevealDelay, isInView]);

  useEffect(() => {
    const total = rows * cols;
    const newPieces = Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const clipPath = `polygon(${col * (100 / cols)}% ${row * (100 / rows)}%, ${(col + 1) * (100 / cols)}% ${row * (100 / rows)}%, ${(col + 1) * (100 / cols)}% ${(row + 1) * (100 / rows)}%, ${col * (100 / cols)}% ${(row + 1) * (100 / rows)}%)`;
      const delay = Math.random() * maxAnimationDelay;
      return { clipPath, delay };
    });
    setPieces(newPieces);
  }, [rows, cols, maxAnimationDelay]);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full select-none", className)}>
      {pieces.map((piece, index) => (
        <div
          key={index}
          className={cn("absolute inset-0 transition-all ease-out", isVisible ? "opacity-100" : "opacity-0")}
          style={{ clipPath: piece.clipPath, transitionDelay: `${piece.delay}ms`, transitionDuration: `${pixelFadeInDuration}ms` }}
        >
          <img
            src={src}
            alt={`Pixel image piece ${index + 1}`}
            className={cn("z-1 rounded-[2.5rem] object-cover w-full h-full", grayscaleAnimation && (showColor ? "grayscale-0" : "grayscale"))}
            style={{ transition: grayscaleAnimation ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)` : "none" }}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
};

// =========================================
// STARS BACKGROUND & SHOOTING STARS
// =========================================

const StarsBackground = ({ className, starColor = "255, 255, 255" }: { className?: string; starColor?: string }) => {
  const [stars, setStars] = useState<{x:number,y:number,radius:number,opacity:number,twinkleSpeed:number|null}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateStars = () => {
      if (!canvasRef.current) return;
      const { width, height } = canvasRef.current.getBoundingClientRect();
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const numStars = Math.floor(width * height * 0.00015);
      const newStars = Array.from({ length: numStars }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.05 + 0.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() < 0.7 ? 0.5 + Math.random() * 0.5 : null,
      }));
      setStars(newStars);
    };
    updateStars();
    window.addEventListener('resize', updateStars);
    return () => window.removeEventListener('resize', updateStars);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let frameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        let opacity = star.opacity;
        if (star.twinkleSpeed) {
           opacity = 0.5 + Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
        }
        ctx.fillStyle = `rgba(${starColor}, ${opacity})`;
        ctx.fill();
      });
      frameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(frameId);
  }, [stars, starColor]);

  return <canvas ref={canvasRef} className={cn("fixed inset-0 pointer-events-none h-full w-full z-0", className)} />;
};

const ShootingStars = ({ minDelay = 50, maxDelay = 200, className }: { minDelay?: number, maxDelay?: number, className?: string }) => {
  const starRef = useRef<SVGRectElement>(null);
  const animationState = useRef({ x: 0, y: 0, angle: 0, scale: 1, speed: 0, distance: 0, active: false, waitTimer: 0, waitTarget: 0 });

  useEffect(() => {
    const getRandomStartPoint = () => {
      const side = Math.floor(Math.random() * 4);
      const offset = Math.random() * window.innerWidth;
      switch (side) {
        case 0: return { x: offset, y: 0, angle: 45 };
        case 1: return { x: window.innerWidth, y: offset, angle: 135 };
        case 2: return { x: offset, y: window.innerHeight, angle: 225 };
        case 3: return { x: 0, y: offset, angle: 315 };
        default: return { x: 0, y: 0, angle: 45 };
      }
    };
    let frameId: number;
    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      const state = animationState.current;
      const el = starRef.current;
      if (!el) { frameId = requestAnimationFrame(loop); return; }

      if (!state.active) {
        state.waitTimer += dt;
        if (state.waitTimer >= state.waitTarget) {
          const start = getRandomStartPoint();
          state.x = start.x; state.y = start.y; state.angle = start.angle;
          state.speed = Math.random() * (30 - 10) + 10; state.distance = 0; state.scale = 1; state.active = true;
          el.style.opacity = "1";
        }
      } else {
        const radian = (state.angle * Math.PI) / 180;
        state.x += state.speed * Math.cos(radian);
        state.y += state.speed * Math.sin(radian);
        state.distance += state.speed;
        state.scale = 1 + state.distance / 100;
        if (state.x < -50 || state.x > window.innerWidth + 50 || state.y < -50 || state.y > window.innerHeight + 50) {
          state.active = false; state.waitTimer = 0; state.waitTarget = Math.random() * (maxDelay - minDelay) + minDelay;
          el.style.opacity = "0";
        } else {
          const centerX = state.x + (10 * state.scale) / 2;
          const centerY = state.y + 1 / 2;
          el.setAttribute("x", state.x.toString());
          el.setAttribute("y", state.y.toString());
          el.setAttribute("width", (10 * state.scale).toString());
          el.setAttribute("transform", `rotate(${state.angle}, ${centerX}, ${centerY})`);
        }
      }
      frameId = requestAnimationFrame(loop);
    };
    animationState.current.waitTarget = Math.random() * (maxDelay - minDelay) + minDelay;
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [minDelay, maxDelay]);

  return (
    <svg className={cn("fixed inset-0 pointer-events-none h-full w-full z-0", className)}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#2EB9DF", stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: "#9E00FF", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect ref={starRef} width={10} height={1} fill="url(#gradient)" style={{ opacity: 0 }} />
    </svg>
  );
};

// --- TypewriterEffectSmooth (RESTORED FROM DEPLOYED CODE) ---
const TypewriterEffectSmooth = ({ 
  words, 
  className, 
  cursorClassName,
  delay = 0 
}: { 
  words: { text: string; className?: string }[]; 
  className?: string; 
  cursorClassName?: string;
  delay?: number; 
}) => {
  const renderWords = () => (
    <div>
      {words.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block">
          <span className={cn(`dark:text-white text-black `, word.className)}>{word.text}</span>&nbsp;
        </div>
      ))}
    </div>
  );
  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <motion.div 
        className="overflow-hidden pb-2" 
        initial={{ width: "0%" }} 
        whileInView={{ width: "fit-content" }} 
        viewport={{ once: true }}
        transition={{ 
          duration: 2, 
          ease: "linear", 
          delay: delay 
        }}
      >
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-bold tracking-tight" style={{ whiteSpace: "nowrap" }}>{renderWords()}</div>
      </motion.div>
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }} className={cn("block rounded-sm w-[4px] h-8 sm:h-10 md:h-12 lg:h-20", cursorClassName)}></motion.span>
    </div>
  );
};

// --- BlurFade ---
const BlurFade = ({ children, delay = 0, className, yOffset = 20 }: { children: React.ReactNode; delay?: number; className?: string; yOffset?: number; }) => (
  <motion.div initial={{ opacity: 0, y: yOffset, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, margin: "-50px" }} transition={{ delay, duration: 0.6, ease: "easeOut" }} className={className}>
    {children}
  </motion.div>
);

// =========================================
// HEADER BUTTONS COMPONENT (For Desktop)
// =========================================

const TopNavButton = ({ text, href, newTab = false }: { text: string; href: string; newTab?: boolean }) => (
  <a 
    href={href}
    target={newTab ? "_blank" : undefined}
    rel={newTab ? "noopener noreferrer" : undefined}
    className="group relative px-6 py-2 rounded-full bg-neutral-900/50 border border-white/10 hover:border-white/30 text-sm font-medium text-neutral-300 transition-all duration-300 hover:bg-white/10 backdrop-blur-sm overflow-hidden"
  >
    <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
    <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
      {text}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
        <path d="M7 17 17 7"/>
        <path d="M7 7h10v10"/>
      </svg>
    </span>
  </a>
);

const HeaderButtons = () => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: 1, duration: 0.5 }}
    className="absolute top-6 right-6 z-50 flex items-center gap-4 hidden md:flex"
  >
    <TopNavButton text="Projects" href="/projects" />
    <TopNavButton text="Resume" href="/resume.pdf" newTab={true} />
  </motion.div>
);

// =========================================
// INTRO OVERLAY COMPONENT
// =========================================

const IntroOverlay = () => {
  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
    >
      <StarsBackground starColor="0, 0, 0" />
      <h1 className="relative z-10 text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900">
        Varun Sivanesan
      </h1>
    </motion.div>
  );
};

// ==============================================================================
//                              DESKTOP COMPONENT
//               (Restored exactly to the "Deployed" version)
// ==============================================================================

const ShootingStarsPageDesktop = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [typewriterDelay, setTypewriterDelay] = useState(1.8); // Initial delay

  useEffect(() => {
    // 1. Show curtain for 1s
    const timer1 = setTimeout(() => {
      setShowIntro(false);
    }, 1000);
     
    // 2. After curtain animation finishes (~1.9s total), set delay to 0 for future renders
    const timer2 = setTimeout(() => {
      setTypewriterDelay(0);
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const greyGradientClass = "bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white dark:text-transparent";
  const purplePinkGradientClass = "bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 dark:text-transparent";
  const cursorGradientClass = "bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500";

  const typewriterWords = [
    { text: "Hi,", className: greyGradientClass },
    { text: "I", className: greyGradientClass },
    { text: "am", className: greyGradientClass },
    { text: "Varun Sivanesan", className: purplePinkGradientClass },
  ];

  const [age, setAge] = useState(20);
  useEffect(() => {
    const birthDate = new Date("2004-07-08");
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge);
  }, []);

  const techIcons = [
    { name: "Python", url: "https://cdn.simpleicons.org/python/white", link: "https://www.python.org/" },
    { name: "JavaScript", url: "https://cdn.simpleicons.org/javascript/yellow", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "React", url: "https://cdn.simpleicons.org/react/blue", link: "https://react.dev/" },
    { name: "Next.js", url: "https://cdn.simpleicons.org/nextdotjs/white", link: "https://nextjs.org/" },
    { name: "HTML5", url: "https://cdn.simpleicons.org/html5/orange", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "CSS3", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },    { name: "Tailwind CSS", url: "https://cdn.simpleicons.org/tailwindcss/cyan", link: "https://tailwindcss.com/" },
    { name: "TensorFlow", url: "https://cdn.simpleicons.org/tensorflow/orange", link: "https://www.tensorflow.org/" },
    { name: "PyTorch", url: "https://cdn.simpleicons.org/pytorch/orange", link: "https://pytorch.org/" },
    { name: "Node.js", url: "https://cdn.simpleicons.org/nodedotjs/green", link: "https://nodejs.org/" },
    { name: "Flask", url: "https://cdn.simpleicons.org/flask/white", link: "https://flask.palletsprojects.com/" },
    { name: "Hugging Face", url: "https://cdn.simpleicons.org/huggingface/yellow", link: "https://huggingface.co/" },
    { name: "MongoDB", url: "https://cdn.simpleicons.org/mongodb/green", link: "https://www.mongodb.com/" },
    { name: "PostgreSQL", url: "https://cdn.simpleicons.org/postgresql/blue", link: "https://www.postgresql.org/" },
    { name: "Git", url: "https://cdn.simpleicons.org/git/orange", link: "https://git-scm.com/" },
    { name: "Vercel", url: "https://cdn.simpleicons.org/vercel/white", link: "https://vercel.com/" },
    { name: "LangChain", url: "https://cdn.simpleicons.org/langchain/white", link: "https://www.langchain.com/" },
    { name: "Pandas", url: "https://cdn.simpleicons.org/pandas/white", link: "https://pandas.pydata.org/" },
    { name: "Numpy", url: "https://cdn.simpleicons.org/numpy/white", link: "https://numpy.org/" },
  ];

  const coreTech = [
    "Python", "JavaScript", "React", "Next.js", "Node.js", "Flask", "HTML5", "CSS3", "Tailwind CSS", 
    "TensorFlow", "PyTorch", "CNN", "RAG", "NLP", "Computer Vision", "Maths for ML"
  ];
  const toolsPlatforms = [
    "Git", "Docker", "MongoDB", "PostgreSQL", "Vercel", "Railway", "Ngrok", 
    "Pandas", "NumPy", "Hugging Face", "LangChain", "CI/CD", "Webhooks", "Scraping"
  ];
  const softSkills = [
    "Team Leadership", "Project Management", "Technical Writing", "Mentoring", "Professional Communication"
  ];

  const SkillBadge = ({ name }: { name: string }) => (
      <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-neutral-300 hover:bg-white/10 hover:border-white/20 transition-colors cursor-default shadow-sm">
          {name}
      </span>
  );

 const dockItems = [
    { title: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, href: "#" },
    { title: "Notes", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>, href: "/notes" },
    { title: "Projects", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 18 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.21 4.5 2.6 4.5-2.6"/><polyline points="7.5 19.79 7.5 14.6 3 12"/></svg>, href: "/projects" },
    { title: "GitHub", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>, href: "https://github.com/ilvoirr" },
    { title: "LinkedIn", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>, href: "https://www.linkedin.com/in/varun-sivanesan-397928205/" },
    { title: "Twitter", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>, href: "https://x.com/varunnetworks" },
    { title: "Instagram", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>, href: "https://www.instagram.com/ilvoirr/" },
    { title: "Gmail", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, href: "mailto:contactvarun04@gmail.com" },
    { title: "Call", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, href: "tel:7827919494" },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans relative w-full overflow-x-hidden pb-7">
        
      <AnimatePresence mode="wait">
        {showIntro && <IntroOverlay />}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - var(--gap))); }
        }
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(calc(-100% - var(--gap))); }
        }
        .animate-marquee { animation: marquee var(--duration) linear infinite; }
        .animate-marquee-vertical { animation: marquee-vertical var(--duration) linear infinite; }
      `}} />

      <ShootingStars minDelay={50} maxDelay={200} />
      <StarsBackground />

      {/* HERO SECTION */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative z-10 p-4">
        {/* NEW HEADER BUTTONS INSERTED HERE */}
        <HeaderButtons />

        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          <TypewriterEffectSmooth 
             words={typewriterWords} 
             cursorClassName={cursorGradientClass} 
             delay={typewriterDelay} // Uses the state variable (1.8s first time, 0s after)
          />
          <h2 className="z-10 text-lg md:text-2xl lg:text-4xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white dark:text-transparent mt-2 mb-2">
            Full Stack Software Engineering Developer
          </h2>
          <p className="z-10 text-sm md:text-lg text-neutral-400 max-w-xl mx-auto text-center mt-2">
            Concerned with building pretty UI/UX, modular workflows for complex backend tasks and growing my knowledge endlessly.
          </p>
        </div>
        <motion.div 
            className="absolute bottom-30 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            onClick={() => {
                const skillsSection = document.getElementById('skills');
                if (skillsSection) skillsSection.scrollIntoView({ behavior: 'smooth' });
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 h-8 w-8 md:h-10 md:w-10 opacity-70 hover:opacity-100 transition-opacity">
                <path d="m6 9 6 6 6-6"/>
            </svg>
        </motion.div>
      </section>

      {/* SKILLS & EXPERTISE SECTION */}
      <section id="skills" className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 py-20 px-4 md:px-10 bg-transparent">
        <div className="max-w-6xl w-full mx-auto space-y-16">
          <BlurFade delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Skills & Expertise
            </h2>
          </BlurFade>

          {/* Marquee of Icons (Transparent Background) */}
          <BlurFade delay={0.2}>
            <div className="relative flex h-24 w-full flex-col items-center justify-center overflow-hidden">
              <Marquee pauseOnHover className="[--duration:40s]">
                {techIcons.map((icon, index) => (
                  <a 
                    key={index} 
                    href={icon.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center mx-8 cursor-pointer z-20"
                  >
                    <img src={icon.url} alt={icon.name} className="h-12 w-12 opacity-70 hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </Marquee>
            </div>
          </BlurFade>

          {/* Skills Grid - No BorderBeam */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Core Technologies */}
            <BlurFade delay={0.3} className="relative p-6 border border-white/10 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
              <h3 className="text-xl font-semibold mb-6 text-purple-400">Core Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {coreTech.map(tech => <SkillBadge key={tech} name={tech} />)}
              </div>
            </BlurFade>

            {/* Tools & Platforms */}
            <BlurFade delay={0.4} className="relative p-6 border border-white/10 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
              <h3 className="text-xl font-semibold mb-6 text-blue-400">Tools & Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {toolsPlatforms.map(tool => <SkillBadge key={tool} name={tool} />)}
              </div>
            </BlurFade>

            {/* Soft Skills */}
            <BlurFade delay={0.5} className="relative p-6 border border-white/10 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
              <h3 className="text-xl font-semibold mb-6 text-pink-400">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map(skill => <SkillBadge key={skill} name={skill} />)}
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="min-h-screen w-full flex items-center justify-center relative z-10 py-20 px-4 md:px-10">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6 text-left order-2 md:order-1">
                <BlurFade delay={0.1}>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-pink-500 w-fit">About Me</h2>
                </BlurFade>

                {/* 1. Location */}
                <BlurFade delay={0.2}>
                    <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
                        I live in <span className="text-white font-semibold">Delhi/Jaipur</span>.
                    </p>
                </BlurFade>

                {/* 2. Age & University */}
                <BlurFade delay={0.3}>
                    <p className="text-lg md:text-xl text-neutral-300 leading-relaxed font-medium">
                        I'm a <span className="text-white font-semibold">{age} y/o</span> studied at <span className="text-white font-semibold">Manipal University Jaipur</span>.
                    </p>
                </BlurFade>
                 
                {/* 3. Hobbies */}
                <BlurFade delay={0.4}>
                    <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
                        My hobbies include <span className="text-white">Technology</span>, <span className="text-white">Physics</span>, <span className="text-white">Linguistics</span>, <span className="text-white">Table Tennis</span>, <span className="text-white">Kdramas</span> and <span className="text-white">League of Legends</span>.
                    </p>
                </BlurFade>

                {/* 4. Philosophy */}
                <BlurFade delay={0.5}>
                    <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
                        I like to do things only when they can be done perfectly which helps me build a strong set of fundamentals regarding everything we interact with.
                    </p>
                </BlurFade>
            </div>
            <div className="flex justify-center md:justify-end order-1 md:order-2">
                <BlurFade delay={0.4} className="relative">
                   <CometCard className="relative h-72 w-72 md:h-96 md:w-[30rem] rounded-[2.5rem]">
                       <PixelImage 
                          src="/varun1.jpg"
                          customGrid={{ rows: 4, cols: 6 }}
                          grayscaleAnimation={true}
                          className="w-full h-full rounded-[2.5rem]"
                       />
                   </CometCard>
                </BlurFade>
            </div>
        </div>
      </section>

      {/* LEAGUE SECTION */}
      <section id="league" className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 py-20 px-4 md:px-10 bg-neutral-900/30">
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center gap-12">
            {/* Text Content - Centered Top */}
            <div className="flex flex-col space-y-6 items-center">
                <BlurFade delay={0.1}>
                    {/* Updated gradient for title */}
                    <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600 w-fit">
                        I am IndianAphelios
                    </h2>
                </BlurFade>
                <BlurFade delay={0.2}>
                    {/* Shortened Lore */}
                    <p className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-3xl">
                         Born under a rare moon, a mute assassin of the Lunari faith. Guided by his sister Alune from the spirit realm, he cycles through five moonstone weapons to deliver silent death.
                    </p>
                </BlurFade>
                 <BlurFade delay={0.3}>
                    {/* Improved Quote Styling */}
                    <p className="text-lg md:text-xl font-light italic text-indigo-200/80 tracking-wide mt-2">
                        "Best Aphelios I have ever seen"  <span className="text-sm text-neutral-500 not-italic">- ADCs in Silver Probably</span>
                    </p>
                </BlurFade>
            </div>

            {/* Images - Bottom Row (Reverted to smaller container max-w-4xl) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Champion Art - Clickable */}
                <BlurFade delay={0.4}>
                    <a href="https://www.leagueoflegends.com/en-us/champions/aphelios/" target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer group relative rounded-2xl overflow-hidden">
                        <CometCard className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                             <img src="/aphe.jpg" alt="Aphelios" className="w-full h-full object-cover" />
                             {/* Hover Overlay */}
                             <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-50">
                                <p className="text-white font-bold text-sm tracking-[0.2em] uppercase drop-shadow-md text-center px-4">
                                    The Weapon of the Faithful
                                </p>
                             </div>
                        </CometCard>
                    </a>
                </BlurFade>

                {/* Stats/Account - Clickable */}
                <BlurFade delay={0.5}>
                      <a href="https://dpm.lol/IndianAphelios-SG2" target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer group relative rounded-2xl overflow-hidden">
                          <CometCard className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                              <img src="/aph.png" alt="Account Stats" className="w-full h-full object-cover" />
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-50">
                                <p className="text-white font-bold text-sm tracking-[0.2em] uppercase drop-shadow-md text-center px-4">
                                    Check Recent Match History
                                </p>
                             </div>
                        </CometCard>
                      </a>
                </BlurFade>
            </div>
        </div>
      </section>

      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock 
          items={dockItems} 
          desktopClassName="bg-neutral-900/80 border border-neutral-800 backdrop-blur-md"
        />
      </div>
    </div>
  );
}

// ==============================================================================
//                              MOBILE COMPONENT
//                   (Exactly as provided in the user prompt)
// ==============================================================================

const ShootingStarsPageMobile = () => {
  const [showIntro, setShowIntro] = useState(true);
  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => { setShowIntro(false); }, 1000);
    return () => { clearTimeout(timer1); };
  }, []);

  const greyGradientClass = "bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white dark:text-transparent";
  const purplePinkGradientClass = "bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 dark:text-transparent";
  const cursorGradientClass = "bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500";

  const nameWords = [
    { text: "Varun Sivanesan", className: `${purplePinkGradientClass} text-4xl sm:text-5xl` },
  ];

  const [age, setAge] = useState(20);
  useEffect(() => {
    const birthDate = new Date("2004-07-08");
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge);
  }, []);

  // --- Data Lists ---
  const techIcons = [
    { name: "Python", url: "https://cdn.simpleicons.org/python/white", link: "https://www.python.org/" },
    { name: "JavaScript", url: "https://cdn.simpleicons.org/javascript/yellow", link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
    { name: "React", url: "https://cdn.simpleicons.org/react/blue", link: "https://react.dev/" },
    { name: "Next.js", url: "https://cdn.simpleicons.org/nextdotjs/white", link: "https://nextjs.org/" },
    { name: "HTML5", url: "https://cdn.simpleicons.org/html5/orange", link: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
    { name: "CSS3", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", link: "https://developer.mozilla.org/en-US/docs/Web/CSS" },    { name: "Tailwind CSS", url: "https://cdn.simpleicons.org/tailwindcss/cyan", link: "https://tailwindcss.com/" },
    { name: "TensorFlow", url: "https://cdn.simpleicons.org/tensorflow/orange", link: "https://www.tensorflow.org/" },
    { name: "PyTorch", url: "https://cdn.simpleicons.org/pytorch/orange", link: "https://pytorch.org/" },
    { name: "Node.js", url: "https://cdn.simpleicons.org/nodedotjs/green", link: "https://nodejs.org/" },
    { name: "Flask", url: "https://cdn.simpleicons.org/flask/white", link: "https://flask.palletsprojects.com/" },
    { name: "Hugging Face", url: "https://cdn.simpleicons.org/huggingface/yellow", link: "https://huggingface.co/" },
    { name: "MongoDB", url: "https://cdn.simpleicons.org/mongodb/green", link: "https://www.mongodb.com/" },
    { name: "PostgreSQL", url: "https://cdn.simpleicons.org/postgresql/blue", link: "https://www.postgresql.org/" },
    { name: "Git", url: "https://cdn.simpleicons.org/git/orange", link: "https://git-scm.com/" },
    { name: "Vercel", url: "https://cdn.simpleicons.org/vercel/white", link: "https://vercel.com/" },
    { name: "LangChain", url: "https://cdn.simpleicons.org/langchain/white", link: "https://www.langchain.com/" },
    { name: "Pandas", url: "https://cdn.simpleicons.org/pandas/white", link: "https://pandas.pydata.org/" },
    { name: "Numpy", url: "https://cdn.simpleicons.org/numpy/white", link: "https://numpy.org/" },
  ];

  const coreTech = ["Python", "JavaScript", "React", "Next.js", "Node.js", "Flask", "HTML5", "CSS3", "Tailwind CSS", "TensorFlow", "PyTorch", "CNN", "RAG", "NLP", "Computer Vision", "Maths for ML"];
  const toolsPlatforms = ["Git", "Docker", "MongoDB", "PostgreSQL", "Vercel", "Railway", "Ngrok", "Pandas", "NumPy", "Hugging Face", "LangChain", "CI/CD", "Webhooks", "Scraping"];
  const softSkills = ["Team Leadership", "Project Management", "Technical Writing", "Mentoring", "Professional Communication"];

  // --- CHANGED: Using 'vw' for text size and padding to fit small screens ---
  const SkillBadge = ({ name }: { name: string }) => (
      <span className="inline-block px-[3vw] py-[1vw] rounded-full bg-white/5 border border-white/10 text-[3.5vw] text-neutral-300 hover:bg-white/10 hover:border-white/20 transition-colors cursor-default shadow-sm">
          {name}
      </span>
  );

  const dockItems = [
    { title: "Home", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, href: "#" },
    { title: "Notes", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>, href: "/notes" },
    { title: "Projects", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 18 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.21 4.5 2.6 4.5-2.6"/><polyline points="7.5 19.79 7.5 14.6 3 12"/></svg>, href: "/projects" },
    { title: "GitHub", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>, href: "https://github.com/ilvoirr" },
    { title: "LinkedIn", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>, href: "https://www.linkedin.com/in/varun-sivanesan-397928205/" },
    { title: "Twitter", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>, href: "https://x.com/varunnetworks" },
    { title: "Instagram", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>, href: "https://www.instagram.com/ilvoirr/" },
    { title: "Gmail", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, href: "mailto:contactvarun04@gmail.com" },
    { title: "Call", icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, href: "tel:7827919494" },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans relative w-full overflow-x-hidden pb-0">
        
      <AnimatePresence mode="wait">
        {showIntro && <IntroOverlay />}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - var(--gap))); }
        }
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(calc(-100% - var(--gap))); }
        }
        .animate-marquee { animation: marquee var(--duration) linear infinite; }
        .animate-marquee-vertical { animation: marquee-vertical var(--duration) linear infinite; }
      `}} />

      <ShootingStars minDelay={50} maxDelay={200} />
      <StarsBackground />

      {/* HAMBURGER MENU BUTTON (Top Right) */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-6 right-6 z-[60] p-2 text-white hover:opacity-80 active:scale-95 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" x2="21" y1="6" y2="6" />
          <line x1="3" x2="21" y1="12" y2="12" />
          <line x1="3" x2="21" y1="18" y2="18" />
        </svg>
      </button>

      {/* SIDEBAR DRAWER */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />
             
            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed top-0 right-0 h-full w-64 bg-neutral-950/90 border-l border-white/10 backdrop-blur-xl z-[80] p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-6 mt-12">
                {dockItems.map((item, idx) => (
                   <a 
                     key={item.title} 
                     href={item.href}
                     onClick={() => setIsSidebarOpen(false)}
                     target={item.href.startsWith("http") ? "_blank" : undefined}
                     rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                     className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-neutral-300 hover:text-white transition-all group"
                   >
                     <div className="p-2 rounded-lg bg-neutral-900 border border-white/5 group-hover:border-white/20 transition-colors">
                       {React.cloneElement(item.icon as any, { className: "w-5 h-5" })}
                     </div>
                     <span className="font-medium">{item.title}</span>
                   </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative z-10 p-4">
        {/* Note: HeaderButtons removed from Mobile as per request, moved to Sidebar/Inline */}
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
           
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            {/* STATIC TEXT LINE 1 */}
            <h2 className={`text-4xl font-bold tracking-tight ${greyGradientClass}`}>
              Hi, I am
            </h2>

            {/* STATIC TEXT LINE 2 (Name) - Typewriter Removed */}
            <h1 className={`text-5xl sm:text-6xl font-bold tracking-tighter ${purplePinkGradientClass}`}>
               Varun Sivanesan
            </h1>
          </div>

          {/* REDUCED SIZE for Full Stack Line (text-sm) */}
          <h2 className="z-10 text-base sm:text-base font-medium tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white dark:text-transparent mt-4 mb-2">
            Full Stack Software Engineering Developer
          </h2>
           
          <p className="z-10 text-sm md:text-lg text-neutral-400 max-w-lg mx-auto text-center mt-0 mb-5">
            Concerned with building pretty UI/UX and modular workflows for complex backend tasks.
          </p>
           
          {/* LUXURIOUS MOBILE BUTTONS */}
          <div className="flex flex-row gap-4 mt-8 z-20">
             <a 
               href="/projects"
               className="px-6 py-3 rounded-full bg-neutral-900/40 border border-white/10 hover:bg-white/10 backdrop-blur-md text-white font-medium transition-all active:scale-95 shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]"
             >
               Projects
             </a>
             <a 
               href="/resume.pdf"
               target="_blank"
               rel="noopener noreferrer"
               className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 hover:border-purple-500/50 backdrop-blur-md text-white font-medium transition-all active:scale-95 shadow-[0_0_20px_-5px_rgba(236,72,153,0.3)]"
             >
               Resume
             </a>
          </div>

        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            onClick={() => {
                const skillsSection = document.getElementById('skills');
                if (skillsSection) skillsSection.scrollIntoView({ behavior: 'smooth' });
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 h-8 w-8 md:h-10 md:w-10 opacity-70 hover:opacity-100 transition-opacity">
                <path d="m6 9 6 6 6-6"/>
            </svg>
        </motion.div>
      </section>

      {/* SKILLS SECTION */}
      {/* CHANGED: w-[90vw] to prevent edge touch, reduced vertical spacing, fluid paddings */}
      <section id="skills" className="w-full flex flex-col items-center relative z-10 py-10 px-4 bg-transparent">
        <div className="w-[90vw] mx-auto flex flex-col gap-6">
          <BlurFade delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Skills & Expertise
            </h2>
          </BlurFade>

          {/* Marquee Removed */}

          <div className="grid grid-cols-1 gap-4">
            <BlurFade delay={0.2} className="relative p-[5vw] border border-white/10 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
              {/* CHANGED: Fluid font size for box headers */}
              <h3 className="text-[5vw] font-semibold mb-[3vw] text-purple-400">Core Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {coreTech.map(tech => <SkillBadge key={tech} name={tech} />)}
              </div>
            </BlurFade>

            <BlurFade delay={0.3} className="relative p-[5vw] border border-white/10 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
              <h3 className="text-[5vw] font-semibold mb-[3vw] text-blue-400">Tools & Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {toolsPlatforms.map(tool => <SkillBadge key={tool} name={tool} />)}
              </div>
            </BlurFade>

            <BlurFade delay={0.4} className="relative p-[5vw] border border-white/10 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
              <h3 className="text-[5vw] font-semibold mb-[3vw] text-pink-400">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map(skill => <SkillBadge key={skill} name={skill} />)}
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="min-h-screen w-full flex items-center justify-center relative z-10 py-20 px-4 md:px-10">
        <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6 text-left order-2 md:order-1">
                <BlurFade delay={0.1}>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-pink-500 w-fit">About Me</h2>
                </BlurFade>
                <BlurFade delay={0.2}>
                    <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
                        I live in <span className="text-white font-semibold">Delhi/Jaipur</span>.
                    </p>
                </BlurFade>
                <BlurFade delay={0.3}>
                    <p className="text-lg md:text-xl text-neutral-300 leading-relaxed font-medium">
                        I'm a <span className="text-white font-semibold">{age} y/o</span> studied at <span className="text-white font-semibold">Manipal University Jaipur</span>.
                    </p>
                </BlurFade>
                <BlurFade delay={0.4}>
                    <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
                        My hobbies include <span className="text-white">Technology</span>, <span className="text-white">Physics</span>, <span className="text-white">Linguistics</span>, <span className="text-white">Table Tennis</span>, <span className="text-white">Kdramas</span> and <span className="text-white">League of Legends</span>.
                    </p>
                </BlurFade>
                <BlurFade delay={0.5}>
                    <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
                        I like to do things, only when they can be done perfectly to build strong fundamentals.
                    </p>
                </BlurFade>
            </div>
            <div className="flex justify-center md:justify-end order-1 md:order-2">
                <BlurFade delay={0.4} className="relative">
                   <CometCard className="relative h-72 w-72 md:h-96 md:w-[30rem] rounded-[2.5rem]">
                       <PixelImage 
                          src="/varun1.jpg"
                          customGrid={{ rows: 4, cols: 6 }}
                          grayscaleAnimation={true}
                          className="w-full h-full rounded-[2.5rem]"
                       />
                   </CometCard>
                </BlurFade>
            </div>
        </div>
      </section>

      {/* LEAGUE SECTION */}
      <section id="league" className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 py-20 px-4 md:px-10 bg-neutral-900/30">
        <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center gap-12">
            <div className="flex flex-col space-y-6 items-center">
                <BlurFade delay={0.1}>
                    <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-500 to-purple-600 w-fit">
                        I am IndianAphelios
                    </h2>
                </BlurFade>
                <BlurFade delay={0.2}>
                    <p className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-3xl">
                         Born under a rare moon, a mute assassin of the Lunari faith. Guided by his sister Alune from the spirit realm, he cycles through five moonstone weapons to deliver silent death.
                    </p>
                </BlurFade>
                 <BlurFade delay={0.3}>
                    <p className="text-lg md:text-xl font-light italic text-indigo-200/80 tracking-wide mt-2">
                        "Best Aphelios I have ever seen"  <span className="text-sm text-neutral-500 not-italic"><br></br>- ADCs in Silver Probably</span>
                    </p>
                </BlurFade>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <BlurFade delay={0.4}>
                    <a href="https://www.leagueoflegends.com/en-us/champions/aphelios/" target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer group relative rounded-2xl overflow-hidden">
                        <CometCard className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                             <img src="/aphe.jpg" alt="Aphelios" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-50">
                                <p className="text-white font-bold text-sm tracking-[0.2em] uppercase drop-shadow-md text-center px-4">
                                    The Weapon of the Faithful
                                </p>
                             </div>
                        </CometCard>
                    </a>
                </BlurFade>

                <BlurFade delay={0.5}>
                      <a href="https://dpm.lol/IndianAphelios-SG2" target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer group relative rounded-2xl overflow-hidden">
                          <CometCard className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                              <img src="/aph.png" alt="Account Stats" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-50">
                                <p className="text-white font-bold text-sm tracking-[0.2em] uppercase drop-shadow-md text-center px-4">
                                    Check Recent Match History
                                </p>
                             </div>
                        </CometCard>
                      </a>
                </BlurFade>
            </div>
        </div>
      </section>
      
      {/* Note: Floating Dock removed from Mobile */}
    </div>
  );
}
// ==============================================================================
//                              MAIN EXPORT
// ==============================================================================

export default function ShootingStarsPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile ? <ShootingStarsPageMobile /> : <ShootingStarsPageDesktop />;
}
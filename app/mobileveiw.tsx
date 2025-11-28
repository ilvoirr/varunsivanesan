"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Added for routing
import { AnimatePresence, motion } from "framer-motion";
// Importing shared components from desktop.tsx
import { 
  IntroOverlay, 
  StarsBackground, 
  ShootingStars, 
  BlurFade, 
  CometCard, 
  PixelImage 
} from "./desktop";

// ==============================================================================
//                              MOBILE COMPONENT
// ==============================================================================

const ShootingStarsPageMobile = () => {
  const router = useRouter(); // Initialize router
  const [showIntro, setShowIntro] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // State for Exit Curtain

  // HANDLER FOR IMMEDIATE NAVIGATION
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Intro Timer
  useEffect(() => {
    const timer1 = setTimeout(() => { setShowIntro(false); }, 1000);
    return () => { clearTimeout(timer1); };
  }, []);

  // Age Calculation
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

  // Text Gradients
  const greyGradientClass = "bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white dark:text-transparent";
  const purplePinkGradientClass = "bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 dark:text-transparent";

  // Data
  const coreTech = ["Python", "JavaScript", "React", "Next.js", "Node.js", "Flask", "HTML5", "CSS3", "Tailwind CSS", "TensorFlow", "PyTorch", "CNN", "RAG", "NLP", "Computer Vision", "Maths for ML"];
  const toolsPlatforms = ["Git", "Scikit", "MongoDB", "PostgreSQL", "Vercel", "Railway", "Ngrok", "Pandas", "NumPy", "Hugging Face", "LangChain", "CI/CD", "Webhooks", "Scraping"];
  const softSkills = ["Team Leadership", "Project Management", "Technical Writing", "Mentoring", "Professional Communication","Works Better under Pressure", "Very Quick"];

  // Sub-component for Skills
  const SkillBadge = ({ name }: { name: string }) => (
      <span className="inline-block px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 hover:bg-white/10 hover:border-white/20 transition-colors cursor-default shadow-sm">
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
        
      {/* Intro Overlay */}
      <AnimatePresence mode="wait">
        {showIntro && <IntroOverlay />}
      </AnimatePresence>

      {/* Exit Overlay (Fast 0.1s Curtain) */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
          >
             <h1 className="relative z-10 text-4xl md:text-6xl font-bold tracking-tighter text-neutral-900 font-sans">
                Varun Sivanesan
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND ELEMENTS */}
      <ShootingStars minDelay={50} maxDelay={200} />
      <StarsBackground />
      
      {/* Top Blur & Vignette */}
      <div 
        className="fixed top-0 left-0 w-full h-48 z-[55] pointer-events-none backdrop-blur-xl" 
        style={{
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)"
        }}
      />
      <div className="fixed top-0 left-0 w-full h-48 z-[55] pointer-events-none bg-gradient-to-b from-neutral-950/20 to-transparent" />

      {/* Floating Notch Menu Trigger */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }} 
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-[65vw] max-w-[280px]"
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

      {/* "LIQUID GLASS" MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[70] flex flex-col items-center justify-start pt-28 px-4">
            
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
                            if ((item.href === "/projects" || item.href === "/notes") && handleNavigation) {
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

      {/* HERO SECTION */}
      <section className="h-screen w-full flex flex-col items-center justify-center relative z-10 p-4 pt-20">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <h2 className={`text-4xl font-bold tracking-tight ${greyGradientClass}`}>
              Hi, I am
            </h2>

            <h1 className={`text-5xl sm:text-6xl font-bold tracking-tighter ${purplePinkGradientClass}`}>
               Varun Sivanesan
            </h1>
          </div>

          <h2 className="z-10 whitespace-nowrap text-[clamp(12px,vw,16px)] sm:text-base font-medium tracking-wide bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white dark:text-transparent mt-4 mb-2">
            Full Stack Software Engineering Developer
          </h2>
          <p className="z-10 text-sm md:text-lg text-neutral-400 max-w-lg mx-auto text-center mt-0 mb-5">
            Concerned with building pretty UI/UX and modular workflows for complex backend tasks.
          </p>
            
          <div className="flex flex-row gap-4 mt-8 z-20">
             <a 
               href="/projects"
               onClick={(e) => {
                 e.preventDefault();
                 handleNavigation("/projects");
               }}
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
        
        {/* Chevron Scroll Indicator */}
        <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            onClick={() => {
                const skillsSection = document.getElementById('skills');
                if (skillsSection) {
                    const yOffset = -90; 
                    const elementPosition = skillsSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY + yOffset;
              
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                    });
                }
            }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 h-8 w-8 md:h-10 md:w-10 opacity-70 hover:opacity-100 transition-opacity">
                <path d="m6 9 6 6 6-6"/>
            </svg>
        </motion.div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="w-full flex flex-col items-center relative z-10 py-6 px-4 bg-transparent">
        <div className="w-[85vw] max-w-[380px] mx-auto flex flex-col gap-4">
          <BlurFade delay={0.1}>
            <h2 className="text-3xl mb-3 font-bold tracking-tighter text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500">
              Skills & Expertise
            </h2>
          </BlurFade>

          <div className="grid grid-cols-1 gap-3">
            <BlurFade delay={0.2} className="relative p-5 border border-white/10 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
              <h3 className="text-base font-semibold mb-3 text-purple-400">Core Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {coreTech.map(tech => <SkillBadge key={tech} name={tech} />)}
              </div>
            </BlurFade>

            <BlurFade delay={0.3} className="relative p-5 border border-white/10 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
              <h3 className="text-base font-semibold mb-3 text-blue-400">Tools & Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {toolsPlatforms.map(tool => <SkillBadge key={tool} name={tool} />)}
              </div>
            </BlurFade>

            <BlurFade delay={0.4} className="relative p-5 border border-white/10 rounded-2xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
              <h3 className="text-base font-semibold mb-3 text-pink-400">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {softSkills.map(skill => <SkillBadge key={skill} name={skill} />)}
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ==============================================================================
          ABOUT SECTION
      ============================================================================== */}
      <section id="about" className="w-full flex flex-col items-center relative z-10 py-24 px-4">
        
        {/* Glass Container */}
        <div className="w-[90vw] max-w-[400px] mx-auto">
            {/* Main Card */}
            <BlurFade delay={0.2} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative flex flex-col items-center p-6 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                    
                    {/* Image Area */}
                    <div className="w-full aspect-square mb-6 rounded-3xl overflow-hidden relative shadow-2xl">
                         <CometCard className="w-full h-full rounded-3xl">
                            <PixelImage 
                                src="/varun1.jpg"
                                customGrid={{ rows: 6, cols: 6 }}
                                grayscaleAnimation={true}
                                className="w-full h-full object-cover"
                            />
                         </CometCard>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col gap-4 text-center">
                        <div>
                            <h3 className="text-2xl font-bold text-white">Varun Sivanesan</h3>
                            <p className="text-sm text-neutral-400 font-medium">{age} years old • Delhi/Jaipur</p>
                        </div>
                        
                        <div className="h-[1px] w-full bg-white/5"></div>

                        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed text-left px-2">
                            <p className="text-center">
                                Studying at <span className="text-white font-medium">Manipal University Jaipur</span>.
                            </p>
                            <p>
                                I live in <span className="text-white font-medium">Delhi/Jaipur</span>. My hobbies include <span className="text-white">Technology</span>, <span className="text-white">Physics</span>, <span className="text-white">Linguistics</span>, <span className="text-white">Table Tennis</span>, <span className="text-white">Kdramas</span> and <span className="text-white">League of Legends</span>.
                            </p>
                            <p className="text-center text-neutral-400 italic">
                                "Winning is my thing because i only play games i can & want to win"
                            </p>
                        </div>
                    </div>
                </div>
            </BlurFade>
        </div>
      </section>

      {/* ==============================================================================
          LEAGUE SECTION - COMMANDER THEME
      ============================================================================== */}
      <section id="league" className="w-full flex flex-col items-center relative z-10 pb-10 px-4">
        
        <div className="w-[90vw] max-w-[400px] mx-auto">
            <BlurFade delay={0.1}>
                 {/* Header */}
                 <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-cyan-500/50"></div>
                    <span className="text-sm font-bold tracking-widest text-cyan-500 uppercase">Summoner</span>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-cyan-500/50"></div>
                </div>
            </BlurFade>

            {/* APHELIOS MAIN CARD */}
            <BlurFade delay={0.2} className="relative group cursor-default mb-6">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-600/20 rounded-[2rem] blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative p-1 bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden">
                    
                    {/* The Image */}
                    <a href="https://dpm.lol/IndianAphelios-SG2" target="_blank" rel="noopener noreferrer" className="block relative w-full aspect-video rounded-[1.8rem] overflow-hidden group/img">
                        <img src="/aphe.jpg" alt="Aphelios" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 w-full p-5">
                            <p className="text-[10px] font-bold text-cyan-300 tracking-[0.2em] uppercase mb-1">Click for Recent Match History</p>
                            <h2 className="text-3xl font-bold text-white tracking-tight">I Am IndianAphelios</h2>
                        </div>
                    </a>

                    {/* Stats / Lore */}
                    <div className="p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-center text-xs font-medium text-neutral-400 border-b border-white/5 pb-3">
                            <span>Region: <span className="text-white">South East Asia</span></span>
                            <span>Faith: <span className="text-purple-400">Lunari</span></span>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-white">The Weapon of the Faithful</h4>
                            <p className="text-xs leading-5 text-neutral-400 text-justify">
                                Managing the ammunition of five moonstone weapons—Calibrum, Severum, Gravitum, Infernum, and Crescendum. A playstyle defined by 200 years of collective game design and silent precision.
                            </p>
                        </div>

                        {/* The Joke Quote */}
                        <div className="relative bg-white/5 rounded-xl p-4 mt-2 border border-white/5">
                            <svg className="absolute top-2 left-2 w-4 h-4 text-neutral-600 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.0547 15.592 14.4793 17.5373 14.4793H19.9653L19.9653 21H14.017ZM8.00269 14.4793C10.088 14.4793 11.6627 16.0547 11.6627 18L11.6627 21H5.71469L5.71469 14.4793H8.00269ZM8.00269 5C12.3173 5 15.952 8.30933 16.2293 12.5653C15.6587 12.3947 15.0613 12.3093 14.4427 12.3093H13.6747C13.0667 8.784 9.99469 6.224 6.28269 6.224V11.224H2.496V5H8.00269Z"/></svg>
                            <p className="text-xs text-neutral-300 italic text-center pl-2">
                                "Best Aphelios I have ever seen"
                            </p>
                            <p className="text-[10px] text-neutral-500 text-center mt-2 font-semibold uppercase tracking-wider">
                                — ADCs in Silver Probably
                            </p>
                        </div>
                    </div>
                </div>
            </BlurFade>

            {/* SECONDARY CHAMPIONS GRID */}
            <BlurFade delay={0.15}>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4 ml-2">Also Main</h3>
                <div className="grid grid-cols-2 gap-4">
                    
                    {/* JAX CARD */}
                    <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 group">
                        <div className="aspect-[4/5] relative">
                            <img src="/jax.jpg" alt="Jax" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                            <div className="absolute bottom-3 left-3">
                                <p className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider">Top</p>
                                <p className="text-lg font-bold text-white">Jax</p>
                            </div>
                        </div>
                    </div>

                    {/* KAISA CARD */}
                    <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 group">
                        <div className="aspect-[4/5] relative">
                            <img src="/kaisa.jpg" alt="Kaisa" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                            <div className="absolute bottom-3 left-3">
                                <p className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">adc</p>
                                <p className="text-lg font-bold text-white">Kai'Sa</p>
                            </div>
                        </div>
                    </div>

                </div>
            </BlurFade>

        </div>
      </section>
    </div>
  );
}

export default ShootingStarsPageMobile;
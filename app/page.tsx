"use client";
import React, { useState, useEffect } from "react";
// Importing the separated default exports
import ShootingStarsPageDesktop from "./desktop";
import ShootingStarsPageMobile from "./mobileveiw";

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
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import {Github, Twitter} from "lucide-react"

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(footerRef.current, { opacity: 0, y: 40, duration: 0.75, ease: "power3.out" });
  }, []);

  return (
    <footer ref={footerRef} className=" bg-gradient-to-br from-black via-gray-950 to-zinc-950 border-t border-gray-900 ">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6 md:flex-row md:justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-300 tracking-tight">Sketch.<span className="text-gray-300">ai</span></span>
        </div>
        <div className="flex gap-4 flex-wrap items-center">
          <a href="/" className="text-gray-400 hover:text-zinc-600 transition">Home</a>
          <a href="/features" className="text-gray-400 hover:text-zinc-600 transition">Features</a>
          <a href="/docs" className="text-gray-400 hover:text-zinc-600 transition">Docs</a>
          <a href="/contact" className="text-gray-400 hover:text-zinc-600 transition">Contact</a>
        </div>
        <div className="flex gap-4 items-center">
          <a href="https://x.com/Rohanvrnkr?t=vlHdD6F4lOaCW8BbzWE5zA&s=09" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-zinc-400 transition"><Twitter /></a>
          <a href="https://github.com/Rohanvernekarr" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-zinc-400 transition"><Github /></a>
        </div>
      </div>
      <div className="text-center pb-5 text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Sketch.ai. All rights reserved.
      </div>
    </footer>
  );
};

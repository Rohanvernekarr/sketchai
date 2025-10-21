import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link";

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.from(footerRef.current, { opacity: 0, y: 40, duration: 0.75, ease: "power3.out" });
  }, []);

  return (
    <footer ref={footerRef} className="  border-t border-gray-900 ">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6 md:flex-row md:justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-300 tracking-tight">Sketch.<span className="text-gray-300">ai</span></span>
        </div>
        <div className="flex gap-4 flex-wrap items-center">
          <Link href="/" className="text-gray-400 hover:text-zinc-600 transition">Home</Link>
          <Link href="/features" className="text-gray-400 hover:text-zinc-600 transition">Features</Link>
          <Link href="/docs" className="text-gray-400 hover:text-zinc-600 transition">Docs</Link>
          <Link href="/contact" className="text-gray-400 hover:text-zinc-600 transition">Contact</Link>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="https://x.com/Rohanvrnkr?t=vlHdD6F4lOaCW8BbzWE5zA&s=09" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-zinc-400 transition">
            <svg
            className=" w-5 h-5 inline-block"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
          </svg>
        </Link>

          <Link href="https://github.com/Rohanvernekarr" aria-label="GitHub" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-zinc-400 transition"><Github /></Link>
          <Link href="https://www.linkedin.com/in/rohan-vernekar-b57913283/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-zinc-400 transition"><Linkedin /></Link>

        </div>
      </div>
      <div className="text-center pb-5 text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} SketchAi. All rights reserved.
      </div>
    </footer>
  );
};

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export const Navbar: React.FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navRef.current) {
      gsap.from(navRef.current, { y: -60, opacity: 0, duration: 0.95, ease: "power3.out" });
    }
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.to(menuRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });
      } else {
        gsap.to(menuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    }
  }, [isMenuOpen]);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 w-full px-8 py-6 mx-auto max-w-7xl flex justify-between items-center">
      <div className="flex items-center ">
        <span className="w-3 h-5 bg-blue-400 rounded-sm mr-1 inline-block"></span>
        <span className="w-3 h-5 bg-red-700 rounded-sm mr-1 inline-block"></span>
        <span className="w-3 h-5 bg-gray-300 rounded-sm mr-2 inline-block"></span>
        <span className="text-3xl font-bold tracking-tight">Sketch.ai</span>
      </div>

     
      <div className="hidden md:flex gap-8 font-sans text-gray-200 items-center">
        <a className="hover:text-gray-300 transition" href="/">Product</a>
        <a className="hover:text-gray-300 transition" href="/">Solutions</a>
        <a className="hover:text-gray-300 transition" href="/">Resources</a>
        <a className="hover:text-gray-300 transition" href="/">Pricing</a>
        <a href="/dashboard" className="px-8 py-2 rounded text-black bg-zinc-200 hover:bg-zinc-300 transition font-semibold">
          Login
        </a>
      </div>

     
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden flex flex-col gap-1 p-2 hover:bg-zinc-950 rounded transition-colors"
        aria-label="Toggle menu"
      >
        <span className="w-6.5 h-1 bg-zinc-400 rounded-full"></span>
        <span className="w-6.5 h-1 bg-zinc-400 rounded-full"></span>
        <span className="w-6.5 h-1 bg-zinc-400 rounded-full"></span>
      </button>

    
      <div
        ref={menuRef}
        className="md:hidden absolute flex flex-col justify-center top-full right-0 w-70 bg-transparent backdrop-blur-sm overflow-hidden opacity-0 h-0"
      >
        <div className="flex flex-col gap-4 p-8 font-sans text-gray-200">
          <a className="hover:text-gray-300 transition" href="/" onClick={() => setIsMenuOpen(false)}>
            Product
          </a>
          <a className="hover:text-gray-300 transition" href="/" onClick={() => setIsMenuOpen(false)}>
            Solutions
          </a>
          <a className="hover:text-gray-300 transition" href="/" onClick={() => setIsMenuOpen(false)}>
            Resources
          </a>
          <a className="hover:text-gray-300 transition" href="/" onClick={() => setIsMenuOpen(false)}>
            Pricing
          </a>
          <a
            href="/dashboard"
            className="px-6 py-2 rounded text-black bg-zinc-200 hover:bg-zinc-300 transition font-semibold text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
};

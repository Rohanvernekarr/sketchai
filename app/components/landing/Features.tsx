"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import systemImg1 from "@/public/system.png";
import systemImg2 from "@/public/system2.png";
import systemImg3 from "@/public/system3.png";

const textPositions = [
  { top: "-6%", left: "45%" },
  { top: "60%", left: "10%" },
  { top: "71%", left: "75%" },
  { top: "-16%", left: "5%" },
  { top: "-18%", left: "78%" },
  { top: "78%", left: "38%" },
];

export const Features = () => {
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bubblesRef = useRef<HTMLDivElement[]>([]);

  
    useEffect(() => {
     
      const tl = gsap.timeline();

      bubblesRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          y: i % 2 === 0 ? "+=32" : "-=38",
          x: i % 2 === 0 ? "+=25" : "-=30",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 5 + Math.random() * 2, // slight random speed for natural look
          delay: i * 1.2
        });
      });
    }, []);

  useEffect(() => {
    gsap.from(imagesRef.current, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.15
    });
    gsap.from(textRefs.current, {
      y: 25,
      opacity: 0,
      scale: 0.88,
      duration: 0.7,
      stagger: 0.16,
      delay: 0.7
    });
  }, []);

  const features = [
    {
      img: systemImg1.src,
      label: "Workspace"
    },
    {
      img: systemImg2.src,
      label: "Stack Diagrams"
    },
    {
      img: systemImg3.src,
      label: "Interactive AI Generation"
    }
  ];

  const featureTexts = [
    "Design in a beautiful, Mac-style layout. Drag, zoom, edit.",
    "Layer diagrams like a design board. Compare and export.",
    "Edit nodes live and see updates instantly.",
    "Export diagrams to PNG, SVG with one click.",
    "Collaborate in real time share, comment, iterate instantly.",
    "Organize versions and revisions for easy project management.",
  ];

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0">

        {[
          { className: "left-8 top-8 w-100 h-100", bg: "from-zinc-800/50 to-zinc-800/30", blur: "blur-2xl" },
          { className: "right-20 bottom-10 w-58 h-58", bg: "from-zinc-600/40 to-zinc-600/20", blur: "blur-3xl" },
          { className: "left-1/3 top-1/4 w-58 h-58", bg: "from-zinc-300/50 to-zinc-700/10", blur: "blur-2xl" },
          { className: "right-70 top-28 w-58 h-58", bg: "from-zinc-400/50 to-zinc-700/10", blur: "blur-3xl" },
          { className: "left-120 top-138 w-58 h-58", bg: "from-zinc-400/50 to-zinc-700/10", blur: "blur-3xl" },

        ].map((b, i) => (
          <div
            ref={el => { bubblesRef.current[i] = el!; }}
            key={i}
            className={`absolute z-0 ${b.className} rounded-full bg-gradient-to-br ${b.bg} ${b.blur} opacity-40`}
          />
        ))}
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-200 tracking-tight mb-10 text-center">
        Why <span className="text-blue-400">Sketch.AI</span>?
      </h2>
      <p className="text-xl text-zinc-400 text-center mb-16">
        The fastest way to visualize your system designs
      </p>
      
      {/*Large screens */}
      <div className="hidden md:block relative w-full max-w-7xl h-[600px] flex items-center justify-center">
        {features.map((feat, i) => (
          <div
            key={i}
            ref={el => { imagesRef.current[i] = el; }}
            className={`
              absolute shadow-2xl rounded-2xl border-2 border-zinc-200 overflow-hidden
              cursor-pointer 
              ${i === 0 ? "z-10 left-[7%] top-[6%] md:left-[5%] md:top-[0%] w-[510px] h-[320px]" : ""}
              ${i === 1 ? "z-20 left-[28%] top-[18%] md:left-[35%] md:top-[19%] w-[490px] h-[320px]" : ""}
              ${i === 2 ? "z-30 left-[58%] top-[5%] md:left-[60%] md:top-[10%] w-[460px] h-[320px]" : ""}
            `}
            style={{
              boxShadow: "0 14px 32px rgba(64,144,255,0.13)"
            }}
            onMouseEnter={e => gsap.to(e.currentTarget, { y: -14, scale: 1.03, duration: 0.32 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.3 })}
          >
            
            <div className="flex items-center px-4 py-[7px] bg-gradient-to-r from-zinc-700 to-zinc-900 rounded-t-2xl">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5" />
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5" />
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2.5" />
              <span className="text-xs text-zinc-200 font-semibold">{feat.label}</span>
            </div>
            <img
              src={feat.img}
              alt={feat.label}
              className="w-full h-[285px] object-cover rounded-b-2xl"
              draggable={false}
            />
          </div>
        ))}
        
        {featureTexts.map((txt, i) => (
          <div
            key={i}
            ref={el => { textRefs.current[i] = el; }}
            className="absolute font-sans text-lg text-zinc-200 bg-transparent px-5 py-3 rounded-2xl shadow-md"
            style={{
              ...textPositions[i],
              maxWidth: "270px",
              zIndex: 99
            }}
          >
            {txt}
          </div>
        ))}
      </div>

      
      <div className="flex flex-col md:hidden items-center w-full gap-10">
        {features.map((feat, i) => (
          <div
            key={i}
            className="w-full max-w-[340px] mx-auto shadow-2xl rounded-2xl border-2 border-zinc-300 overflow-hidden "
          >
            <div className="flex items-center px-4 py-[7px] bg-gradient-to-r from-zinc-700 to-zinc-900 rounded-t-2xl">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5" />
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5" />
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2.5" />
              <span className="text-xs text-zinc-200 font-semibold">{feat.label}</span>
            </div>
            <img
              src={feat.img}
              alt={feat.label}
              className="w-full h-[200px] object-cover rounded-b-2xl"
              draggable={false}
            />
          </div>
        ))}
        <div className="flex flex-col gap-5 mt-5 w-full items-center">
          {featureTexts.map((txt, i) => (
            <div
              key={i}
              className="font-sans text-sans text-zinc-300 px-4 py-3  shadow"
              style={{ maxWidth: "320px", textAlign: "center" }}
            >
              {txt}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

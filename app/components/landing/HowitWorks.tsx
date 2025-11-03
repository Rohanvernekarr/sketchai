"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export const HowItWorks = () => {
  const macRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ];
  const [active, setActive] = useState<number | null>(null); // 0 or 1
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
        duration: 5 + Math.random() * 2,
        delay: i * 1.2,
      });
    });
  }, []);

  const videos = [
    { src: "/video.mp4", title: "Sketch.AI: Whiteboard Demo" },
    { src: "/video1.mp4", title: "Sketch.AI: AI Generation" },
  ];

  const handleSetActive = (i: number) => setActive(i);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        {[
          {
            className: "left-8 top-8 w-100 h-100",
            bg: "from-zinc-800/50 to-zinc-800/30",
            blur: "blur-3xl",
          },
          {
            className: "right-20 bottom-10 w-58 h-58",
            bg: "from-zinc-600/40 to-zinc-600/20",
            blur: "blur-3xl",
          },
          {
            className: "left-1/3 top-1/4 w-58 h-58",
            bg: "from-zinc-500/50 to-zinc-700/10",
            blur: "blur-2xl",
          },
          {
            className: "right-70 top-28 w-58 h-58",
            bg: "from-zinc-600/50 to-zinc-700/10",
            blur: "blur-3xl",
          },
          {
            className: "left-120 top-138 w-58 h-58",
            bg: "from-zinc-600/50 to-zinc-700/10",
            blur: "blur-3xl",
          },
        ].map((b, i) => (
          <div
            ref={(el) => {
              bubblesRef.current[i] = el!;
            }}
            key={i}
            className={`absolute z-0 ${b.className} rounded-full bg-gradient-to-br ${b.bg} ${b.blur} opacity-40`}
          />
        ))}
      </div>
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          How It<span className="text-blue-400"> Works</span>?
        </h2>
        <p className="text-lg md:text-xl text-zinc-400 font-normal mx-auto max-w-2xl px-4 ">
          Experience a lightning-fast workflow. Draw freehand, use clean shapes,
          or describe your system to generate it instantly with AI—then export
          and share!
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 w-[340px] bg-b md:w-full max-w-6xl mx-auto items-center relative mt-5 z-10">
        {videos.map((vid, idx) => (
          <div
            key={idx}
            ref={macRefs[idx]}
            className={`
              flex-1 min-w-[340px] max-w-full
              transition-all duration-300
              rounded-2xl border-2 border-zinc-400 shadow-2xl bg-black px-0 pb-3 flex flex-col items-center
              relative cursor-pointer
              ${active === idx ? "z-30 scale-105 shadow-[0_18px_36px_#3b82f6aa]" : "z-20 hover:z-30"}
              ${active !== null && active !== idx ? "opacity-60 blur-[1px]" : "opacity-100"}
            `}
            style={{
              boxShadow: "0 14px 32px rgba(64,144,255,0.13)",
            }}
            onMouseEnter={() => setActive(idx)}
            onMouseLeave={() => setActive(null)}
            onTouchStart={() => handleSetActive(idx)}
          >
            <div className="w-full flex items-center px-4 py-[10px] bg-gradient-to-r from-zinc-700 to-zinc-900 rounded-t-2xl select-none">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-1.5" />
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1.5" />
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2.5" />
              <span className="text-xs text-zinc-200 font-semibold tracking-wide">
                {vid.title}
              </span>
            </div>
            <div className="w-full flex items-center justify-center bg-black aspect-video min-h-[190px] ">
              <video
                src={vid.src}
                autoPlay
                loop
                muted
                playsInline
                controls={false}
                className="
                  w-full h-full
                  object-contain
                  rounded-b-2xl
                  max-h-[600px]
                  md:max-h-[340px]
                  rounded-2xl
                  outline-none
                  transition-all
                "
                style={{ background: "#111" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

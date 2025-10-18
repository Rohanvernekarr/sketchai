import React, { useRef, useEffect } from "react";
import gsap from "gsap";


export const Hero: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const subHeadRef = useRef<HTMLParagraphElement>(null);
  const bubblesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Hero entrance animations
    const tl = gsap.timeline();

    tl.from(headlineRef.current, { y: 70, opacity: 0, duration: 0.9, ease: "power4.out" });
    tl.from(underlineRef.current, { scaleX: 0, opacity: 0, transformOrigin: "left", duration: 0.7, ease: "back.out(2)" }, "-=0.5");
    tl.from(subHeadRef.current, { y: 35, opacity: 0, duration: 0.6 }, "-=0.6");


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

  const ExampleDiagram = () => (
    <svg width="130" height="80" viewBox="0 0 130 80" fill="none">
      <rect x="0" y="20" width="60" height="40" rx="8" fill="#6366f1" opacity="0.14" />
      <rect x="70" y="12" width="50" height="56" rx="12" fill="#7dd3fc" opacity="0.14" />
      <circle cx="32" cy="62" r="11" fill="#f472b6" opacity="0.23" />
      <path d="M60 40h10" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  const CloudDiagram = () => (
    <svg width="120" height="70" viewBox="0 0 120 70" fill="none">
      <ellipse cx="60" cy="40" rx="38" ry="22" fill="url(#cloudGradient)" opacity="0.15" />
      <ellipse cx="40" cy="25" rx="12" ry="9" fill="url(#cloudGradient)" opacity="0.28" />
      <ellipse cx="80" cy="23" rx="16" ry="11" fill="#90cdf4" opacity="0.26" />
      <defs>
        <linearGradient id="cloudGradient" x1="10" y1="10" x2="110" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
    </svg>
  );
  const ServerDiagram = () => (
    <svg width="100" height="100" viewBox="0 0 100 90" fill="none">
      <rect x="12" y="18" width="76" height="23" rx="7" fill="url(#serverGradient1)" opacity="0.24" />
      <rect x="12" y="45" width="76" height="23" rx="7" fill="url(#serverGradient2)" opacity="0.14" />
      <rect x="12" y="72" width="76" height="23" rx="7" fill="url(#serverGradient3)" opacity="0.24" />
      <circle cx="87" cy="29" r="3" fill="#facc15" />
      <circle cx="87" cy="57" r="3" fill="#34d399" />
      <circle cx="87" cy="84" r="3" fill="#FF0054" />
      <defs>
        <linearGradient id="serverGradient1" x1="12" y1="20" x2="88" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="serverGradient2" x1="12" y1="45" x2="88" y2="67" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06b6d4" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="serverGradient3" x1="12" y1="65" x2="88" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF0054" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
  const ApiDiagram1 = () => (
    <svg width="220" height="80" viewBox="0 0 120 60" fill="none">
      <rect x="15" y="16" width="34" height="28" rx="8" fill="url(#apiGradient)" opacity="0.1" />
      <rect x="71" y="16" width="44" height="28" rx="8" fill="url(#apiGradient)" opacity="0.1" />
      <path d="M49 30 H71" stroke="#6366f1" strokeWidth="3" strokeDasharray="6 4" opacity="0.1" />
      <text x="22" y="35" fontSize="12" fill="#fff" opacity="0.5">API</text>
      <text x="78" y="35" fontSize="12" fill="#fff" opacity="0.5">Client</text>
      <defs>
        <linearGradient id="apiGradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );
  const ApiDiagram2 = () => (
    <svg width="220" height="80" viewBox="0 0 120 60" fill="none">
      <rect x="15" y="16" width="44" height="28" rx="8" fill="url(#apiGradient)" opacity="0.1" />
      <rect x="71" y="16" width="44" height="28" rx="8" fill="url(#apiGradient)" opacity="0.1" />
      <path d="M49 30 H71" stroke="#6366f1" strokeWidth="3" strokeDasharray="6 4" opacity="0.1" />
      <text x="22" y="35" fontSize="12" fill="#fff" opacity="0.5">Server</text>
      <text x="78" y="35" fontSize="12" fill="#fff" opacity="0.5">Client</text>
      <defs>
        <linearGradient id="apiGradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  );



  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">

        {[
          { className: "left-8 top-8 w-100 h-100", bg: "from-zinc-500/50 to-zinc-800/30", blur: "blur-2xl" },
          { className: "right-20 bottom-10 w-58 h-58", bg: "from-zinc-400/40 to-zinc-600/20", blur: "blur-3xl" },
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

      <div className="
  absolute z-20
  left-[14%] top-[18%]
  sm:left-[24%] sm:top-[32%]
  md:left-[36%] md:top-[25%]
  lg:left-[14%] lg:top-[22%]
">
        <ExampleDiagram />
      </div>


      <div className="
  absolute z-20
  right-[10%] top-[37%]
  sm:right-[8%] sm:top-[30%]
  md:right-[20%] md:top-[24%]
  lg:right-[12%] lg:top-[44%]
">
        <ExampleDiagram />
      </div>


      <div className="
  absolute z-20
  right-[14%] top-[12%]
  sm:right-[32%] sm:top-[18%]
  md:right-[18%] md:top-[25%]
  lg:right-[28%] lg:top-[18%]
">
        <CloudDiagram />
      </div>


      <div className="
  absolute z-20
  left-[12%] top-[75%]
  sm:left-[38%] sm:top-[42%]
  md:left-[28%] md:top-[49%]
  lg:left-[25%] lg:top-[62%]
">
        <ServerDiagram />
      </div>

      <div className="
  absolute z-20
  right-[4%] top-[68%]
  sm:right-[18%] sm:top-[64%]
  md:right-[11%] md:top-[66%]
  lg:right-[15%] lg:top-[76%]
">
        <ApiDiagram1 />
      </div>

      <div className="
  absolute z-20
  left-[52%] top-[78%]
  sm:left-[45%] sm:top-[74%]
  md:left-[42%] md:top-[72%]
  lg:left-[50%] lg:top-[74%]
">
        <ExampleDiagram />
      </div>


      <div className="
  absolute z-20
  right-[48%] top-[2%]
  sm:right-[55%] sm:top-[9%]
  md:right-[57%] md:top-[13%]
  lg:right-[54%] lg:top-[12%]
">
        <ApiDiagram2 />
      </div>


      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 text-white relative"
        >
          <span className="text-blue-400">AI</span> for System Design <br />
          <span className="block text-slate-100 relative z-10">
            and Architecture
            <span
              ref={underlineRef}
              className="block mx-auto mt-2 w-36 h-2 bg-gradient-to-r from-blue-400 via-blue-300 to-fuchsia-400 rounded-full filter blur-[2px] opacity-60"
            />
          </span>
        </h1>
        <p
          ref={subHeadRef}
          className="text-xl md:text-2xl text-blue-200 font-medium mb-8"
        >
          <span className="bg-gradient-to-r from-blue-500 via-teal-500 to-violet-500 text-transparent bg-clip-text">
            Generate diagrams and design faster.
          </span>
        </p>
        <button
          className="px-8 py-3 text-lg font-bold rounded-2xl bg-zinc-900/75 hover:bg-blue-900 shadow-xl text-white border border-blue-400 hover:border-blue-500 transition backdrop-blur-md"
        >
          Try Sketch.AI &rarr;
        </button>

      </div>
    </section>
  );
};

"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for testing and exploring",
    features: [
      "5 sketches per month",
      "Basic AI generation",
      "Export to PNG",
      "Community support",
      "Single workspace",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$4",
    period: "/month",
    description: "Unlimited creativity for individuals",
    features: [
      "Unlimited sketches",
      "Advanced AI generation",
      "Export to PNG, SVG, PDF",
      "Priority support",
      "Multiple workspaces",
      "Version history",
    ],
    cta: "Start Creating",
    popular: true,
  },
  {
    name: "Business",
    price: "$10",
    period: "/month",
    description: "Built for teams and collaboration",
    features: [
      "Everything in Pro",
      "Real-time collaboration",
      "Team management",
      "Shared workspaces",
      "Comment & iterate",
    ],
    cta: "Start Collaborating",
    popular: false,
  },
];

export const Pricing = () => {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const bubblesRef = useRef<HTMLDivElement[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate bubbles
    bubblesRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: i % 2 === 0 ? "+=40" : "-=45",
        x: i % 2 === 0 ? "+=30" : "-=35",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 6 + Math.random() * 2,
        delay: i * 1.3,
      });
    });

    // Animate header
    if (headerRef.current) {
      gsap.from(headerRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center overflow-hidden py-20 px-4">
      <div className="pointer-events-none absolute inset-0 z-0">
        {[
          {
            className: "left-10 top-20 w-96 h-96",
            bg: "from-zinc-800/50 to-zinc-800/30",
            blur: "blur-3xl",
          },
          {
            className: "right-16 bottom-16 w-80 h-80",
            bg: "from-zinc-600/40 to-zinc-600/20",
            blur: "blur-3xl",
          },
          {
            className: "left-1/3 top-1/3 w-72 h-72",
            bg: "from-zinc-500/30 to-zinc-700/20",
            blur: "blur-3xl",
          },
          {
            className: "right-1/4 top-20 w-64 h-64",
            bg: "from-zinc-500/40 to-zinc-700/10",
            blur: "blur-2xl",
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

      <div ref={headerRef} className="relative z-10 text-center mb-24">
        <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-200 tracking-tight mb-4">
          Simple, <span className="text-zinc-200">Transp</span>
          <span className="text-blue-400">arent Pricing</span>
        </h2>
        <p className="text-xl text-zinc-400">
          Choose the plan that fits your workflow
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full px-4 ">
        {pricingPlans.map((plan, i) => (
          <div
            key={i}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className={`
              relative rounded-2xl border-[2px] overflow-hidden
              transition-all duration-300
              ${
                plan.popular
                  ? "border-white scale-105 md:scale-110 shadow-2xl "
                  : "border-white hover:border-zinc-300"
              }
            `}
            onMouseEnter={(e) => {
              if (!plan.popular) {
                gsap.to(e.currentTarget, { y: -8, scale: 1.02, duration: 0.3 });
              }
            }}
            onMouseLeave={(e) => {
              if (!plan.popular) {
                gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.3 });
              }
            }}
          >
            <div className={` p-8`}>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">
                {plan.name}
              </h3>
              <p className="text-sm text-zinc-300 mb-6">{plan.description}</p>

              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold text-white">
                  {plan.price}
                </span>
                <span className="text-lg text-zinc-300 ml-2">
                  {plan.period}
                </span>
              </div>

              <button
                className={`
                  w-full py-3 px-6 rounded-xl font-semibold
                  transition-all duration-300
                  ${
                    plan.popular
                      ? "bg-white text-zinc-900 hover:bg-zinc-100 hover:scale-105"
                      : "bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-700"
                  }
                `}
              >
                {plan.cta}
              </button>
            </div>

            <div className=" p-8  border-white w-full">
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`
                      mt-0.5 rounded-full p-1
                      ${plan.popular ? "bg-green-500/20" : "bg-green-500/20"}
                    `}
                    >
                      <Check
                        size={14}
                        className={
                          plan.popular ? "text-green-400" : "text-green-400"
                        }
                      />
                    </div>
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="relative  text-center mt-16">
        <p className="text-zinc-400 text-sm">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
};

"use client";

import {
  Database,
  Cloud,
  GitBranch,
  Network,
  Code2,
  Container,
  Workflow,
  Binary,
  ServerCog,
  Boxes,
  Activity,
  Layers,
  Terminal,
  PackageSearch,
  FileJson,
  Webhook,
} from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";

export const UseCases = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    bubblesRef.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: i % 2 === 0 ? "+=32" : "-=38",
        x: i % 2 === 0 ? "+=25" : "-=30",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        duration: 5 + Math.random() * 2, // slight random speed for natural look
        delay: i * 1.2,
      });
    });
  }, []);

  const cases = [
    {
      icon: Network,
      title: "System Architecture",
      description: "Design scalable and robust system architectures",
      features: [
        { icon: Container, text: "Microservices" },
        { icon: Activity, text: "Event-driven" },
        { icon: Boxes, text: "Distributed Systems" },
        { icon: ServerCog, text: "Load Balancing" },
      ],
    },
    {
      icon: Database,
      title: "Database Design",
      description: "Create optimized database schemas and relationships",
      features: [
        { icon: Layers, text: "ER Diagrams" },
        { icon: Binary, text: "Schema Design" },
        { icon: Workflow, text: "Relationships" },
        { icon: PackageSearch, text: "Indexing" },
      ],
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure",
      description: "Build and deploy cloud-native applications",
      features: [
        { icon: ServerCog, text: "AWS Services" },
        { icon: Container, text: "Azure Solutions" },
        { icon: Boxes, text: "GCP Platform" },
        { icon: Activity, text: "Auto Scaling" },
      ],
    },
    {
      icon: GitBranch,
      title: "API Workflows",
      description: "Design seamless API integrations and workflows",
      features: [
        { icon: Code2, text: "REST APIs" },
        { icon: Terminal, text: "GraphQL" },
        { icon: Webhook, text: "Webhooks" },
        { icon: FileJson, text: "OpenAPI" },
      ],
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: "power3.out",
      });

      // Cards stagger animation
      gsap.from(cardsRef.current, {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        delay: 0.3,
      });

      //hover animations
      cardsRef.current.forEach((card) => {
        if (!card) return;

        const icon = card.querySelector(".main-icon");
        const featureIcons = card.querySelectorAll(".feature-icon");
        const featureTexts = card.querySelectorAll(".feature-text");
        const description = card.querySelector(".card-description");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -4,
            scale: 1.02,
            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(icon, {
            scale: 1.0,
            rotation: 360,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.5)",
          });
          gsap.to(description, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(featureIcons, {
            scale: 1.15,
            rotation: 360,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          });

          gsap.to(featureTexts, {
            x: 8,
            color: "#ffffff",
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(icon, {
            rotation: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          });

          gsap.to(description, {
            opacity: 0.7,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(featureIcons, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          });

          gsap.to(featureTexts, {
            x: 0,
            color: "#a1a1aa",
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 px-4">
      {/*<div className="pointer-events-none absolute inset-0 z-0">
        {[
          {
            className: "left-8 top-8 w-100 h-100",
            bg: "from-zinc-800/50 to-zinc-800/30",
            blur: "blur-2xl",
          },
          {
            className: "right-20 bottom-10 w-58 h-58",
            bg: "from-zinc-700/40 to-zinc-600/20",
            blur: "blur-3xl",
          },
          {
            className: "left-1/3 top-1/4 w-58 h-58",
            bg: "from-zinc-8  00/50 to-zinc-700/10",
            blur: "blur-2xl",
          },
          {
            className: "right-70 top-28 w-58 h-58",
            bg: "from-zinc-700/50 to-zinc-700/10",
            blur: "blur-3xl",
          },
          {
            className: "left-120 top-138 w-58 h-58",
            bg: "from-zinc-700/50 to-zinc-700/10",
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
      </div>*/}

      <div className="max-w-7xl mx-auto">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-200 tracking-tight mb-4">
            Built <span className="text-zinc-200">For Every</span>
            <span className="text-blue-400"> Usecase</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            From databases to cloud infrastructure, create professional diagrams
            for any technical scenario
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map((useCase, index) => (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative p-8 border-3 border-zinc-400 hover:border-zinc-300 mx-auto w-86 md:w-full rounded-2xl cursor-pointer transition-colors duration-300"
            >
              <div className="main-icon mb-4 mr-0">
                <div className="inline-flex p-4 rounded-xl border border-zinc-400">
                  <useCase.icon className="w-10 h-10 text-zinc-300 group-hover:text-zinc-200 transition-colors" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {useCase.title}
              </h3>
              <p className="card-description text-zinc-300 mb-6 opacity-70">
                {useCase.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {useCase.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg border border-zinc-500 hover:border-zinc-400 transition-colors"
                  >
                    <feature.icon className="feature-icon w-5 h-5 text-zinc-500 flex-shrink-0" />
                    <span className="feature-text text-xs md:text-sm font-medium text-zinc-400">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-zinc-800/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

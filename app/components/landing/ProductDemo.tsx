"use client";

import { useState } from "react";

export const ProductDemo = () => {
  const [prompt, setPrompt] = useState(
    "Design a microservices architecture with API gateway, authentication service, and database",
  );
  const [showDiagram, setShowDiagram] = useState(false);

  const DemoSVGDiagram = (
    <div className="w-full h-auto flex justify-center items-center">
      <svg
        viewBox="0 0 760 300"
        preserveAspectRatio="xMidYMid meet"
        className="w-full max-w-4xl h-auto"
      >
        {/* User */}
        <g>
          <circle
            cx="80"
            cy="140"
            r="25"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <text x="65" y="185" fill="white" fontSize="16">
            User
          </text>
        </g>

        {/* Frontend */}
        <g>
          <rect
            x="180"
            y="100"
            width="150"
            height="80"
            rx="10"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <text x="205" y="145" fill="white" fontSize="16">
            React Frontend
          </text>
        </g>

        {/* Backend */}
        <g>
          <rect
            x="380"
            y="100"
            width="160"
            height="80"
            rx="10"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <text x="405" y="145" fill="white" fontSize="16">
            API Server
          </text>
        </g>

        {/* Database */}
        <g>
          <rect
            x="598"
            y="100"
            width="160"
            height="80"
            rx="10"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <text x="645" y="145" fill="white" fontSize="14">
            Database
          </text>
        </g>

        {/* arrows */}
        <defs>
          <marker
            id="arrow-white"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 6 3, 0 6" fill="white" />
          </marker>
        </defs>

        {/* Lines */}
        <line
          x1="105"
          y1="140"
          x2="180"
          y2="140"
          stroke="white"
          strokeWidth="2"
          markerEnd="url(#arrow-white)"
        />
        <line
          x1="330"
          y1="140"
          x2="380"
          y2="140"
          stroke="white"
          strokeWidth="2"
          markerEnd="url(#arrow-white)"
        />
        <line
          x1="540"
          y1="140"
          x2="595"
          y2="140"
          stroke="white"
          strokeWidth="2"
          markerEnd="url(#arrow-white)"
        />
      </svg>
    </div>
  );

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-200 tracking-tight mb-4">
            See <span className="text-zinc-200">It In</span>
            <span className="text-blue-400"> Action</span>
          </h2>
          <p className="text-xl text-gray-400">
            Type a description and watch the magic happen
          </p>
        </div>

        <div className="rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Describe your system design:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 px-4 py-3 border border-zinc-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              placeholder="e.g., Create a REST API with PostgreSQL database and Redis cache..."
            />
            <button
              className="mt-4 px-6 py-3 border border-zinc-300 text-white font-bold rounded-lg transition-all"
              onClick={() => setShowDiagram(true)}
            >
              Continue →
            </button>
          </div>

          <div className="border border-zinc-500 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
            {showDiagram ? (
              <div>{DemoSVGDiagram}</div>
            ) : (
              <div className="text-center text-gray-500">
                <p className="text-lg">Generated diagram would appear here</p>
                <p className="text-sm mt-2">
                  (Add your diagram visualization component)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

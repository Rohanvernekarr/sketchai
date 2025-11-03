"use client";

import { useState } from "react";

// You can import the sample image directly if stored locally or use a demo SVG
// import SampleDiagram from "./sample-diagram.jpg";

export const ProductDemo = () => {
  const [prompt, setPrompt] = useState(
    "Design a microservices architecture with API gateway, authentication service, and database",
  );
  const [showDiagram, setShowDiagram] = useState(false);

  const DemoSVGDiagram = (
    <svg width="680" height="380">
      <g>
        <circle
          cx="80"
          cy="80"
          r="18"
          stroke="#a1a1aa"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="80"
          y1="98"
          x2="80"
          y2="130"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="110"
          x2="65"
          y2="125"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="110"
          x2="95"
          y2="125"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="130"
          x2="65"
          y2="155"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="130"
          x2="95"
          y2="155"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <text x="50" y="170" fill="#a1a1aa" fontSize="15">
          Student
        </text>
      </g>
      {/* Instructor */}
      <g>
        <circle
          cx="80"
          cy="250"
          r="18"
          stroke="#a1a1aa"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="80"
          y1="268"
          x2="80"
          y2="300"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="280"
          x2="65"
          y2="295"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="280"
          x2="95"
          y2="295"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="300"
          x2="65"
          y2="325"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="300"
          x2="95"
          y2="325"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <text x="45" y="340" fill="#a1a1aa" fontSize="15">
          Instructor
        </text>
      </g>

      {/* Video Streaming Service (rounded dashed box) */}
      <g>
        <rect
          x="270"
          y="30"
          width="150"
          height="55"
          rx="20"
          stroke="#a1a1aa"
          strokeWidth="2"
          fill="none"
          strokeDasharray="6,6"
        />
        <ellipse
          cx="345"
          cy="56"
          rx="23"
          ry="20"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <ellipse
          cx="325"
          cy="60"
          rx="13"
          ry="12"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <ellipse
          cx="370"
          cy="52"
          rx="13"
          ry="12"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <text x="285" y="84" fill="#a1a1aa" fontSize="14">
          Video Streaming Service
        </text>
      </g>

      {/* Web Application Server */}
      <g>
        <rect
          x="268"
          y="135"
          width="180"
          height="60"
          rx="8"
          fill="#151516"
          stroke="#64748b"
          strokeWidth="2"
        />
        <text x="285" y="170" fill="#7dd3fc" fontSize="18" fontWeight="bold">
          Web Application Server
        </text>
      </g>

      {/* Databases */}
      {/* Course Database */}
      <g>
        <ellipse
          cx="545"
          cy="130"
          rx="65"
          ry="20"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <rect
          x="480"
          y="130"
          width="130"
          height="55"
          rx="18"
          fill="#232323"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <ellipse
          cx="545"
          cy="185"
          rx="65"
          ry="20"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <text x="500" y="163" fill="#e0e0e0" fontSize="16">
          Course Database
        </text>
      </g>
      {/* User Database */}
      <g>
        <ellipse
          cx="545"
          cy="260"
          rx="65"
          ry="20"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <rect
          x="480"
          y="260"
          width="130"
          height="55"
          rx="18"
          fill="#232323"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <ellipse
          cx="545"
          cy="315"
          rx="65"
          ry="20"
          fill="none"
          stroke="#a1a1aa"
          strokeWidth="2"
        />
        <text x="515" y="292" fill="#e0e0e0" fontSize="16">
          User Database
        </text>
      </g>

      {/* Connecting lines */}
      {/* Student-Instructor to App Server */}
      <line
        x1="100"
        y1="120"
        x2="268"
        y2="165"
        stroke="#7dd3fc"
        strokeWidth="2"
      />
      <line
        x1="100"
        y1="260"
        x2="268"
        y2="165"
        stroke="#f472b6"
        strokeWidth="2"
      />
      {/* Student to Video Service */}
      <line x1="98" y1="90" x2="270" y2="60" stroke="#a1a1aa" strokeWidth="2" />
      {/* App Server to Databases */}
      <line
        x1="448"
        y1="165"
        x2="480"
        y2="157"
        stroke="#a1a1aa"
        strokeWidth="2"
      />
      <line
        x1="448"
        y1="165"
        x2="480"
        y2="290"
        stroke="#a1a1aa"
        strokeWidth="2"
      />
      {/* App Server to Video Streaming */}
      <line
        x1="345"
        y1="135"
        x2="345"
        y2="85"
        stroke="#a1a1aa"
        strokeWidth="2"
      />
    </svg>
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
              className="w-full h-24 px-4 py-3 border border-zinc-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

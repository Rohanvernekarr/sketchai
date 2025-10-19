"use client";

import { useState } from "react";

export const ProductDemo = () => {
  const [prompt, setPrompt] = useState("Design a microservices architecture with API gateway, authentication service, and database");

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-black to-zinc-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-400">
            Type a description and watch the magic happen
          </p>
        </div>

        <div className=" rounded-2xl p-8 shadow-2xl">
          {/* Input Area */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-400 mb-3">
              Describe your system design:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Create a REST API with PostgreSQL database and Redis cache..."
            />
            <button className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all">
              Generate Diagram →
            </button>
          </div>

          {/* Demo Output */}
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">Generated diagram would appear here</p>
              <p className="text-sm mt-2">(Add your diagram visualization component)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

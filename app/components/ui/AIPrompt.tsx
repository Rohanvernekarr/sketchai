'use client';
import React, { useState } from 'react';

interface AIPromptProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
}

export default function AIPrompt({ onGenerate, isGenerating }: AIPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      await onGenerate(prompt.trim());
      setPrompt('');
      setIsExpanded(false);
    }
  };

  const examplePrompts = [
    "Design a microservices e-commerce system with user authentication, product catalog, and payment processing",
    "Create a social media platform architecture with user posts, messaging, and notifications",
    "Design a cloud-based data pipeline for processing real-time analytics",
    "Build a system for online learning platform with video streaming and progress tracking"
  ];

  return (
    <div className="relative bg-gradient-to-r from-indigo-900/50 via-purple-900/30 to-pink-900/50 border-b border-indigo-500/20 backdrop-blur-sm">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-float [animation-delay:1s]"></div>
      </div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setIsExpanded(true)}
                  placeholder="✨ Describe your system design... (e.g., 'Create a microservices architecture for an e-commerce platform')"
                  className="relative w-full px-6 py-4 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/25 backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-indigo-500/10 hover:shadow-xl"
                  disabled={isGenerating}
                />
                {isGenerating && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className={`relative px-8 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-3 shadow-lg transform hover:scale-105 ${
                  !prompt.trim() || isGenerating
                    ? 'bg-slate-600/50 cursor-not-allowed text-slate-400'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:shadow-xl animate-pulse-glow'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Design</span>
                  </>
                )}
              </button>
            </div>

            {isExpanded && (
              <div className="relative mt-4 p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl border border-slate-600/30 backdrop-blur-sm shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl"></div>
                <div className="relative">
                  <h4 className="text-lg font-semibold text-indigo-300 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Example Prompts
                  </h4>
                  <div className="grid gap-3">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setPrompt(example)}
                        className="group text-left p-4 bg-gradient-to-r from-slate-700/40 to-slate-800/40 hover:from-indigo-600/20 hover:to-purple-600/20 rounded-lg border border-slate-600/30 hover:border-indigo-500/40 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                      >
                        <div className="text-sm text-slate-300 group-hover:text-white transition-colors duration-200">
                          "{example}"
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-600/30">
                    <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                      <div className="text-amber-400 mt-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-200 mb-1">Pro Tip</p>
                        <p className="text-xs text-slate-300">
                          Be specific about your requirements, technologies, and scale for better results. Include details like user count, data flow, and technology preferences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
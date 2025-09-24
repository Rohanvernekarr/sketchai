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
    <div className="bg-zinc-800 border-b border-zinc-700 p-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="Describe your system design... (e.g., 'Create a microservices architecture for an e-commerce platform')"
                className="w-full px-4 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                disabled={isGenerating}
              />
              {isGenerating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>

          {isExpanded && (
            <div className="mt-3 p-3 bg-zinc-750 rounded-lg border border-zinc-600">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Example prompts:</h4>
              <div className="space-y-1">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPrompt(example)}
                    className="text-left text-sm text-zinc-400 hover:text-white block w-full p-2 rounded hover:bg-zinc-700 transition-colors"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-600">
                <p className="text-xs text-zinc-500">
                  💡 Tip: Be specific about your requirements, technologies, and scale for better results
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
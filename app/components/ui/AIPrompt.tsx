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
    <div className="bg-black border-b border-white p-4">
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
                className="w-full px-4 py-2 bg-black border border-white rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
                disabled={isGenerating}
              />
              {isGenerating && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="px-6 py-2 bg-black border border-white text-white rounded font-medium transition-colors hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
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
            <div className="mt-3 p-3 bg-black rounded border border-white">
              <h4 className="text-sm font-medium text-white mb-2">Example prompts:</h4>
              <div className="space-y-1">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPrompt(example)}
                    className="text-left text-sm text-gray-300 hover:text-white block w-full p-2 rounded hover:bg-gray-800 transition-colors"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-white">
                <p className="text-xs text-gray-400">
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
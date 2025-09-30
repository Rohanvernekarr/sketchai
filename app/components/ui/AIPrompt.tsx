'use client';
import React, { useState } from 'react';

interface AIPromptProps {
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function AIPrompt({ onGenerate, isGenerating, isOpen, onClose }: AIPromptProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      await onGenerate(prompt.trim());
      setPrompt('');
      onClose();
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      onClose();
    }
  };

  const examplePrompts = [
    "Design a microservices e-commerce system with user authentication, product catalog, and payment processing",
    "Create a social media platform architecture with user posts, messaging, and notifications", 
    "Design a cloud-based data pipeline for processing real-time analytics",
    "Build a system for online learning platform with video streaming and progress tracking"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black border border-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Generate System Design</h2>
          <button
            onClick={handleClose}
            disabled={isGenerating}
            className="text-white hover:text-gray-300 disabled:opacity-50"
            aria-label="Close dialog"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-white">
              Describe your system design
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Create a microservices architecture for an e-commerce platform with user authentication, product catalog, and payment processing'"
              className="w-full px-4 py-3 bg-black border border-white rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white resize-none"
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-white">Example prompts:</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPrompt(example)}
                  disabled={isGenerating}
                  className="text-left text-sm text-gray-300 hover:text-white block w-full p-3 rounded border border-gray-600 hover:border-white transition-colors disabled:opacity-50"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-3 rounded border border-gray-600">
            <p className="text-xs text-gray-400">
              💡 <strong>Tip:</strong> Be specific about your requirements, technologies, and scale for better results
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-600">
            <button
              type="button"
              onClick={handleClose}
              disabled={isGenerating}
              className="px-4 py-2 text-white border border-gray-600 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="px-6 py-2 bg-white text-black rounded font-medium transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
        </form>
      </div>
    </div>
  );
}
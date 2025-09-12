import React from 'react';

export default function TopHeader() {
  return (
    <header className="h-12 bg-zinc-800 border-b border-zinc-700 flex items-center px-4">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        <span className="text-zinc-300 text-sm">Untitled File</span>
        <span className="text-zinc-500">•••</span>
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="flex bg-zinc-700 rounded">
          <button className="px-3 py-1 text-sm text-zinc-300 hover:text-white">
            Document
          </button>
          <button className="px-3 py-1 text-sm text-zinc-300 hover:text-white">
            Both
          </button>
          <button className="px-3 py-1 text-sm bg-zinc-600 text-white rounded">
            Canvas
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-zinc-400 text-xs">Ctrl K</span>
        <button className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
          Share
        </button>
        <div className="flex gap-1">
          <div className="w-6 h-6 bg-zinc-600 rounded"></div>
          <div className="w-6 h-6 bg-zinc-600 rounded"></div>
        </div>
      </div>
    </header>
  );
}

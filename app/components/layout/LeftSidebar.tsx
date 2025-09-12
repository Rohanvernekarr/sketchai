import React from 'react';

export default function LeftSidebar() {
  return (
    <aside className="w-80 bg-zinc-800 border-r border-zinc-700 flex flex-col">
      <div className="p-4 border-b border-zinc-700">
        <div className="flex items-center gap-2 mb-4">
          <button className="text-zinc-400 hover:text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"></path>
            </svg>
          </button>
        </div>
        
        <h1 className="text-xl text-zinc-300 mb-2">Untitled File</h1>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Type your notes or document here — style with markdown or{' '}
          <span className="text-blue-400">shortcuts</span> (Ctrl/⌘)
        </p>
      </div>

      <div className="flex-1 p-4">
        <button className="w-full bg-zinc-700 hover:bg-zinc-600 text-zinc-300 text-sm py-2 px-3 rounded flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4z"></path>
          </svg>
          Generate Outline 
          <span className="ml-auto text-xs bg-zinc-600 px-1 rounded">Ctrl G</span>
        </button>
      </div>

      <div className="p-4 border-t border-zinc-700">
        <div className="flex items-center gap-2 text-zinc-400 text-xs">
          <button className="hover:text-white">+</button>
          <button className="hover:text-white">T</button>
          <div className="flex gap-1">
            <button className="hover:text-white">≡</button>
            <button className="hover:text-white">⋯</button>
            <button className="hover:text-white">○</button>
          </div>
          <button className="hover:text-white">&lt;/&gt;</button>
          <button className="hover:text-white">↗</button>
          <button className="hover:text-white">⊞</button>
          <button className="hover:text-white">⊡</button>
          <button className="hover:text-white">🔗</button>
        </div>
      </div>
    </aside>
  );
}

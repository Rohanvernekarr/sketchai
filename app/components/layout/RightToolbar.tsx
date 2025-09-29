import React from 'react';
import IconButton from '../ui/IconButton';
import { Tool } from '../types';

interface RightToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export default function RightToolbar({ activeTool, onToolChange }: RightToolbarProps) {
  const systemTools = [
    { 
      id: 'select' as Tool,  
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      tooltip: 'Select (V)'
    },
    { 
      id: 'database' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      ),
      tooltip: 'Database (D)'
    },
    { 
      id: 'server' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth={2}/>
          <line x1="8" y1="21" x2="16" y2="21" strokeWidth={2}/>
          <line x1="12" y1="17" x2="12" y2="21" strokeWidth={2}/>
        </svg>
      ),
      tooltip: 'Server (S)'
    },
    { 
      id: 'cloud' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" strokeWidth={2}/>
        </svg>
      ),
      tooltip: 'Cloud (C)'
    },
    { 
      id: 'user' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth={2}/>
          <circle cx="12" cy="7" r="4" strokeWidth={2}/>
        </svg>
      ),
      tooltip: 'User (U)'
    },
    { 
      id: 'api' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4" strokeWidth={2}/>
          <path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" strokeWidth={2}/>
          <path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" strokeWidth={2}/>
          <path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" strokeWidth={2}/>
          <path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z" strokeWidth={2}/>
        </svg>
      ),
      tooltip: 'API (A)'
    },
    { 
      id: 'connector' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <line x1="17" y1="7" x2="7" y2="17" strokeWidth={2}/>
          <polyline points="7,13 7,17 11,17" strokeWidth={2}/>
        </svg>
      ),
      tooltip: 'Connector (L)'
    },
  ];

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      
      const keyMap: { [key: string]: Tool } = {
        'v': 'select',
        'd': 'database',
        's': 'server',
        'c': 'cloud',
        'u': 'user',
        'a': 'api',
        'l': 'connector'
      };
      
      const tool = keyMap[e.key.toLowerCase()];
      if (tool) {
        e.preventDefault();
        onToolChange(tool);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToolChange]);

  return (
    <div className="w-20 bg-gradient-to-b from-slate-900/80 to-slate-800/80 border-l border-indigo-500/20 backdrop-blur-sm">
      {/* Toolbar header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="text-xs font-semibold text-indigo-300 text-center">
          Design Tools
        </div>
        <div className="w-8 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
      </div>
      
      {/* Tool buttons */}
      <div className="flex flex-col items-center py-6 space-y-4">
        {systemTools.map((tool, index) => (
          <div key={tool.id} className="relative group">
            {/* Animated background indicator */}
            {activeTool === tool.id && (
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-sm animate-pulse-glow"></div>
            )}
            
            <IconButton
              icon={tool.icon}
              active={activeTool === tool.id}
              onClick={() => onToolChange(tool.id)}
              tooltip={tool.tooltip}
              size="sm"
            />
            
            {/* Tool indicator line */}
            {activeTool === tool.id && (
              <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-600 rounded-r-full shadow-lg shadow-indigo-500/50"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Keyboard shortcuts hint */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        <div className="text-xs text-slate-500 text-center leading-tight">
          <div className="bg-slate-800/50 rounded-lg p-2 backdrop-blur-sm border border-slate-700/30">
            Press keys to<br/>switch tools
          </div>
        </div>
      </div>
    </div>
  );
}

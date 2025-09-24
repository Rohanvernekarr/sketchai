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
    <div className="w-16 border-l border-zinc-700 flex flex-col items-center py-4 gap-2 bg-zinc-800">
      <div className="text-xs text-zinc-400 font-semibold mb-2">System Tools</div>
      {systemTools.map(tool => (
        <IconButton
          key={tool.id}
          icon={tool.icon}
          active={activeTool === tool.id}
          onClick={() => onToolChange(tool.id)}
          size="sm"
          tooltip={tool.tooltip}
        />
      ))}
    </div>
  );
}

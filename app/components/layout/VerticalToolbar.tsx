import React from 'react';
import IconButton from '../ui/IconButton';
import { Tool } from '../types';

interface VerticalToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export default function VerticalToolbar({ activeTool, onToolChange }: VerticalToolbarProps) {
  const tools = [
    { 
      id: 'pen' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      tooltip: 'Pen (P)'
    },
    { 
      id: 'rectangle' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={2}/>
        </svg>
      ),
      tooltip: 'Rectangle (R)'
    },
    { 
      id: 'circle' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth={2}/>
        </svg>
      ),
      tooltip: 'Circle (O)'
    },
    { 
      id: 'line' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      ),
      tooltip: 'Line (L)'
    },
    { 
      id: 'text' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4V2m0 18v-2m-8-8h2m16 0h-2M6.343 6.343l1.414 1.414M16.243 16.243l1.414 1.414M6.343 17.657l1.414-1.414M16.243 7.757l1.414-1.414" />
        </svg>
      ),
      tooltip: 'Text (T)'
    },
    { 
      id: 'hand' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      ),
      tooltip: 'Hand (H)'
    }
  ];

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      
      const keyMap: { [key: string]: Tool } = {
        'v': 'select',
        'p': 'pen',
        'r': 'rectangle',
        'o': 'circle',
        'l': 'line',
        't': 'text',
        'e': 'eraser',
        'h': 'hand'
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
    <div className="w-14 bg-zinc-900 border-l border-zinc-700 flex flex-col items-center py-4 gap-1">
      {tools.map(tool => (
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

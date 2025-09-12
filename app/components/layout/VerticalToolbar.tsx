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
      id: 'select' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      tooltip: 'Select (V)'
    },
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
      id: 'eraser' as Tool, 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      tooltip: 'Eraser (E)'
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
    <div className="w-14 bg-zinc-900 border-r border-zinc-700 flex flex-col items-center py-4 gap-1">
      <IconButton 
        icon={(
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )}
        variant="solid"
        size="sm"
        tooltip="Add element"
      />
      
      <div className="w-6 h-px bg-zinc-700 my-2"></div>
      
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
      
      <div className="w-6 h-px bg-zinc-700 my-2"></div>
      
      <IconButton 
        icon={(
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" strokeWidth={2}/>
            <rect x="14" y="3" width="7" height="7" strokeWidth={2}/>
            <rect x="14" y="14" width="7" height="7" strokeWidth={2}/>
            <rect x="3" y="14" width="7" height="7" strokeWidth={2}/>
          </svg>
        )}
        size="sm"
        tooltip="Frames"
      />
      <IconButton 
        icon={(
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
        size="sm"
        tooltip="Comments"
      />
    </div>
  );
}

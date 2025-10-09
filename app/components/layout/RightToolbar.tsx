import React from 'react';
import IconButton from '../ui/IconButton';
import { Tool } from '../types';
import { MousePointer , Database , Server, Cloud ,User, GitCompareArrows, Cable, PenTool , Eraser , RectangleHorizontal , Circle , Triangle } from 'lucide-react';

interface RightToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export default function RightToolbar({ activeTool, onToolChange }: RightToolbarProps) {
  const systemTools = [
    { 
      id: 'select' as Tool,  
      icon: (
        <svg className="w-4 h-4" >
          <MousePointer className='w-4 h-4' />
             </svg>
      ),
      tooltip: 'Select'
    },
    { 
      id: 'database' as Tool, 
      icon: (
        <svg className="w-4 h-4 ">
          <Database className='w-4 h-4' />
        </svg>
      ),
      tooltip: 'Database'
    },
    { 
      id: 'server' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
          <Server className='w-4 h-4' />
        </svg>
      ),
      tooltip: 'Server'
    },
    { 
      id: 'cloud' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
          <Cloud className='w-4 h-4' />
        </svg>
      ),
      tooltip: 'Cloud'
    },
    { 
      id: 'user' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
          <User className='w-4 h-4' />
        </svg>
      ),
      tooltip: 'User'
    },
    { 
      id: 'api' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
        <GitCompareArrows className='w-4 h-4' />
        </svg>
      ),
      tooltip: 'API'
    },
    { 
      id: 'connector' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
         <Cable className='w-4 h-4' />
        </svg>
      ),
      tooltip: 'Connector'
    },
  ];

  const freehandTools = [
    { 
      id: 'pen' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
          <PenTool className='w-4 h-4' />
        </svg>
      ),
      tooltip: 'Pen'
    },
    { 
      id: 'eraser' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
         <Eraser className= "w-4 h-4" />
        </svg>
      ),
      tooltip: 'Eraser'
    },
    { 
      id: 'rectangle' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
         <RectangleHorizontal className= "w-4 h-4" />
        </svg>
      ),
      tooltip: 'Rectangle'
    },
    { 
      id: 'circle' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
        <Circle className= "w-4 h-4" />
       </svg>
      ),
      tooltip: 'Circle'
    },
    { 
      id: 'triangle' as Tool, 
      icon: (
        <svg className="w-4 h-4" >
          <Triangle className= "w-4 h-4" />
        </svg>
      ),
      tooltip: 'Triangle (T)'
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
        'l': 'connector',
        'p': 'pen',
        'e': 'eraser',
        'r': 'rectangle',
        'o': 'circle',
        't': 'triangle'
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
    <div className="w-16 border-l border-white flex flex-col items-center py-4 gap-2 bg-black">
      <div className="text-xs text-white font-semibold mb-2">System</div>
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
      
      <div className="w-full h-px bg-white/20 my-2" />
      
      <div className="text-xs text-white font-semibold mb-2">Draw</div>
      {freehandTools.map(tool => (
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

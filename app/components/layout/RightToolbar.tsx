import React from "react";
import IconButton from "../ui/IconButton";
import { Tool } from "../../types";
import {
  MousePointer,
  Database,
  Server,
  Cloud,
  User,
  GitCompareArrows,
  Cable,
  PenTool,
  Eraser,
  RectangleHorizontal,
  Circle,
  Triangle,
} from "lucide-react";

interface RightToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export default function RightToolbar({
  activeTool,
  onToolChange,
}: RightToolbarProps) {
  const systemTools = [
    {
      id: "select" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <MousePointer className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Select",
    },
    {
      id: "database" as Tool,
      icon: (
        <svg className="w-6 h-6 ">
          <Database className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Database",
    },
    {
      id: "server" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <Server className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Server",
    },
    {
      id: "cloud" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <Cloud className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Cloud",
    },
    {
      id: "user" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <User className="w-4 h-4" />
        </svg>
      ),
      tooltip: "User",
    },
    {
      id: "api" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <GitCompareArrows className="w-4 h-4" />
        </svg>
      ),
      tooltip: "API",
    },
    {
      id: "connector" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <Cable className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Connector",
    },
  ];

  const freehandTools = [
    {
      id: "pen" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <PenTool className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Pen",
    },
    {
      id: "eraser" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <Eraser className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Eraser",
    },

    {
      id: "rectangle" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <RectangleHorizontal className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Rectangle",
    },
    {
      id: "circle" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <Circle className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Circle",
    },
    {
      id: "triangle" as Tool,
      icon: (
        <svg className="w-6 h-6">
          <Triangle className="w-4 h-4" />
        </svg>
      ),
      tooltip: "Triangle (T)",
    },
  ];

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;

      const keyMap: { [key: string]: Tool } = {
        v: "select",
        d: "database",
        s: "server",
        c: "cloud",
        u: "user",
        a: "api",
        l: "connector",
        p: "pen",
        e: "eraser",
        r: "rectangle",
        o: "circle",
        t: "triangle",
      };

      const tool = keyMap[e.key.toLowerCase()];
      if (tool) {
        e.preventDefault();
        onToolChange(tool);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onToolChange]);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4">
      <div
        className="
        bg-black/80 backdrop-blur-md
        rounded-full
        border border-white/50
        shadow-2xl
        flex flex-col sm:flex-row items-center
        p-5 sm:p-3
        gap-2 sm:gap-4
        max-w-max
        transition-all duration-300
        hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]
      "
      >
        {/* System Tools Section */}
        <div className="flex flex-row items-center gap-1 sm:gap-2">
          <div className="hidden sm:block text-xs text-white/70 font-medium mr-2">
            System
          </div>
          {systemTools.map((tool) => (
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

        <div className="hidden sm:block w-px h-6 bg-white/20 mx-1" />

        <div className="flex flex-row items-center gap-1 sm:gap-2">
          <div className="hidden sm:block text-xs text-white/70 font-medium mr-2">
            Draw
          </div>
          {freehandTools.map((tool) => (
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
      </div>
    </div>
  );
}

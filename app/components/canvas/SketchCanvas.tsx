'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, DrawingPath, Tool, CanvasState, BrushType } from '../types';

interface SketchCanvasProps {
  activeTool: Tool;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  onPathsChange?: (paths: DrawingPath[]) => void;
  brush?: BrushType;
  opacity?: number; // 0..1
}

export default function SketchCanvas({ 
  activeTool, 
  strokeColor, 
  strokeWidth,
  fillColor,
  onPathsChange,
  brush = 'pencil',
  opacity = 1
}: SketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [previewPath, setPreviewPath] = useState<DrawingPath | null>(null);
  const [textInput, setTextInput] = useState<{ x: number; y: number; value: string } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      canvas.style.width = canvas.offsetWidth + 'px';
      canvas.style.height = canvas.offsetHeight + 'px';
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - canvasState.translateX) / canvasState.scale,
      y: (e.clientY - rect.top - canvasState.translateY) / canvasState.scale
    };
  }, [canvasState]);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e);
    if (activeTool === 'text') {
      // Open text input overlay
      setTextInput({ x: point.x, y: point.y, value: '' });
      return;
    }

    setIsDrawing(true);
    setStartPoint(point);

    if (activeTool === 'pen' || activeTool === 'eraser') {
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        tool: activeTool,
        points: [point],
        color: activeTool === 'eraser' ? '#FFFFFF' : strokeColor,
        strokeWidth: activeTool === 'eraser' ? strokeWidth * 2 : strokeWidth,
        opacity,
        brush: activeTool === 'pen' ? brush : undefined
      };
      setPaths(prev => [...prev, newPath]);
    }
  }, [activeTool, strokeColor, strokeWidth, opacity, brush, getCoordinates]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;
    
    const point = getCoordinates(e);

    if (activeTool === 'pen' || activeTool === 'eraser') {
      setPaths(prev => {
        const updated = [...prev];
        updated[updated.length - 1].points.push(point);
        return updated;
      });
    } else if (['rectangle', 'circle', 'line', 'arrow'].includes(activeTool)) {
      // Create preview for shapes
      const preview: DrawingPath = {
        id: 'preview',
        tool: activeTool,
        points: [startPoint, point],
        color: strokeColor,
        strokeWidth,
        fillColor,
        opacity
      };
      setPreviewPath(preview);
    }
  }, [isDrawing, activeTool, strokeColor, strokeWidth, startPoint, fillColor, opacity, getCoordinates]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing || !startPoint) return;
    
    if (previewPath && ['rectangle', 'circle', 'line', 'arrow'].includes(activeTool)) {
      setPaths(prev => [...prev, { ...previewPath, id: Date.now().toString() }]);
      setPreviewPath(null);
    }

    setIsDrawing(false);
    setStartPoint(null);
  }, [isDrawing, previewPath, activeTool, startPoint]);

  // Handle panning with hand tool
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'hand' && isDrawing && startPoint) {
      const currentPoint = {
        x: e.clientX,
        y: e.clientY
      };
      setCanvasState(prev => ({
        ...prev,
        translateX: prev.translateX + (currentPoint.x - startPoint.x),
        translateY: prev.translateY + (currentPoint.y - startPoint.y)
      }));
      setStartPoint(currentPoint);
    } else {
      draw(e);
    }
  }, [activeTool, isDrawing, startPoint, draw]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Apply transformations
    ctx.save();
    ctx.translate(canvasState.translateX, canvasState.translateY);
    ctx.scale(canvasState.scale, canvasState.scale);

    // Draw all paths
    [...paths, ...(previewPath ? [previewPath] : [])].forEach(path => {
      if (path.points.length === 0) return;

      ctx.globalAlpha = path.opacity ?? 1;
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.strokeWidth;
      ctx.setLineDash([]);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (path.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      // Brush styles for pen
      if (path.tool === 'pen' && path.brush) {
        switch (path.brush) {
          case 'pencil':
            ctx.shadowColor = 'transparent';
            break;
          case 'marker':
            ctx.shadowColor = path.color;
            ctx.shadowBlur = 2;
            break;
          case 'highlighter':
            ctx.globalAlpha = (path.opacity ?? 1) * 0.35;
            ctx.globalCompositeOperation = 'multiply';
            ctx.lineCap = 'butt';
            break;
          case 'calligraphy':
            ctx.lineCap = 'butt';
            ctx.setLineDash([1, 0]);
            break;
        }
      } else {
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      }

      if (path.tool === 'pen' || path.tool === 'eraser') {
        if (path.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.forEach(point => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      } else if (path.tool === 'rectangle') {
        if (path.points.length < 2) return;
        const [start, end] = path.points;
        const width = end.x - start.x;
        const height = end.y - start.y;
        
        if (path.fillColor) {
          ctx.fillStyle = path.fillColor;
          ctx.fillRect(start.x, start.y, width, height);
        }
        ctx.beginPath();
        ctx.rect(start.x, start.y, width, height);
        ctx.stroke();
      } else if (path.tool === 'circle') {
        if (path.points.length < 2) return;
        const [start, end] = path.points;
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        if (path.fillColor) {
          ctx.fillStyle = path.fillColor;
          ctx.fill();
        }
        ctx.stroke();
      } else if (path.tool === 'line') {
        if (path.points.length < 2) return;
        const [start, end] = path.points;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      } else if (path.tool === 'arrow') {
        if (path.points.length < 2) return;
        const [start, end] = path.points;
        // Draw line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        // Draw arrowhead
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const headLen = Math.max(8, path.strokeWidth * 2);
        const arrowPoint1 = {
          x: end.x - headLen * Math.cos(angle - Math.PI / 6),
          y: end.y - headLen * Math.sin(angle - Math.PI / 6)
        };
        const arrowPoint2 = {
          x: end.x - headLen * Math.cos(angle + Math.PI / 6),
          y: end.y - headLen * Math.sin(angle + Math.PI / 6)
        };
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(arrowPoint1.x, arrowPoint1.y);
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(arrowPoint2.x, arrowPoint2.y);
        ctx.stroke();
      }
    });

    ctx.restore();
    
    if (onPathsChange) {
      onPathsChange(paths);
    }
  }, [paths, previewPath, canvasState, onPathsChange]);

  // Handle wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setCanvasState(prev => ({
        ...prev,
        scale: Math.max(0.1, Math.min(5, prev.scale * delta))
      }));
    }
  }, []);

  const getCursorClass = () => {
    switch (activeTool) {
      case 'pen': return 'cursor-crosshair';
      case 'eraser': return 'cursor-crosshair';
      case 'hand': return isDrawing ? 'cursor-grabbing' : 'cursor-grab';
      case 'text': return 'cursor-text';
      default: return 'cursor-crosshair';
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className={`w-full h-full bg-zinc-900 ${getCursorClass()}`}
        onMouseDown={startDrawing}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onWheel={handleWheel}
      />
      {/* Text input overlay */}
      {textInput && (
        <textarea
          className="absolute bg-transparent text-white outline-none resize-none"
          style={{
            left: `${(textInput.x * canvasState.scale) + canvasState.translateX}px`,
            top: `${(textInput.y * canvasState.scale) + canvasState.translateY}px`,
            fontSize: '18px',
            minWidth: '120px',
          }}
          autoFocus
          value={textInput.value}
          onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
          onBlur={() => {
            if (textInput.value.trim()) {
              const textPath: DrawingPath = {
                id: Date.now().toString(),
                tool: 'text',
                points: [{ x: textInput.x, y: textInput.y }],
                color: strokeColor,
                strokeWidth: 1,
                text: textInput.value,
                fontSize: 18,
                opacity,
              };
              setPaths(prev => [...prev, textPath]);
            }
            setTextInput(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              (e.target as HTMLTextAreaElement).blur();
            }
            if (e.key === 'Escape') {
              setTextInput(null);
            }
          }}
          placeholder="Type... (Ctrl+Enter to commit)"
        />
      )}
      
      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#666" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}

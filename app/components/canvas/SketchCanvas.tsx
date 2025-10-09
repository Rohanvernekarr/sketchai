'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, SystemElement, Connection, Tool, FreehandStroke } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface SketchCanvasProps {
  activeTool: Tool;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  systemElements?: SystemElement[];
  connections?: Connection[];
  onElementsChange?: (elements: SystemElement[]) => void;
  onConnectionsChange?: (connections: Connection[]) => void;
  freehandStrokes?: FreehandStroke[];
  onFreehandStrokesChange?: (strokes: FreehandStroke[]) => void;
}

export default function SketchCanvas({
  activeTool,
  strokeColor,
  strokeWidth,
  fillColor,
  systemElements = [],
  connections = [],
  onElementsChange,
  onConnectionsChange,
  freehandStrokes = [],
  onFreehandStrokesChange
}: SketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  // Freehand drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [currentShape, setCurrentShape] = useState<{ start: Point; current: Point } | null>(null);

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
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: SystemElement) => {
    ctx.save();
    ctx.translate(element.position.x, element.position.y);

    // Enhanced shadow for all elements
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Draw element based on type with modern styling
    switch (element.type) {
      case 'box':
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, element.size.width, element.size.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, element.size.width, element.size.height);
        break;

      case 'database':
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 10, element.size.width, element.size.height - 20);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 10, element.size.width, element.size.height - 20);
        // Draw cylinder top
        ctx.beginPath();
        ctx.ellipse(element.size.width / 2, 10, element.size.width / 2, 8, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        // Draw cylinder bottom
        ctx.beginPath();
        ctx.ellipse(element.size.width / 2, element.size.height - 10, element.size.width / 2, 8, 0, 0, Math.PI);
        ctx.stroke();
        break;

      case 'server':
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, element.size.width, element.size.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, element.size.width, element.size.height);
        // Draw server lines
      
        break;

     case 'cloud':
    // Bigger cloud
    const gradient = ctx.createRadialGradient(100, 80, 20, 100, 80, 70);
  

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(60, 80, 30, 0, Math.PI * 2);  // left puff
    ctx.arc(100, 60, 40, 0, Math.PI * 2); // top puff
    ctx.arc(140, 80, 30, 0, Math.PI * 2); // right puff
    ctx.arc(100, 100, 35, 0, Math.PI * 2); // bottom puff
    ctx.closePath();
    ctx.fill();

    // Soft outline + shadow
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow
    break;


      case 'user':
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        // Head
        ctx.beginPath();
        ctx.arc(element.size.width / 2, 20, 15, 0, Math.PI * 2);
        ctx.stroke();
        // Body
        ctx.beginPath();
        ctx.moveTo(element.size.width / 2, 35);
        ctx.lineTo(element.size.width / 2, 55);
        ctx.stroke();
        // Arms
        ctx.beginPath();
        ctx.moveTo(20, 45);
        ctx.lineTo(element.size.width - 20, 45);
        ctx.stroke();
        // Legs
        ctx.beginPath();
        ctx.moveTo(element.size.width / 2, 55);
        ctx.lineTo(25, 75);
        ctx.moveTo(element.size.width / 2, 55);
        ctx.lineTo(element.size.width - 25, 75);
        ctx.stroke();
        break;

      case 'api':
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, element.size.width, element.size.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, element.size.width, element.size.height);
        // Draw API symbol
        ctx.beginPath();
        ctx.moveTo(15, 15);
        ctx.lineTo(10, 15);
        ctx.lineTo(10, element.size.height - 15);
        ctx.lineTo(15, element.size.height - 15);
        ctx.moveTo(element.size.width - 15, 15);
        ctx.lineTo(element.size.width - 10, 15);
        ctx.lineTo(element.size.width - 10, element.size.height - 15);
        ctx.lineTo(element.size.width - 15, element.size.height - 15);
        ctx.stroke();
        break;
    }

    // Draw text
    if (element.text) {
      ctx.fillStyle = '#ffffff';
      ctx.font = `${element.fontSize || 14}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.text, element.size.width / 2, element.size.height / 2);
    }

    // Draw selection highlight
    if (element.selected) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(-3, -3, element.size.width + 6, element.size.height + 6);
      ctx.setLineDash([]);
    }

    ctx.restore();
  }, []);

  const drawConnection = useCallback((ctx: CanvasRenderingContext2D, connection: Connection) => {
    const fromElement = systemElements.find(el => el.id === connection.from);
    const toElement = systemElements.find(el => el.id === connection.to);

    if (!fromElement || !toElement) return;

    const fromCenter = {
      x: fromElement.position.x + fromElement.size.width / 2,
      y: fromElement.position.y + fromElement.size.height / 2
    };

    const toCenter = {
      x: toElement.position.x + toElement.size.width / 2,
      y: toElement.position.y + toElement.size.height / 2
    };

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    if (connection.type === 'dashed') {
      ctx.setLineDash([5, 5]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(fromCenter.x, fromCenter.y);
    ctx.lineTo(toCenter.x, toCenter.y);
    ctx.stroke();

    // Draw arrowhead
    if (connection.type === 'arrow' || connection.type === 'bidirectional') {
      const angle = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x);
      const arrowLength = 12;

      ctx.beginPath();
      ctx.moveTo(toCenter.x, toCenter.y);
      ctx.lineTo(
        toCenter.x - arrowLength * Math.cos(angle - Math.PI / 6),
        toCenter.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(toCenter.x, toCenter.y);
      ctx.lineTo(
        toCenter.x - arrowLength * Math.cos(angle + Math.PI / 6),
        toCenter.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }

    ctx.setLineDash([]);
  }, [systemElements]);

  // Draw freehand stroke
  const drawFreehandStroke = useCallback((ctx: CanvasRenderingContext2D, stroke: FreehandStroke) => {
    if (stroke.points.length < 2) return;

    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = stroke.opacity || 1;

    // If it's a shape, draw the shape
    if (stroke.shape && ['rectangle', 'circle', 'triangle'].includes(stroke.shape)) {
      const start = stroke.points[0];
      const end = stroke.points[1];
      const width = end.x - start.x;
      const height = end.y - start.y;

      switch (stroke.shape) {
        case 'rectangle':
          ctx.strokeRect(start.x, start.y, width, height);
          break;
        case 'circle':
          const centerX = start.x + width / 2;
          const centerY = start.y + height / 2;
          const radius = Math.sqrt(width * width + height * height) / 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(start.x + width / 2, start.y); // Top point
          ctx.lineTo(start.x, end.y); // Bottom left
          ctx.lineTo(end.x, end.y); // Bottom right
          ctx.closePath();
          ctx.stroke();
          break;
      }
      ctx.restore();
      return;
    }

    // Otherwise draw as a regular freehand stroke
    ctx.beginPath();
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    
    ctx.stroke();
    ctx.restore();
  }, []);

  // Draw freehand shape
  const drawFreehandShape = useCallback((ctx: CanvasRenderingContext2D, start: Point, end: Point, shapeType: string) => {
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const width = end.x - start.x;
    const height = end.y - start.y;

    switch (shapeType) {
      case 'rectangle':
        ctx.strokeRect(start.x, start.y, width, height);
        if (fillColor) {
          ctx.fillStyle = fillColor;
          ctx.fillRect(start.x, start.y, width, height);
        }
        break;

      case 'circle':
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = start.x + width / 2;
        const centerY = start.y + height / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
        if (fillColor) {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;

      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(start.x + width / 2, start.y);
        ctx.lineTo(start.x, end.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        if (fillColor) {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;

      case 'line':
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        break;

      case 'arrow':
        // Draw line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        
        // Draw arrowhead
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const arrowLength = 15;
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle - Math.PI / 6),
          end.y - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - arrowLength * Math.cos(angle + Math.PI / 6),
          end.y - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        break;
    }

    ctx.restore();
  }, [strokeColor, strokeWidth, fillColor]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with black background
    const canvasWidth = canvas.width / window.devicePixelRatio;
    const canvasHeight = canvas.height / window.devicePixelRatio;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Simple dot grid pattern
    const gridSize = 20;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    
    for (let x = gridSize; x < canvasWidth; x += gridSize) {
      for (let y = gridSize; y < canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw connections first
    connections.forEach(connection => drawConnection(ctx, connection));

    // Draw freehand strokes
    freehandStrokes.forEach(stroke => drawFreehandStroke(ctx, stroke));

    // Draw current stroke being drawn
    if (isDrawing && currentStroke.length > 1 && activeTool === 'pen') {
      const tempStroke: FreehandStroke = {
        id: 'temp',
        points: currentStroke,
        color: strokeColor,
        strokeWidth: strokeWidth
      };
      drawFreehandStroke(ctx, tempStroke);
    }

    // Draw current shape being drawn
    if (currentShape && ['rectangle', 'circle', 'triangle'].includes(activeTool)) {
      drawFreehandShape(ctx, currentShape.start, currentShape.current, activeTool);
    }

    // Draw elements
    systemElements.forEach(element => drawElement(ctx, element));
  }, [systemElements, connections, freehandStrokes, drawElement, drawConnection, drawFreehandStroke, drawFreehandShape, isDrawing, currentStroke, currentShape, activeTool, strokeColor, strokeWidth]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e);

    // Freehand drawing
    if (activeTool === 'pen') {
      setIsDrawing(true);
      setCurrentStroke([point]);
      return;
    }

    // Shape drawing
    if (['rectangle', 'circle', 'triangle'].includes(activeTool)) {
      setCurrentShape({ start: point, current: point });
      setIsDrawing(true);
      return;
    }

    // Eraser
    if (activeTool === 'eraser') {
      // Find and remove strokes that intersect with the eraser point
      const newStrokes = freehandStrokes.filter(stroke => {
        return !stroke.points.some(p => 
          Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2) < strokeWidth
        );
      });
      if (onFreehandStrokesChange) {
        onFreehandStrokesChange(newStrokes);
      }
      return;
    }

    if (activeTool === 'select') {
      // Check if clicking on an element
      const clickedElement = systemElements.find(element =>
        point.x >= element.position.x &&
        point.x <= element.position.x + element.size.width &&
        point.y >= element.position.y &&
        point.y <= element.position.y + element.size.height
      );

      if (clickedElement) {
        setSelectedElement(clickedElement.id);
        setDragging(true);
        setDragOffset({
          x: point.x - clickedElement.position.x,
          y: point.y - clickedElement.position.y
        });

        // Update element selection
        if (onElementsChange) {
          onElementsChange(systemElements.map(el => ({
            ...el,
            selected: el.id === clickedElement.id
          })));
        }
      } else {
        // Deselect all
        setSelectedElement(null);
        if (onElementsChange) {
          onElementsChange(systemElements.map(el => ({ ...el, selected: false })));
        }
      }
    } else if (['database', 'server', 'cloud', 'user', 'api'].includes(activeTool)) {
      // Create new element
      const newElement: SystemElement = {
        id: uuidv4(),
        type: activeTool as any,
        position: { x: point.x - 60, y: point.y - 40 },
        size: { width: 120, height: 80 },
        text: `${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} ${systemElements.length + 1}`,
        color: strokeColor,
        fillColor: '#374151',
        fontSize: 14,
        selected: true,
        connections: []
      };

      if (onElementsChange) {
        onElementsChange([...systemElements.map(el => ({ ...el, selected: false })), newElement]);
      }
    }
  }, [activeTool, systemElements, strokeColor, strokeWidth, freehandStrokes, onFreehandStrokesChange, getCoordinates, onElementsChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e);

    // Freehand drawing
    if (isDrawing && activeTool === 'pen') {
      setCurrentStroke(prev => [...prev, point]);
      return;
    }

    // Shape drawing
    if (isDrawing && currentShape && ['rectangle', 'circle', 'triangle'].includes(activeTool)) {
      setCurrentShape(prev => prev ? { ...prev, current: point } : null);
      return;
    }

    // Eraser (continuous erasing while mouse is down)
    if (activeTool === 'eraser' && isDrawing) {
      const newStrokes = freehandStrokes.filter(stroke => {
        return !stroke.points.some(p => 
          Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2) < strokeWidth
        );
      });
      if (onFreehandStrokesChange) {
        onFreehandStrokesChange(newStrokes);
      }
      return;
    }

    // Element dragging
    if (dragging && selectedElement && onElementsChange) {
      const newPosition = {
        x: point.x - dragOffset.x,
        y: point.y - dragOffset.y
      };

      onElementsChange(systemElements.map(el =>
        el.id === selectedElement
          ? { ...el, position: newPosition }
          : el
      ));
    }
  }, [isDrawing, activeTool, currentShape, freehandStrokes, strokeWidth, onFreehandStrokesChange, dragging, selectedElement, dragOffset, getCoordinates, systemElements, onElementsChange]);

  const handleMouseUp = useCallback(() => {
    // Finish freehand drawing
    if (isDrawing && activeTool === 'pen' && currentStroke.length > 1) {
      const newStroke: FreehandStroke = {
        id: uuidv4(),
        points: [...currentStroke],
        color: strokeColor,
        strokeWidth: strokeWidth
      };
      
      if (onFreehandStrokesChange) {
        onFreehandStrokesChange([...freehandStrokes, newStroke]);
      }
      
      setCurrentStroke([]);
    }

    // Finish shape drawing
    if (isDrawing && currentShape && ['rectangle', 'circle', 'triangle'].includes(activeTool)) {
      const newStroke: FreehandStroke = {
        id: uuidv4(),
        points: [currentShape.start, currentShape.current],
        color: strokeColor,
        strokeWidth: strokeWidth,
        shape: activeTool // Add shape type for proper rendering
      };
      
      if (onFreehandStrokesChange) {
        onFreehandStrokesChange([...freehandStrokes, newStroke]);
      }
      
      setCurrentShape(null);
    }

    setIsDrawing(false);
    setDragging(false);
  }, [isDrawing, activeTool, currentStroke, currentShape, strokeColor, strokeWidth, onFreehandStrokesChange, freehandStrokes]);

  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e);
    const clickedElement = systemElements.find(element =>
      point.x >= element.position.x &&
      point.x <= element.position.x + element.size.width &&
      point.y >= element.position.y &&
      point.y <= element.position.y + element.size.height
    );

    if (clickedElement) {
      setEditingElement(clickedElement.id);
      setEditText(clickedElement.text);
    }
  }, [systemElements, getCoordinates]);

  const handleTextEdit = useCallback((text: string) => {
    if (editingElement && onElementsChange) {
      onElementsChange(systemElements.map(el =>
        el.id === editingElement
          ? { ...el, text }
          : el
      ));
      setEditingElement(null);
      setEditText('');
    }
  }, [editingElement, systemElements, onElementsChange]);

  return (
    <div className="w-full h-full relative bg-gray-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
      
      {/* Text editing overlay */}
      {editingElement && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTextEdit(editText);
                } else if (e.key === 'Escape') {
                  setEditingElement(null);
                  setEditText('');
                }
              }}
              autoFocus
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter text..."
            />
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleTextEdit(editText)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingElement(null);
                  setEditText('');
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
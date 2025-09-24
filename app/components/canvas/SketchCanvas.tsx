'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, SystemElement, Connection, Tool } from '../types';
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
}

export default function SketchCanvas({
  activeTool,
  strokeColor,
  strokeWidth,
  fillColor,
  systemElements = [],
  connections = [],
  onElementsChange,
  onConnectionsChange
}: SketchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

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

    // Draw element based on type
    switch (element.type) {
      case 'box':
        ctx.fillStyle = element.fillColor || '#374151';
        ctx.fillRect(0, 0, element.size.width, element.size.height);
        ctx.strokeStyle = element.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, element.size.width, element.size.height);
        break;

      case 'database':
        ctx.fillStyle = element.fillColor || '#374151';
        ctx.fillRect(0, 10, element.size.width, element.size.height - 20);
        ctx.strokeStyle = element.color;
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
        ctx.fillStyle = element.fillColor || '#374151';
        ctx.fillRect(0, 0, element.size.width, element.size.height);
        ctx.strokeStyle = element.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, element.size.width, element.size.height);
        // Draw server lines
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(10, i * element.size.height / 4);
          ctx.lineTo(element.size.width - 10, i * element.size.height / 4);
          ctx.stroke();
        }
        break;

      case 'cloud':
        ctx.fillStyle = element.fillColor || '#374151';
        ctx.beginPath();
        ctx.arc(30, 25, 15, 0, Math.PI * 2);
        ctx.arc(45, 20, 20, 0, Math.PI * 2);
        ctx.arc(65, 25, 15, 0, Math.PI * 2);
        ctx.arc(45, 35, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = element.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        break;

      case 'user':
        ctx.strokeStyle = element.color;
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
        ctx.fillStyle = element.fillColor || '#374151';
        ctx.fillRect(0, 0, element.size.width, element.size.height);
        ctx.strokeStyle = element.color;
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
      ctx.fillStyle = element.color;
      ctx.font = `${element.fontSize || 14}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.text, element.size.width / 2, element.size.height / 2);
    }

    // Draw selection highlight
    if (element.selected) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
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

    ctx.strokeStyle = '#6b7280';
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

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    
    for (let x = 0; x < canvas.width / window.devicePixelRatio; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height / window.devicePixelRatio);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height / window.devicePixelRatio; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width / window.devicePixelRatio, y);
      ctx.stroke();
    }

    // Draw connections first
    connections.forEach(connection => drawConnection(ctx, connection));

    // Draw elements
    systemElements.forEach(element => drawElement(ctx, element));
  }, [systemElements, connections, drawElement, drawConnection]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e);

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
  }, [activeTool, systemElements, strokeColor, getCoordinates, onElementsChange]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragging && selectedElement && onElementsChange) {
      const point = getCoordinates(e);
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
  }, [dragging, selectedElement, dragOffset, getCoordinates, systemElements, onElementsChange]);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

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
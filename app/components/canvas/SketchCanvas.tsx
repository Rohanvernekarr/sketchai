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

    // Enhanced shadow for all elements
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Draw element based on type with modern styling
    switch (element.type) {
      case 'box':
        // Create gradient fill
        const boxGradient = ctx.createLinearGradient(0, 0, 0, element.size.height);
        boxGradient.addColorStop(0, element.fillColor || '#4f46e5');
        boxGradient.addColorStop(1, element.fillColor ? `${element.fillColor}88` : '#3730a3');
        
        ctx.fillStyle = boxGradient;
        ctx.fillRect(0, 0, element.size.width, element.size.height);
        
        // Enhanced border
        ctx.strokeStyle = element.color || '#6366f1';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeRect(0, 0, element.size.width, element.size.height);
        break;

      case 'database':
        // Database gradient
        const dbGradient = ctx.createLinearGradient(0, 0, 0, element.size.height);
        dbGradient.addColorStop(0, '#059669');
        dbGradient.addColorStop(1, '#047857');
        
        ctx.fillStyle = dbGradient;
        ctx.fillRect(0, 10, element.size.width, element.size.height - 20);
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 10, element.size.width, element.size.height - 20);
        
        // Enhanced cylinder top with gradient
        const topGradient = ctx.createRadialGradient(
          element.size.width / 2, 10, 0,
          element.size.width / 2, 10, element.size.width / 2
        );
        topGradient.addColorStop(0, '#34d399');
        topGradient.addColorStop(1, '#059669');
        
        ctx.fillStyle = topGradient;
        ctx.beginPath();
        ctx.ellipse(element.size.width / 2, 10, element.size.width / 2, 8, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.stroke();
        
        // Cylinder bottom
        ctx.beginPath();
        ctx.ellipse(element.size.width / 2, element.size.height - 10, element.size.width / 2, 8, 0, 0, Math.PI);
        ctx.stroke();
        break;

      case 'server':
        // Server gradient (orange/red theme)
        const serverGradient = ctx.createLinearGradient(0, 0, 0, element.size.height);
        serverGradient.addColorStop(0, '#ea580c');
        serverGradient.addColorStop(1, '#c2410c');
        
        ctx.fillStyle = serverGradient;
        ctx.fillRect(0, 0, element.size.width, element.size.height);
        
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, element.size.width, element.size.height);
        
        // Enhanced server lines with better spacing
        ctx.strokeStyle = '#fed7aa';
        ctx.lineWidth = 2;
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(12, i * element.size.height / 4);
          ctx.lineTo(element.size.width - 12, i * element.size.height / 4);
          ctx.stroke();
          
          // Add small indicator dots
          ctx.beginPath();
          ctx.arc(element.size.width - 20, i * element.size.height / 4, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#34d399';
          ctx.fill();
        }
        break;

      case 'cloud':
        // Cloud gradient (blue/cyan theme)
        const cloudGradient = ctx.createRadialGradient(45, 30, 10, 45, 30, 40);
        cloudGradient.addColorStop(0, '#06b6d4');
        cloudGradient.addColorStop(1, '#0891b2');
        
        ctx.fillStyle = cloudGradient;
        ctx.beginPath();
        // Create a more organic cloud shape
        ctx.arc(30, 25, 18, 0, Math.PI * 2);
        ctx.arc(50, 20, 25, 0, Math.PI * 2);
        ctx.arc(70, 25, 18, 0, Math.PI * 2);
        ctx.arc(50, 40, 22, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#0ea5e9';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Add cloud highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(45, 22, 8, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'user':
        // User figure (purple theme)
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        // Head with gradient fill
        const headGradient = ctx.createRadialGradient(
          element.size.width / 2, 20, 5,
          element.size.width / 2, 20, 15
        );
        headGradient.addColorStop(0, '#c084fc');
        headGradient.addColorStop(1, '#9333ea');
        
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(element.size.width / 2, 20, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Body
        ctx.beginPath();
        ctx.moveTo(element.size.width / 2, 35);
        ctx.lineTo(element.size.width / 2, 55);
        ctx.stroke();
        
        // Arms
        ctx.beginPath();
        ctx.moveTo(22, 45);
        ctx.lineTo(element.size.width - 22, 45);
        ctx.stroke();
        
        // Legs
        ctx.beginPath();
        ctx.moveTo(element.size.width / 2, 55);
        ctx.lineTo(28, 75);
        ctx.moveTo(element.size.width / 2, 55);
        ctx.lineTo(element.size.width - 28, 75);
        ctx.stroke();
        break;

      case 'api':
        // API gradient (pink/rose theme)
        const apiGradient = ctx.createLinearGradient(0, 0, element.size.width, element.size.height);
        apiGradient.addColorStop(0, '#ec4899');
        apiGradient.addColorStop(1, '#be185d');
        
        ctx.fillStyle = apiGradient;
        ctx.fillRect(0, 0, element.size.width, element.size.height);
        
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, element.size.width, element.size.height);
        
        // Enhanced API brackets
        ctx.strokeStyle = '#fce7f3';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        // Left bracket
        ctx.beginPath();
        ctx.moveTo(18, 18);
        ctx.lineTo(12, 18);
        ctx.lineTo(12, element.size.height - 18);
        ctx.lineTo(18, element.size.height - 18);
        ctx.stroke();
        
        // Right bracket
        ctx.beginPath();
        ctx.moveTo(element.size.width - 18, 18);
        ctx.lineTo(element.size.width - 12, 18);
        ctx.lineTo(element.size.width - 12, element.size.height - 18);
        ctx.lineTo(element.size.width - 18, element.size.height - 18);
        ctx.stroke();
        
        // API indicator dots
        const centerX = element.size.width / 2;
        const centerY = element.size.height / 2;
        ctx.fillStyle = '#fce7f3';
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(centerX + (i - 1) * 8, centerY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
    }

    // Reset shadow for text
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Enhanced text rendering
    if (element.text) {
      const fontSize = element.fontSize || 16;
      ctx.font = `600 ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Text shadow for better readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillText(element.text, element.size.width / 2 + 1, element.size.height / 2 + 1);
      
      // Main text with high contrast
      ctx.fillStyle = '#ffffff';
      ctx.fillText(element.text, element.size.width / 2, element.size.height / 2);
      
      // Add subtle text outline for better visibility
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeText(element.text, element.size.width / 2, element.size.height / 2);
    }

    // Enhanced selection highlight with glow effect
    if (element.selected) {
      // Outer glow
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 15;
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(-5, -5, element.size.width + 10, element.size.height + 10);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      
      // Animated selection border
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 4]);
      ctx.strokeRect(-3, -3, element.size.width + 6, element.size.height + 6);
      ctx.setLineDash([]);
      
      // Selection corners
      const cornerSize = 8;
      ctx.fillStyle = '#6366f1';
      // Top-left
      ctx.fillRect(-cornerSize/2, -cornerSize/2, cornerSize, cornerSize);
      // Top-right
      ctx.fillRect(element.size.width - cornerSize/2, -cornerSize/2, cornerSize, cornerSize);
      // Bottom-left
      ctx.fillRect(-cornerSize/2, element.size.height - cornerSize/2, cornerSize, cornerSize);
      // Bottom-right
      ctx.fillRect(element.size.width - cornerSize/2, element.size.height - cornerSize/2, cornerSize, cornerSize);
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

    // Enhanced connection styling with gradient
    const connectionGradient = ctx.createLinearGradient(fromCenter.x, fromCenter.y, toCenter.x, toCenter.y);
    connectionGradient.addColorStop(0, '#06b6d4');
    connectionGradient.addColorStop(0.5, '#3b82f6');
    connectionGradient.addColorStop(1, '#8b5cf6');
    
    ctx.strokeStyle = connectionGradient;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Add glow effect for connections
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 8;

    if (connection.type === 'dashed') {
      ctx.setLineDash([10, 8]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(fromCenter.x, fromCenter.y);
    ctx.lineTo(toCenter.x, toCenter.y);
    ctx.stroke();

    // Reset shadow for arrowhead
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Enhanced arrowhead
    if (connection.type === 'arrow' || connection.type === 'bidirectional') {
      const angle = Math.atan2(toCenter.y - fromCenter.y, toCenter.x - fromCenter.x);
      const arrowLength = 16;
      const arrowWidth = 8;

      // Create arrow shape
      ctx.fillStyle = '#3b82f6';
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(toCenter.x, toCenter.y);
      ctx.lineTo(
        toCenter.x - arrowLength * Math.cos(angle - Math.PI / 6),
        toCenter.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        toCenter.x - arrowLength * 0.6 * Math.cos(angle),
        toCenter.y - arrowLength * 0.6 * Math.sin(angle)
      );
      ctx.lineTo(
        toCenter.x - arrowLength * Math.cos(angle + Math.PI / 6),
        toCenter.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw connection label if exists
    if (connection.label) {
      const midX = (fromCenter.x + toCenter.x) / 2;
      const midY = (fromCenter.y + toCenter.y) / 2;
      
      // Label background
      ctx.fillStyle = 'rgba(15, 15, 35, 0.9)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      
      const labelPadding = 8;
      ctx.font = '12px Inter, sans-serif';
      const textMetrics = ctx.measureText(connection.label);
      const labelWidth = textMetrics.width + labelPadding * 2;
      const labelHeight = 24;
      
      ctx.fillRect(midX - labelWidth/2, midY - labelHeight/2, labelWidth, labelHeight);
      ctx.strokeRect(midX - labelWidth/2, midY - labelHeight/2, labelWidth, labelHeight);
      
      // Label text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(connection.label, midX, midY);
    }

    ctx.setLineDash([]);
  }, [systemElements]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient background
    const canvasWidth = canvas.width / window.devicePixelRatio;
    const canvasHeight = canvas.height / window.devicePixelRatio;
    
    // Create beautiful gradient background
    const backgroundGradient = ctx.createRadialGradient(
      canvasWidth / 2, canvasHeight / 2, 0,
      canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight) / 2
    );
    backgroundGradient.addColorStop(0, '#1e1e3e');
    backgroundGradient.addColorStop(1, '#0f0f23');
    
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Modern dot grid pattern
    const gridSize = 25;
    const dotSize = 1.5;
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    
    for (let x = gridSize; x < canvasWidth; x += gridSize) {
      for (let y = gridSize; y < canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add subtle larger dots at major intersections
    const majorGridSize = gridSize * 4;
    ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
    
    for (let x = majorGridSize; x < canvasWidth; x += majorGridSize) {
      for (let y = majorGridSize; y < canvasHeight; y += majorGridSize) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
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
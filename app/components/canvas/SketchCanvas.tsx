'use client';

import React, { useEffect, useRef } from 'react';
import { SketchCanvasProps } from '../types';
import { useCanvas } from './useCanvas';
import { useDrawing } from './useDrawing';
import { useElements } from './useElements';
import { useTextEditing } from './useTextEditing';
import { drawElement } from './drawElements';
import { drawConnection } from './drawConnections';
import { drawFreehandStroke, drawFreehandShape } from './drawFreehand';

export default function SketchCanvas(props: SketchCanvasProps) {
  const canvasRef = useCanvas();
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingHook = useDrawing(props, canvasRef);
  const elementsHook = useElements(props, canvasRef, drawingHook);
  const textEditHook = useTextEditing(props);

  // Handle canvas resize for responsiveness
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      
      if (!canvas || !container) return;

      // Get device pixel ratio for sharp rendering
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      // Set canvas internal size accounting for device pixel ratio
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Set display size (CSS pixels)
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      // Scale context for high-DPI displays
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    // Initial resize
    resizeCanvas();

    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [canvasRef]);

  // Add non-passive touch event listeners for mobile drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        bubbles: true
      });
      canvas.dispatchEvent(mouseEvent);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        bubbles: true
      });
      canvas.dispatchEvent(mouseEvent);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const mouseEvent = new MouseEvent('mouseup', {
        bubbles: true
      });
      canvas.dispatchEvent(mouseEvent);
    };

    // Add listeners with passive: false to allow preventDefault
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvasRef]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && elementsHook.connectingFrom) {
        e.preventDefault();
        elementsHook.cancelConnection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elementsHook]);

  // Main render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const canvasWidth = canvas.width / window.devicePixelRatio;
    const canvasHeight = canvas.height / window.devicePixelRatio;

    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Dot grid
    const gridSize = 20;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    for (let x = gridSize; x < canvasWidth; x += gridSize) {
      for (let y = gridSize; y < canvasHeight; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const { systemElements = [], connections = [], freehandStrokes = [], activeTool, strokeColor, strokeWidth } = props;
    
    // Draw connections
    connections.forEach(conn => drawConnection(ctx, conn, systemElements));
    
    // Draw freehand strokes
    freehandStrokes.forEach(stroke => drawFreehandStroke(ctx, stroke));
    
    // Draw current pen stroke
    if (drawingHook.isDrawing && drawingHook.currentStroke.length > 1 && activeTool === 'pen') {
      drawFreehandStroke(ctx, {
        id: 'temp', points: drawingHook.currentStroke, color: strokeColor, strokeWidth
      });
    }
    
    // Draw current shape preview
    if (drawingHook.currentShape && ['rectangle', 'circle', 'triangle', 'line', 'arrow'].includes(activeTool)) {
      drawFreehandShape(ctx, drawingHook.currentShape.start, drawingHook.currentShape.current, activeTool, strokeColor, strokeWidth, props.fillColor);
    }
    
    // Draw elements
    systemElements.forEach(element => {
      const isConnecting = elementsHook.connectingFrom === element.id;
      const elementToRender = isConnecting ? { ...element, selected: true } : element;
      drawElement(ctx, elementToRender);
    });
  }, [props, canvasRef, drawingHook.isDrawing, drawingHook.currentStroke, drawingHook.currentShape, elementsHook.connectingFrom]);

  // Merge multiple event handlers
  const mergeHandlers = (...handlers: any[]) => (e: React.MouseEvent<HTMLCanvasElement>) =>
    handlers.forEach(h => h && h(e));

  // Get cursor style based on active tool
  const getCursorStyle = () => {
    if (props.activeTool === 'connector') {
      return elementsHook.connectingFrom ? 'crosshair' : 'pointer';
    }
    if (props.activeTool === 'select') return 'default';
    if (props.activeTool === 'text') return 'text';
    return 'crosshair';
  };

  return (
    <div ref={containerRef} className="w-full h-full relative bg-black">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full touch-none cursor-${getCursorStyle()}`}
        onMouseDown={mergeHandlers(drawingHook.eventHandlers.onMouseDown, elementsHook.eventHandlers.onMouseDown)}
        onMouseMove={mergeHandlers(drawingHook.eventHandlers.onMouseMove, elementsHook.eventHandlers.onMouseMove)}
        onMouseUp={mergeHandlers(drawingHook.eventHandlers.onMouseUp, elementsHook.eventHandlers.onMouseUp)}
        onMouseLeave={mergeHandlers(drawingHook.eventHandlers.onMouseLeave, null)}
        onDoubleClick={textEditHook.handleDoubleClick}
      />
      {elementsHook.connectingFrom && (
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black border border-white text-white px-2 py-1 sm:px-3 sm:py-2 rounded text-xs sm:text-sm max-w-[90%] sm:max-w-none sm:mt-1 mt-14 z-10">
          <span className="hidden sm:inline">Click on another element to connect • Press ESC to cancel</span>
          <span className="sm:hidden">Tap to connect • ESC to cancel</span>
        </div>
      )}
      {textEditHook.renderOverlay()}
    </div>
  );
}

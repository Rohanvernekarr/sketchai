'use client';

import React, { useEffect } from 'react';
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
  const drawingHook = useDrawing(props, canvasRef);
  const elementsHook = useElements(props, canvasRef, drawingHook);
  const textEditHook = useTextEditing(props);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && elementsHook.connectingFrom) {
        e.preventDefault();
        elementsHook.cancelConnection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elementsHook]);

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
    // Connections
    connections.forEach(conn => drawConnection(ctx, conn, systemElements));
    // Freehand
    freehandStrokes.forEach(stroke => drawFreehandStroke(ctx, stroke));
    if (drawingHook.isDrawing && drawingHook.currentStroke.length > 1 && activeTool === 'pen') {
      drawFreehandStroke(ctx, {
        id: 'temp', points: drawingHook.currentStroke, color: strokeColor, strokeWidth
      });
    }
    if (drawingHook.currentShape && ['rectangle', 'circle', 'triangle'].includes(activeTool)) {
      drawFreehandShape(ctx, drawingHook.currentShape.start, drawingHook.currentShape.current, activeTool, strokeColor, strokeWidth, props.fillColor);
    }
    // Elements
    systemElements.forEach(element => {
      // Highlight element if it's being connected from
      const isConnecting = elementsHook.connectingFrom === element.id;
      const elementToRender = isConnecting ? { ...element, selected: true } : element;
      drawElement(ctx, elementToRender);
    });
  }, [props, canvasRef, drawingHook.isDrawing, drawingHook.currentStroke, drawingHook.currentShape, elementsHook.connectingFrom]);

  // Compose all needed mouse event handlers for canvas
  const mergeHandlers = (...handlers: any[]) => (e: React.MouseEvent<HTMLCanvasElement>) =>
    handlers.forEach(h => h && h(e));

  // Determine cursor style based on active tool
  const getCursorStyle = () => {
    if (props.activeTool === 'connector') {
      return elementsHook.connectingFrom ? 'crosshair' : 'pointer';
    }
    if (props.activeTool === 'select') return 'default';
    return 'crosshair';
  };

  return (
    <div className="w-full h-full relative bg-gray-50">
      <canvas
        ref={canvasRef}
        className={`w-full h-full cursor-${getCursorStyle()}`}
        onMouseDown={mergeHandlers(drawingHook.eventHandlers.onMouseDown, elementsHook.eventHandlers.onMouseDown)}
        onMouseMove={mergeHandlers(drawingHook.eventHandlers.onMouseMove, elementsHook.eventHandlers.onMouseMove)}
        onMouseUp={mergeHandlers(drawingHook.eventHandlers.onMouseUp, elementsHook.eventHandlers.onMouseUp)}
        onMouseLeave={mergeHandlers(drawingHook.eventHandlers.onMouseLeave, null)}
        onDoubleClick={textEditHook.handleDoubleClick}
      />
      {elementsHook.connectingFrom && (
        <div className="absolute top-4 left-4 bg-black border border-white text-white px-3 py-2 rounded text-sm">
          Click on another element to connect • Press ESC to cancel
        </div>
      )}
      {textEditHook.renderOverlay()}
    </div>
  );
}

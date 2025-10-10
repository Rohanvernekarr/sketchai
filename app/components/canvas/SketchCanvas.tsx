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
    systemElements.forEach(element => drawElement(ctx, element));
  }, [props, canvasRef, drawingHook.isDrawing, drawingHook.currentStroke, drawingHook.currentShape]);

  // Compose all needed mouse event handlers for canvas
  const mergeHandlers = (...handlers: any[]) => (e: React.MouseEvent<HTMLCanvasElement>) =>
    handlers.forEach(h => h && h(e));

  return (
    <div className="w-full h-full relative bg-gray-50">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        onMouseDown={mergeHandlers(drawingHook.eventHandlers.onMouseDown, elementsHook.eventHandlers.onMouseDown)}
        onMouseMove={mergeHandlers(drawingHook.eventHandlers.onMouseMove, elementsHook.eventHandlers.onMouseMove)}
        onMouseUp={mergeHandlers(drawingHook.eventHandlers.onMouseUp, elementsHook.eventHandlers.onMouseUp)}
        onMouseLeave={mergeHandlers(drawingHook.eventHandlers.onMouseLeave, null)}
        onDoubleClick={textEditHook.handleDoubleClick}
      />
      {textEditHook.renderOverlay()}
    </div>
  );
}

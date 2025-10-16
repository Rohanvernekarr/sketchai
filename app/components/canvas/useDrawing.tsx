import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Point, FreehandStroke, SketchCanvasProps } from '../types';

export function useDrawing(
  {
    activeTool, strokeColor, strokeWidth, fillColor,
    freehandStrokes = [], onFreehandStrokesChange
  }: SketchCanvasProps,
    canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [currentShape, setCurrentShape] = useState<{ start: Point; current: Point } | null>(null);

  const getCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, [canvasRef]);

  // Mouse events for drawing
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e);
    if (activeTool === 'pen') {
      setIsDrawing(true);
      setCurrentStroke([point]);
    }
    if (['rectangle', 'circle', 'triangle'].includes(activeTool)) {
      setCurrentShape({ start: point, current: point });
      setIsDrawing(true);
    }
    if (activeTool === 'eraser') {
      const newStrokes = freehandStrokes.filter(stroke =>
        !stroke.points.some(p =>
          Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2) < strokeWidth
        )
      );
      if (onFreehandStrokesChange) onFreehandStrokesChange(newStrokes);
    }
  }, [activeTool, getCoordinates, freehandStrokes, onFreehandStrokesChange, strokeWidth]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getCoordinates(e);

    if (isDrawing && activeTool === 'pen') {
      setCurrentStroke(prev => [...prev, point]);
    }
    if (isDrawing && currentShape && ['rectangle', 'circle', 'triangle'].includes(activeTool)) {
      setCurrentShape(prev => prev ? { ...prev, current: point } : null);
    }
    if (activeTool === 'eraser' && isDrawing) {
      const newStrokes = freehandStrokes.filter(stroke =>
        !stroke.points.some(p =>
          Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2) < strokeWidth
        )
      );
      if (onFreehandStrokesChange) onFreehandStrokesChange(newStrokes);
    }
  }, [isDrawing, activeTool, currentShape, freehandStrokes, strokeWidth, onFreehandStrokesChange, getCoordinates]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing && activeTool === 'pen' && currentStroke.length > 1) {
      const newStroke: FreehandStroke = {
        id: uuidv4(),
        points: [...currentStroke],
        color: strokeColor,
        strokeWidth
      };
      if (onFreehandStrokesChange) onFreehandStrokesChange([...freehandStrokes, newStroke]);
      setCurrentStroke([]);
    }
    if (isDrawing && currentShape && ['rectangle', 'circle', 'triangle'].includes(activeTool)) {
      const newStroke: FreehandStroke = {
        id: uuidv4(),
        points: [currentShape.start, currentShape.current],
        color: strokeColor,
        strokeWidth, shape: activeTool
      };
      if (onFreehandStrokesChange) onFreehandStrokesChange([...freehandStrokes, newStroke]);
      setCurrentShape(null);
    }
    setIsDrawing(false);
  }, [isDrawing, activeTool, currentStroke, currentShape, strokeColor, strokeWidth, onFreehandStrokesChange, freehandStrokes]);

  return {
    isDrawing, currentStroke, currentShape,
    eventHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp
    }
  };
}

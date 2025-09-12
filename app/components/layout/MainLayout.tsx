'use client';
import React, { useState, useCallback } from 'react';
import TopHeader from './TopHeader';
import LeftSidebar from './LeftSidebar';
import VerticalToolbar from './VerticalToolbar';
import BottomToolbar from './BottomToolbar';
import SketchCanvas from '../canvas/SketchCanvas';
import { Tool, DrawingPath, BrushType } from '../types';

export default function MainLayout() {
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [fillColor, setFillColor] = useState<string>('');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [brush, setBrush] = useState<BrushType>('pencil');
  const [opacity, setOpacity] = useState<number>(1);
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<DrawingPath[][]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [paths, setPaths] = useState<DrawingPath[]>([]);

  // Handle undo
  const handleUndo = useCallback(() => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setPaths(history[historyStep - 1]);
    }
  }, [history, historyStep]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setPaths(history[historyStep + 1]);
    }
  }, [history, historyStep]);

  // Handle paths change to maintain history
  const handlePathsChange = useCallback((newPaths: DrawingPath[]) => {
    if (newPaths.length !== paths.length) {
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push([...newPaths]);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
      setPaths(newPaths);
    }
  }, [paths, history, historyStep]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              handleRedo();
            } else {
              handleUndo();
            }
            break;
          case 'y':
            e.preventDefault();
            handleRedo();
            break;
          case '=':
          case '+':
            e.preventDefault();
            setZoom(prev => Math.min(500, prev + 10));
            break;
          case '-':
            e.preventDefault();
            setZoom(prev => Math.max(10, prev - 10));
            break;
          case '0':
            e.preventDefault();
            setZoom(100);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  return (
    <div className="h-screen bg-zinc-900 text-white flex flex-col select-none">
      <TopHeader />
      
      <div className="flex-1 flex overflow-hidden">
        <LeftSidebar />
        <VerticalToolbar 
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />
        
        <div className="flex-1 relative">
          <SketchCanvas 
            activeTool={activeTool}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            fillColor={fillColor}
            brush={brush}
            opacity={opacity}
            onPathsChange={handlePathsChange}
          />
          <BottomToolbar 
            strokeColor={strokeColor}
            fillColor={fillColor}
            strokeWidth={strokeWidth}
            onColorChange={setStrokeColor}
            onFillColorChange={setFillColor}
            onStrokeWidthChange={setStrokeWidth}
            brush={brush}
            onBrushChange={setBrush}
            opacity={opacity}
            onOpacityChange={setOpacity}
            zoom={zoom}
            onZoomChange={setZoom}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyStep > 0}
            canRedo={historyStep < history.length - 1}
          />
        </div>
      </div>
    </div>
  );
}

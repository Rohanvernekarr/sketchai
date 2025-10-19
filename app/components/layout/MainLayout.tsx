'use client';
import React, { useState, useCallback, useRef } from 'react';
import RightToolbar from './RightToolbar';
import SketchCanvas from '../canvas/SketchCanvas';
import AIPrompt from '../ui/AIPrompt';
import { Tool, DrawingPath, BrushType, SystemElement, Connection, DiagramData, AIResponse, FreehandStroke } from '../../types';
import { geminiService } from '../../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface HistoryState {
  elements: SystemElement[];
  connections: Connection[];
  freehandStrokes: FreehandStroke[];
}

export default function MainLayout() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [fillColor, setFillColor] = useState<string>('');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [brush, setBrush] = useState<BrushType>('pencil');
  const [opacity, setOpacity] = useState<number>(1);
  const [zoom, setZoom] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAIPromptOpen, setIsAIPromptOpen] = useState(false);
  const [systemElements, setSystemElements] = useState<SystemElement[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [freehandStrokes, setFreehandStrokes] = useState<FreehandStroke[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<DiagramData | null>(null);
  
  // History management
  const [history, setHistory] = useState<HistoryState[]>([{ elements: [], connections: [], freehandStrokes: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle AI diagram generation
  const handleAIGenerate = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await geminiService.generateSystemDesign(prompt);
      
      // Create system elements from AI response
      const newElements: SystemElement[] = response.elements.map((el: any) => ({
        id: uuidv4(),
        type: el.type as 'database' | 'server' | 'cloud' | 'user' | 'api' | 'box',
        position: el.position || { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
        size: el.size || { width: 120, height: 80 },
        text: el.label,
        color: strokeColor,
        fillColor: fillColor
      }));

      // Create connections from AI response
      const newConnections: Connection[] = response.connections.map((conn: any) => ({
        id: uuidv4(),
        from: newElements.find(el => el.text === conn.from)?.id || '',
        to: newElements.find(el => el.text === conn.to)?.id || '',
        label: conn.label,
        type: conn.type || 'arrow'
      }));

      setSystemElements(newElements);
      setConnections(newConnections);
      setCurrentDiagram({
        elements: newElements,
        connections: newConnections,
        metadata: {
          title: response.title,
          description: response.description,
          createdAt: new Date().toISOString(),
          prompt: prompt
        }
      });
      
      // Save to history
      setTimeout(() => {
        const newState: HistoryState = {
          elements: newElements,
          connections: newConnections,
          freehandStrokes: []
        };
        const newHistory = [...history.slice(0, historyIndex + 1), newState];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }, 100);
    } catch (error) {
      console.error('Error generating diagram:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [strokeColor, fillColor, history, historyIndex]);

  // Undo function
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      
      // Update state without triggering history save
      setSystemElements(previousState.elements);
      setConnections(previousState.connections);
      setFreehandStrokes(previousState.freehandStrokes);
      setHistoryIndex(newIndex);
      
      // Update current diagram
      if (currentDiagram) {
        setCurrentDiagram({
          ...currentDiagram,
          elements: previousState.elements,
          connections: previousState.connections
        });
      }
      
      // Manually trigger re-render by updating handlers
      // The canvas will re-render automatically due to systemElements/connections props change
    }
  }, [historyIndex, history, currentDiagram]);

  // Redo function
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      
      // Update state without triggering history save
      setSystemElements(nextState.elements);
      setConnections(nextState.connections);
      setFreehandStrokes(nextState.freehandStrokes);
      setHistoryIndex(newIndex);
      
      // Update current diagram
      if (currentDiagram) {
        setCurrentDiagram({
          ...currentDiagram,
          elements: nextState.elements,
          connections: nextState.connections
        });
      }
      
      // Manually trigger re-render by updating handlers
      // The canvas will re-render automatically due to systemElements/connections props change
    }
  }, [historyIndex, history, currentDiagram]);

  // Clear all function
  const handleClear = useCallback(() => {
    setSystemElements([]);
    setConnections([]);
    setFreehandStrokes([]);
    setCurrentDiagram(null);
    
    // Save clear state to history
    const clearState: HistoryState = { elements: [], connections: [], freehandStrokes: [] };
    const newHistory = [...history.slice(0, historyIndex + 1), clearState];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Handle system elements change
  const handleElementsChange = useCallback((elements: SystemElement[]) => {
    setSystemElements(elements);
    if (currentDiagram) {
      setCurrentDiagram({
        ...currentDiagram,
        elements
      });
    }
  }, [currentDiagram]);

  // Handle freehand strokes change
  const handleFreehandStrokesChange = useCallback((strokes: FreehandStroke[]) => {
    setFreehandStrokes(strokes);
  }, []);

  // Handle connections change
  const handleConnectionsChange = useCallback((connections: Connection[]) => {
    setConnections(connections);
    if (currentDiagram) {
      setCurrentDiagram({
        ...currentDiagram,
        connections
      });
    }
  }, [currentDiagram]);

  // Save to history when elements or connections change
  React.useEffect(() => {
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Don't save empty initial state
    if (systemElements.length === 0 && connections.length === 0 && freehandStrokes.length === 0 && history.length === 1) {
      return;
    }
    
    // Save after 1 second of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      const newState: HistoryState = {
        elements: [...systemElements],
        connections: [...connections],
        freehandStrokes: [...freehandStrokes]
      };
      
      // Don't save if state hasn't changed
      const currentState = history[historyIndex];
      if (currentState && 
          JSON.stringify(currentState.elements) === JSON.stringify(newState.elements) &&
          JSON.stringify(currentState.connections) === JSON.stringify(newState.connections) &&
          JSON.stringify(currentState.freehandStrokes) === JSON.stringify(newState.freehandStrokes)) {
        return;
      }
      
      // Remove future history if we're not at the end
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      
      // Limit history to 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
        setHistoryIndex(newHistory.length - 1);
      } else {
        setHistoryIndex(newHistory.length - 1);
      }
      
      setHistory(newHistory);
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [systemElements, connections, freehandStrokes, history, historyIndex]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            handleUndo();
            break;
          case 'g':
            e.preventDefault();
            setIsAIPromptOpen(true);
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
  }, [handleUndo]);

  return (
    <div className="h-screen w-full flex flex-row select-none overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-row relative">
        {/* Canvas area */}
        <div className="flex-1 relative overflow-hidden">
          <SketchCanvas 
            activeTool={activeTool}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            fillColor={fillColor}
            systemElements={systemElements}
            connections={connections}
            freehandStrokes={freehandStrokes}
            onElementsChange={handleElementsChange}
            onConnectionsChange={handleConnectionsChange}
            onFreehandStrokesChange={handleFreehandStrokesChange}
          />
          
          {/* Action buttons */}
       <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex gap-1 sm:gap-2">
  <button
    onClick={() => setIsAIPromptOpen(true)}
    className="bg-black border border-white text-white px-10 py-3 sm:px-3 sm:py-2 rounded text-xs sm:text-sm hover:bg-white hover:text-black transition-colors flex items-center gap-1"
    title="Generate with AI (Ctrl+G)"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
    <span className=" sm:inline">AI Generate</span>
  </button>
  
  <button
    onClick={handleUndo}
    disabled={historyIndex <= 0}
    className="bg-black border border-white text-white px-3 py-1.5 sm:px-3 sm:py-2 rounded text-xs sm:text-sm hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    title="Undo (Ctrl+Z)"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
    <span className="hidden sm:inline">Undo</span>
  </button>
  
  <button
    onClick={handleRedo}
    disabled={historyIndex >= history.length - 1}
    className="bg-black border border-white text-white px-3 py-1.5 sm:px-3 sm:py-2 rounded text-xs sm:text-sm hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    title="Redo (Ctrl+Y)"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
    </svg>
    <span className="hidden sm:inline">Redo</span>
  </button>
  
  <button
    onClick={handleClear}
    disabled={systemElements.length === 0 && connections.length === 0 && freehandStrokes.length === 0}
    className="bg-black border border-white text-white px-3 py-1.5 sm:px-3 sm:py-2 rounded text-xs sm:text-sm hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    title="Clear All"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
    <span className="hidden sm:inline">Clear</span>
  </button>
</div>

         
         <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 max-w-[95%] sm:max-w-none">
  <div className="bg-black border border-white rounded p-1.5 sm:p-2 text-white text-[10px] sm:text-xs">
  
    <div className="hidden sm:block">
      Elements: {systemElements.length} | Connections: {connections.length} | Strokes: {freehandStrokes.length} | History: {historyIndex + 1}/{history.length}
    </div>
    
   
    
  </div>
</div>

        </div>
        
        {/* Right toolbar */}
        <RightToolbar 
          activeTool={activeTool}
          onToolChange={setActiveTool}
        />
      </div>
      
      {/* AI Prompt Popup */}
      <AIPrompt 
        onGenerate={handleAIGenerate}
        isGenerating={isGenerating}
        isOpen={isAIPromptOpen}
        onClose={() => setIsAIPromptOpen(false)}
      />
    </div>
  );
}

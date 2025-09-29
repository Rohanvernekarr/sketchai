'use client';
import React, { useState, useCallback } from 'react';
import RightToolbar from './RightToolbar';
import SketchCanvas from '../canvas/SketchCanvas';
import AIPrompt from '../ui/AIPrompt';
import { Tool, DrawingPath, BrushType, SystemElement, Connection, DiagramData, AIResponse } from '../types';
import { geminiService } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

export default function MainLayout() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [strokeColor, setStrokeColor] = useState('#ffffff');
  const [fillColor, setFillColor] = useState<string>('');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [brush, setBrush] = useState<BrushType>('pencil');
  const [opacity, setOpacity] = useState<number>(1);
  const [zoom, setZoom] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [systemElements, setSystemElements] = useState<SystemElement[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [currentDiagram, setCurrentDiagram] = useState<DiagramData | null>(null);

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
    } catch (error) {
      console.error('Error generating diagram:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

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

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
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
  }, []);

  return (
    <div className="h-screen flex flex-col select-none overflow-hidden">
      {/* AI Prompt at top */}
      <AIPrompt 
        onGenerate={handleAIGenerate}
        isGenerating={isGenerating}
      />
      
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
            onElementsChange={handleElementsChange}
            onConnectionsChange={handleConnectionsChange}
          />
          
          {/* Floating status info */}
          <div className="absolute bottom-6 left-6 z-10">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-slate-600/30 shadow-xl">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300">
                    {systemElements.length} elements
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-300">
                    {connections.length} connections
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-600"></div>
                <div className="text-slate-400">
                  Zoom: {zoom}%
                </div>
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
    </div>
  );
}

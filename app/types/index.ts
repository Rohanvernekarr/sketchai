export type Tool = 
  | 'select' 
  | 'pen' 
  | 'rectangle' 
  | 'circle' 
  | 'triangle'
  | 'arrow' 
  | 'text' 
  | 'eraser' 
  | 'hand'
  | 'line'
  | 'database'
  | 'server'
  | 'cloud'
  | 'user'
  | 'api'
  | 'connector'
  | 'freehand';

export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  id: string;
  tool: Tool;
  points: Point[];
  color: string;
  strokeWidth: number;
  fillColor?: string;
  opacity?: number;
  text?: string;
  fontSize?: number; 
  fontFamily?: string;
  fontWeight?: string;
  align?: 'left' | 'center' | 'right';
  brush?: BrushType;
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow';
  startPoint?: Point;
  endPoint?: Point;
  smoothed?: boolean;
}

export interface TextElement {
  id: string;
  position: Point;
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  isEditing?: boolean;
}

// Freehand drawing stroke
export interface FreehandStroke {
  id: string;
  points: Point[];
  color: string;
  strokeWidth: number;
  opacity?: number;
  brush?: BrushType;
  shape?: Tool; 
}

export interface SystemElement {
  id: string;
  type: 'database' | 'server' | 'cloud' | 'user' | 'api' | 'box';
  position: Point;
  size: { width: number; height: number; };
  text: string;
  color: string;
  fillColor?: string;
  fontSize?: number;
  selected?: boolean;
  connections?: string[]; // connection ids
  
}

export interface Connection {
  id: string;
  from: string; // element id
  to: string; // element id
  label?: string;
  type: 'arrow' | 'line' | 'dashed' | 'bidirectional';
  points?: Point[]; // for custom routing
}

// AI Response Types
export interface AIResponse {
  title: string;
  description: string;
  elements: Array<{
    type: string;
    label: string;
    position?: Point;
    size?: { width: number; height: number; };
  }>;
  connections: Array<{
    from: string;
    to: string;
    label?: string;
    type?: string;
  }>;
}

export interface DiagramData {
  elements: SystemElement[];
  connections: Connection[];
  metadata: {
    title: string;
    description: string;
    createdAt: string;
    prompt: string;
  };
}

export interface CanvasState {
  scale: number;
  translateX: number;
  translateY: number;
}
export interface SketchCanvasProps {
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
  textElements?: TextElement[];
  onTextElementsChange?: (elements: TextElement[]) => void;
}

export type BrushType = 'pencil' | 'marker' | 'highlighter' | 'calligraphy';

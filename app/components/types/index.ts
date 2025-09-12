export type Tool = 
  | 'select' 
  | 'pen' 
  | 'rectangle' 
  | 'circle' 
  | 'arrow' 
  | 'text' 
  | 'eraser' 
  | 'hand'
  | 'line';

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
  // 0..1 opacity for rendering
  opacity?: number;
  // Text-specific properties (used when tool === 'text')
  text?: string;
  fontSize?: number; // px
  fontFamily?: string;
  fontWeight?: string;
  align?: 'left' | 'center' | 'right';
  // Brush style for pen tool
  brush?: BrushType;
}

export interface CanvasState {
  scale: number;
  translateX: number;
  translateY: number;
}

export type BrushType = 'pencil' | 'marker' | 'highlighter' | 'calligraphy';

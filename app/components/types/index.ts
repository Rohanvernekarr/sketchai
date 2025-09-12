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
}

export interface CanvasState {
  scale: number;
  translateX: number;
  translateY: number;
}

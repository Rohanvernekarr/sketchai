import { FreehandStroke, Point } from '../../types';

// For saved strokes or shapes
export function drawFreehandStroke(ctx: CanvasRenderingContext2D, stroke: FreehandStroke) {
  if (stroke.points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = stroke.opacity || 1;
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for(let i = 1; i < stroke.points.length - 2; i++) {
    const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
    const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
    ctx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
  }
  ctx.lineTo(
    stroke.points[stroke.points.length - 1].x,
    stroke.points[stroke.points.length - 1].y
  );

  if (stroke.shape && ['rectangle', 'circle', 'triangle'].includes(stroke.shape)) {
    const start = stroke.points[0];
    const end = stroke.points[1];
    const width = end.x - start.x;
    const height = end.y - start.y;
    switch (stroke.shape) {
      case 'rectangle':
        ctx.strokeRect(start.x, start.y, width, height);
        break;
      case 'circle': {
        const centerX = start.x + width / 2;
        const centerY = start.y + height / 2;
        const radius = Math.sqrt(width * width + height * height) / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(start.x + width / 2, start.y);
        ctx.lineTo(start.x, end.y);
        ctx.lineTo(end.x, end.y);
        ctx.closePath();
        ctx.stroke();
        break;
    }
    ctx.restore();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
  for (let i = 1; i < stroke.points.length; i++) ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  ctx.stroke();
  ctx.restore();
}

// For current shape preview while drawing
export function drawFreehandShape(
  ctx: CanvasRenderingContext2D, start: Point, end: Point, shapeType: string,
  strokeColor?: string, strokeWidth?: number, fillColor?: string
) {
  ctx.save();
  if (strokeColor) ctx.strokeStyle = strokeColor;
  if (strokeWidth) ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const width = end.x - start.x;
  const height = end.y - start.y;
  switch (shapeType) {
    case 'rectangle':
      ctx.strokeRect(start.x, start.y, width, height);
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(start.x, start.y, width, height);
      }
      break;
    case 'circle': {
      const radius = Math.sqrt(width * width + height * height) / 2;
      const centerX = start.x + width / 2;
      const centerY = start.y + height / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
      if (fillColor) { ctx.fillStyle = fillColor; ctx.fill(); }
      ctx.stroke();
      break;
    }
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(start.x + width / 2, start.y);
      ctx.lineTo(start.x, end.y);
      ctx.lineTo(end.x, end.y);
      ctx.closePath();
      if (fillColor) { ctx.fillStyle = fillColor; ctx.fill(); }
      ctx.stroke();
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      break;
    case 'arrow':
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const arrowLength = 15;
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle - Math.PI / 6),
        end.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - arrowLength * Math.cos(angle + Math.PI / 6),
        end.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
      break;
  }
  ctx.restore();
}

// Draw text element on canvas
export function drawText(
  ctx: CanvasRenderingContext2D,
  element: any
) {
  if (!element.text || element.text.trim() === '') return;
  
  ctx.save();
  
  // Set font properties
  const fontSize = element.fontSize || 16;
  const fontFamily = element.fontFamily || 'Arial';
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = element.color || '#ffffff';
  ctx.textBaseline = 'top';
  
  // Split text into lines for multiline support
  const lines = element.text.split('\n');
  const lineHeight = fontSize * 1.2;
  
  // Draw each line of text
  lines.forEach((line: string, index: number) => {
    ctx.fillText(
      line,
      element.position.x,
      element.position.y + (index * lineHeight)
    );
  });
  
  // Calculate text dimensions for selection box
  if (element.selected) {
    // Measure the width of the longest line
    const textWidths = lines.map(line => ctx.measureText(line).width);
    const maxWidth = Math.max(...textWidths);
    const textHeight = lines.length * lineHeight;
    
    // Draw selection box
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      element.position.x - 5,
      element.position.y - 5,
      maxWidth + 10,
      textHeight + 10
    );
    ctx.setLineDash([]);
  }
  
  ctx.restore();
}

import { TextElement } from "../../types";

export function drawTextElement(
  ctx: CanvasRenderingContext2D,
  textElement: TextElement,
  isEditing = false,
  cursorPosition = 0,
  showCursor = false,
) {
  ctx.save();

  ctx.font = `${textElement.fontWeight} ${textElement.fontSize}px ${textElement.fontFamily}`;
  ctx.fillStyle = textElement.color;
  ctx.textBaseline = "bottom";

  const lines = textElement.text.split("\n");

  lines.forEach((line, lineIndex) => {
    const y = textElement.position.y + lineIndex * textElement.fontSize * 1.2;
    ctx.fillText(line, textElement.position.x, y);
  });

  // Draw cursor if editing
  if (isEditing && showCursor) {
    drawCursor(ctx, textElement, cursorPosition);
  }

  ctx.restore();
}

function drawCursor(
  ctx: CanvasRenderingContext2D,
  textElement: TextElement,
  cursorPosition: number,
) {
  const lines = textElement.text.split("\n");
  let currentPos = 0;
  let cursorLine = 0;
  let cursorColumn = 0;

  // Find which line and column the cursor is on
  for (let i = 0; i < lines.length; i++) {
    if (currentPos + lines[i].length >= cursorPosition) {
      cursorLine = i;
      cursorColumn = cursorPosition - currentPos;
      break;
    }
    currentPos += lines[i].length + 1;
  }

  // Calculate cursor position
  const textBeforeCursor = lines[cursorLine].substring(0, cursorColumn);
  ctx.font = `${textElement.fontWeight} ${textElement.fontSize}px ${textElement.fontFamily}`;
  const textWidth = ctx.measureText(textBeforeCursor).width;

  const cursorX = textElement.position.x + textWidth;
  const cursorY =
    textElement.position.y + cursorLine * textElement.fontSize * 2.2;

  // Draw cursor line
  ctx.strokeStyle = textElement.color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cursorX, cursorY - textElement.fontSize);
  ctx.lineTo(cursorX, cursorY);
  ctx.stroke();
}

export function getTextBounds(
  ctx: CanvasRenderingContext2D,
  textElement: TextElement,
): { x: number; y: number; width: number; height: number } {
  ctx.save();
  ctx.font = `${textElement.fontWeight} ${textElement.fontSize}px ${textElement.fontFamily}`;

  const lines = textElement.text.split("\n");
  let maxWidth = 0;

  lines.forEach((line) => {
    const width = ctx.measureText(line).width;
    maxWidth = Math.max(maxWidth, width);
  });

  const height = lines.length * textElement.fontSize * 1.2;

  ctx.restore();

  return {
    x: textElement.position.x,
    y: textElement.position.y - textElement.fontSize,
    width: maxWidth,
    height: height,
  };
}

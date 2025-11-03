import { useState, useCallback, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Point, TextElement, SketchCanvasProps } from "../../types";

export function useTextTool(
  {
    activeTool,
    strokeColor,
    textElements = [],
    onTextElementsChange,
  }: SketchCanvasProps,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const getCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Point => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [canvasRef],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (activeTool !== "text") return;

      const point = getCoordinates(e);

      // Check if clicking on existing text
      const clickedText = textElements.find((text) => {
        const canvas = canvasRef.current;
        if (!canvas) return false;

        const ctx = canvas.getContext("2d");
        if (!ctx) return false;

        ctx.font = `${text.fontWeight} ${text.fontSize}px ${text.fontFamily}`;
        const textWidth = ctx.measureText(text.text).width;
        const textHeight = text.fontSize;

        return (
          point.x >= text.position.x &&
          point.x <= text.position.x + textWidth &&
          point.y >= text.position.y - textHeight &&
          point.y <= text.position.y
        );
      });

      if (clickedText) {
        setEditingTextId(clickedText.id);
        setEditingText(clickedText.text);
        setCursorPosition(clickedText.text.length);
      } else {
        const newTextElement: TextElement = {
          id: uuidv4(),
          position: point,
          text: "",
          color: strokeColor,
          fontSize: 42,
          fontFamily: "Arial, sans-serif",
          fontWeight: "normal",
        };

        if (onTextElementsChange) {
          onTextElementsChange([...textElements, newTextElement]);
        }

        setEditingTextId(newTextElement.id);
        setEditingText("");
        setCursorPosition(0);
      }
    },
    [
      activeTool,
      getCoordinates,
      textElements,
      canvasRef,
      strokeColor,
      onTextElementsChange,
    ],
  );

  const updateTextElement = useCallback(
    (id: string, newText: string) => {
      if (onTextElementsChange) {
        onTextElementsChange(
          textElements.map((element) =>
            element.id === id ? { ...element, text: newText } : element,
          ),
        );
      }
    },
    [textElements, onTextElementsChange],
  );

  const deleteTextElement = useCallback(
    (id: string) => {
      if (onTextElementsChange) {
        onTextElementsChange(
          textElements.filter((element) => element.id !== id),
        );
      }
    },
    [textElements, onTextElementsChange],
  );

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!editingTextId || activeTool !== "text") return;

      e.preventDefault();

      if (e.key === "Escape") {
        if (editingText.trim() === "") {
          deleteTextElement(editingTextId);
        }
        setEditingTextId(null);
        setEditingText("");
        setCursorPosition(0);
        return;
      }

      if (e.key === "Enter") {
        if (e.shiftKey) {
          const newText =
            editingText.slice(0, cursorPosition) +
            "\n" +
            editingText.slice(cursorPosition);
          setEditingText(newText);
          setCursorPosition(cursorPosition + 1);
          updateTextElement(editingTextId, newText);
        } else {
          if (editingText.trim() === "") {
            deleteTextElement(editingTextId);
          }
          setEditingTextId(null);
          setEditingText("");
          setCursorPosition(0);
        }
        return;
      }

      if (e.key === "Backspace") {
        if (cursorPosition > 0) {
          const newText =
            editingText.slice(0, cursorPosition - 1) +
            editingText.slice(cursorPosition);
          setEditingText(newText);
          setCursorPosition(cursorPosition - 1);
          updateTextElement(editingTextId, newText);
        }
        return;
      }

      if (e.key === "Delete") {
        if (cursorPosition < editingText.length) {
          const newText =
            editingText.slice(0, cursorPosition) +
            editingText.slice(cursorPosition + 1);
          setEditingText(newText);
          updateTextElement(editingTextId, newText);
        }
        return;
      }

      if (e.key === "ArrowLeft") {
        setCursorPosition(Math.max(0, cursorPosition - 1));
        return;
      }

      if (e.key === "ArrowRight") {
        setCursorPosition(Math.min(editingText.length, cursorPosition + 1));
        return;
      }

      if (e.key.length === 1) {
        const newText =
          editingText.slice(0, cursorPosition) +
          e.key +
          editingText.slice(cursorPosition);
        setEditingText(newText);
        setCursorPosition(cursorPosition + 1);
        updateTextElement(editingTextId, newText);
      }
    },
    [
      editingTextId,
      editingText,
      cursorPosition,
      activeTool,
      updateTextElement,
      deleteTextElement,
    ],
  );

  useEffect(() => {
    if (editingTextId && activeTool === "text") {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [editingTextId, activeTool, handleKeyPress]);

  const getCurrentEditingElement = useCallback(() => {
    if (!editingTextId) return null;
    return textElements.find((el) => el.id === editingTextId) || null;
  }, [editingTextId, textElements]);

  return {
    editingTextId,
    editingText,
    cursorPosition,
    handleClick,
    getCurrentEditingElement,
  };
}

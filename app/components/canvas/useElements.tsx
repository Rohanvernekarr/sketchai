import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Point,
  SystemElement,
  SketchCanvasProps,
  Connection,
} from "../../types";

export function useElements(
  {
    activeTool,
    strokeColor,
    systemElements = [],
    onElementsChange,
    connections = [],
    onConnectionsChange,
  }: SketchCanvasProps,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  drawingHook: any, // Bring in isDrawing to avoid conflicts in handlers
) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  const getCoordinates = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): Point => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [canvasRef],
  );

  // Element selection and creation
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (drawingHook.isDrawing) return;
      const point = getCoordinates(e);

      if (activeTool === "select") {
        const clickedElement = systemElements.find(
          (el) =>
            point.x >= el.position.x &&
            point.x <= el.position.x + el.size.width &&
            point.y >= el.position.y &&
            point.y <= el.position.y + el.size.height,
        );
        if (clickedElement) {
          setSelectedElement(clickedElement.id);
          setDragging(true);
          setDragOffset({
            x: point.x - clickedElement.position.x,
            y: point.y - clickedElement.position.y,
          });
          if (onElementsChange) {
            onElementsChange(
              systemElements.map((el) => ({
                ...el,
                selected: el.id === clickedElement.id,
              })),
            );
          }
        } else {
          setSelectedElement(null);
          if (onElementsChange)
            onElementsChange(
              systemElements.map((el) => ({ ...el, selected: false })),
            );
        }
      } else if (activeTool === "connector") {
        // Connection logic
        const clickedElement = systemElements.find(
          (el) =>
            point.x >= el.position.x &&
            point.x <= el.position.x + el.size.width &&
            point.y >= el.position.y &&
            point.y <= el.position.y + el.size.height,
        );

        if (clickedElement) {
          if (!connectingFrom) {
            // Start connection from this element
            setConnectingFrom(clickedElement.id);
          } else if (connectingFrom !== clickedElement.id) {
            // Complete connection to this element
            const newConnection: Connection = {
              id: uuidv4(),
              from: connectingFrom,
              to: clickedElement.id,
              type: "arrow",
            };

            if (onConnectionsChange) {
              onConnectionsChange([...connections, newConnection]);
            }

            setConnectingFrom(null);
          } else {
            // Clicked same element, cancel connection
            setConnectingFrom(null);
          }
        } else {
          // Clicked empty space, cancel connection
          setConnectingFrom(null);
        }
      } else if (
        ["database", "server", "cloud", "user", "api"].includes(activeTool)
      ) {
        const newElement: SystemElement = {
          id: uuidv4(),
          type: activeTool as any,
          position: { x: point.x - 60, y: point.y - 40 },
          size: { width: 120, height: 80 },
          text: `${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} ${systemElements.length + 1}`,
          color: strokeColor,
          fillColor: "#374151",
          fontSize: 14,
          selected: true,
          connections: [],
        };
        if (onElementsChange) {
          onElementsChange([
            ...systemElements.map((el) => ({ ...el, selected: false })),
            newElement,
          ]);
        }
      }
    },
    [
      activeTool,
      systemElements,
      strokeColor,
      connections,
      connectingFrom,
      getCoordinates,
      onElementsChange,
      onConnectionsChange,
      drawingHook.isDrawing,
    ],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (dragging && selectedElement && onElementsChange) {
        const point = getCoordinates(e);
        const newPosition = {
          x: point.x - dragOffset.x,
          y: point.y - dragOffset.y,
        };
        onElementsChange(
          systemElements.map((el) =>
            el.id === selectedElement ? { ...el, position: newPosition } : el,
          ),
        );
      }
    },
    [
      dragging,
      selectedElement,
      dragOffset,
      onElementsChange,
      systemElements,
      getCoordinates,
    ],
  );

  const handleMouseUp = useCallback(() => setDragging(false), []);

  const cancelConnection = useCallback(() => {
    setConnectingFrom(null);
  }, []);

  return {
    eventHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
    connectingFrom,
    cancelConnection,
  };
}

// sketch-canvas/useTextEditing.tsx
import React, { useState, useCallback } from 'react';
import { SketchCanvasProps } from '../types';

export function useTextEditing({
  systemElements = [],
  onElementsChange
}: SketchCanvasProps) {
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = e.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const clickedElement = systemElements.find(
        el =>
          x >= el.position.x &&
          x <= el.position.x + el.size.width &&
          y >= el.position.y &&
          y <= el.position.y + el.size.height
      );
      if (clickedElement) {
        setEditingElement(clickedElement.id);
        setEditText(clickedElement.text);
      }
    },
    [systemElements]
  );

  const handleTextEdit = useCallback(
    (text: string) => {
      if (editingElement && onElementsChange) {
        onElementsChange(
          systemElements.map(el =>
            el.id === editingElement ? { ...el, text } : el
          )
        );
        setEditingElement(null);
        setEditText('');
      }
    },
    [editingElement, systemElements, onElementsChange]
  );

  function renderOverlay() {
    if (!editingElement) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleTextEdit(editText);
              if (e.key === 'Escape') {
                setEditingElement(null);
                setEditText('');
              }
            }}
            autoFocus
            className="px-3 py-2 border border-gray-300 text-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-500"
            placeholder="Enter text..."
          />
          <div className="mt-2 flex space-x-2">
            <button
              onClick={() => handleTextEdit(editText)}
              className="px-3 py-1 text-black rounded text-sm hover:bg-gray-100"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingElement(null);
                setEditText('');
              }}
              className="px-3 py-1 bg-gray-300 text-black rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return { renderOverlay, handleDoubleClick };
}

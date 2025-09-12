import React, { useState } from 'react';
import IconButton from '../ui/IconButton';
import { BrushType } from '../types';

interface BottomToolbarProps {
  strokeColor: string;
  fillColor?: string;
  strokeWidth: number;
  onColorChange: (color: string) => void;
  onFillColorChange?: (color: string) => void;
  onStrokeWidthChange: (width: number) => void;
  brush?: BrushType;
  onBrushChange?: (brush: BrushType) => void;
  opacity?: number; // 0..1
  onOpacityChange?: (opacity: number) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export default function BottomToolbar({ 
  strokeColor, 
  fillColor,
  strokeWidth,
  onColorChange,
  onFillColorChange,
  onStrokeWidthChange,
  brush = 'pencil',
  onBrushChange,
  opacity = 1,
  onOpacityChange,
  zoom, 
  onZoomChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}: BottomToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeOptions, setShowStrokeOptions] = useState(false);
  
  const colors = [
    '#ffffff', '#000000', '#ff0000', '#00ff00', 
    '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ffa500', '#800080', '#ffc0cb', '#a52a2a'
  ];

  const strokeWidths = [1, 2, 4, 6, 8, 12, 16, 20];
  const brushes: { id: BrushType; label: string }[] = [
    { id: 'pencil', label: 'Pencil' },
    { id: 'marker', label: 'Marker' },
    { id: 'highlighter', label: 'Highlighter' },
    { id: 'calligraphy', label: 'Calligraphy' },
  ];

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-zinc-800 rounded-xl border border-zinc-600 px-4 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm bg-opacity-95">
        
        {/* Drawing Tools */}
        <IconButton 
          icon={(
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          )}
          size="sm"
          tooltip="Pen tool"
        />
        
        <IconButton 
          icon={(
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          )}
          size="sm"
          tooltip="Arrow tool"
        />
        
        <div className="w-px h-6 bg-zinc-600"></div>
        
        {/* Color Picker */}
        <div className="relative">
          <button
            className="w-8 h-6 rounded border-2 border-zinc-500 hover:border-zinc-400 transition-colors"
            style={{ backgroundColor: strokeColor }}
            onClick={() => setShowColorPicker(!showColorPicker)}
          />
          
          {showColorPicker && (
            <div className="absolute bottom-full left-0 mb-2 p-3 bg-zinc-800 border border-zinc-600 rounded-lg shadow-xl">
              <div className="grid grid-cols-4 gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                      strokeColor === color ? 'border-blue-500' : 'border-zinc-600'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      onColorChange(color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
              <input
                type="color"
                value={strokeColor}
                onChange={(e) => onColorChange(e.target.value)}
                className="w-full mt-2 h-8 rounded border border-zinc-600 bg-transparent"
              />
            </div>
          )}
        </div>

        {/* Fill Color */}
        {onFillColorChange && (
          <div className="relative">
            <button
              className="w-6 h-6 rounded border-2 border-zinc-500 hover:border-zinc-400 transition-colors"
              style={{ backgroundColor: fillColor || 'transparent' }}
              onClick={() => onFillColorChange(fillColor ? '' : strokeColor)}
              title="Fill color"
            >
              {!fillColor && <span className="text-red-500 text-xs">×</span>}
            </button>
          </div>
        )}

        {/* Stroke Width */}
        <div className="relative">
          <button
            className="flex items-center gap-1 px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded transition-colors"
            onClick={() => setShowStrokeOptions(!showStrokeOptions)}
          >
            <div
              className="rounded-full bg-white"
              style={{ width: `${Math.min(strokeWidth, 8)}px`, height: `${Math.min(strokeWidth, 8)}px` }}
            />
            <span className="text-xs text-zinc-300">{strokeWidth}px</span>
          </button>
          
          {showStrokeOptions && (
            <div className="absolute bottom\-full left-0 mb-2 p-3 bg-zinc-800 border border-zinc-600 rounded-lg shadow-xl">
              <div className="flex flex-col gap-2">
                {strokeWidths.map(width => (
                  <button
                    key={width}
                    className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-700 transition-colors ${
                      strokeWidth === width ? 'bg-zinc-700' : ''
                    }`}
                    onClick={() => {
                      onStrokeWidthChange(width);
                      setShowStrokeOptions(false);
                    }}
                  >
                    <div
                      className="rounded-full bg-white"
                      style={{ width: `${Math.min(width, 12)}px`, height: `${Math.min(width, 12)}px` }}
                    />
                    <span className="text-xs text-zinc-300">{width}px</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Brush Selector */}
        {onBrushChange && (
          <div className="relative">
            <select
              className="bg-zinc-700 text-xs text-zinc-200 px-2 py-1 rounded hover:bg-zinc-600 focus:outline-none"
              value={brush}
              onChange={(e) => onBrushChange(e.target.value as BrushType)}
              title="Brush type"
            >
              {brushes.map(b => (
                <option key={b.id} value={b.id}>{b.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Opacity */}
        {onOpacityChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Opacity</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            />
            <span className="text-xs text-zinc-300">{Math.round(opacity * 100)}%</span>
          </div>
        )}

        <div className="w-px h-6 bg-zinc-600"></div>

        {/* History Controls */}
        <IconButton
          icon={(
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          )}
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          tooltip="Undo (Ctrl+Z)"
        />

        <IconButton
          icon={(
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
            </svg>
          )}
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          tooltip="Redo (Ctrl+Y)"
        />

        <div className="w-px h-6 bg-zinc-600"></div>
        
        {/* More Options */}
        <IconButton 
          icon="⋯"
          size="sm"
          tooltip="More options"
        />
        
        {/* Zoom Control */}
        <div className="flex items-center gap-2 ml-4">
          <IconButton
            icon={(
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2}/>
                <path d="m21 21-4.35-4.35" strokeWidth={2}/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11h6" />
              </svg>
            )}
            size="sm"
            onClick={() => onZoomChange(Math.max(10, zoom - 10))}
            tooltip="Zoom out"
          />
          
          <button 
            className="text-zinc-300 text-sm hover:text-white transition-colors min-w-[3rem] text-center"
            onClick={() => onZoomChange(100)}
          >
            {Math.round(zoom)}%
          </button>
          
          <IconButton
            icon={(
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth={2}/>
                <path d="m21 21-4.35-4.35" strokeWidth={2}/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 8v6M8 11h6" />
              </svg>
            )}
            size="sm"
            onClick={() => onZoomChange(Math.min(500, zoom + 10))}
            tooltip="Zoom in"
          />
        </div>
      </div>
    </div>
  );
}

import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
  variant?: 'ghost' | 'solid';
  disabled?: boolean;
  tooltip?: string;
}

export default function IconButton({ 
  icon, 
  active = false, 
  onClick, 
  size = 'md',
  variant = 'ghost',
  disabled = false,
  tooltip
}: IconButtonProps) {
  const baseClasses = "relative flex items-center justify-center transition-all duration-300 rounded-xl group overflow-hidden";
  const sizeClasses = size === 'sm' ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-base';
  
  const variantClasses = variant === 'solid' 
    ? 'bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 shadow-lg' 
    : 'hover:bg-slate-700/50 backdrop-blur-sm';
    
  const activeClasses = active 
    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 scale-105' 
    : 'text-slate-300 hover:text-white';
    
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer transform hover:scale-110 active:scale-95';

  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${activeClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
    >
      {/* Hover glow effect */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/0 to-purple-600/0 group-hover:from-indigo-400/20 group-hover:to-purple-600/20 rounded-xl transition-all duration-300"></div>
      )}
      
      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center">
        {icon}
      </div>
      
      {/* Enhanced tooltip */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
          <div className="px-3 py-2 text-xs font-medium bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg shadow-xl border border-slate-600/50 backdrop-blur-sm whitespace-nowrap">
            {tooltip}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-2 h-2 bg-slate-800 rotate-45 border-r border-b border-slate-600/50"></div>
            </div>
          </div>
        </div>
      )}
    </button>
  );
}

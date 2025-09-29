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
  const baseClasses = "flex items-center justify-center transition-all duration-200 rounded relative group";
  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  const variantClasses = variant === 'solid' 
    ? 'bg-black hover:bg-gray-800 border border-white' 
    : 'hover:bg-gray-800';
  const activeClasses = active ? 'bg-white text-black border border-white' : 'text-white';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button 
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${activeClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
    >
      {icon}
      {tooltip && (
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black text-white border border-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {tooltip}
        </span>
      )}
    </button>
  );
}

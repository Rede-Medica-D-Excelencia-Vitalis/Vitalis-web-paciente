import React, { ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, side = 'top' }) => {
  // Define classes de posicionamento conforme o side
  let positionClass = '';
  switch (side) {
    case 'bottom':
      positionClass = 'top-full left-1/2 -translate-x-1/2 mt-2';
      break;
    case 'left':
      positionClass = 'right-full top-1/2 -translate-y-1/2 mr-2';
      break;
    case 'right':
      positionClass = 'left-full top-1/2 -translate-y-1/2 ml-2';
      break;
    case 'top':
    default:
      positionClass = 'bottom-full left-1/2 -translate-x-1/2 mb-2';
  }
  return (
    <span className="relative group">
      {children}
      <span className={`invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute z-10 ${positionClass} px-2 py-1 text-xs text-white bg-black rounded shadow-md whitespace-nowrap pointer-events-none`}>
        {content}
      </span>
    </span>
  );
};

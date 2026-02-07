import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SelectableCardProps {
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function SelectableCard({ 
  selected, 
  onClick, 
  disabled, 
  children, 
  className 
}: SelectableCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={cn(
        "group relative flex flex-col items-center justify-center p-8 rounded-xl border transition-all duration-300 text-center space-y-4 focus:outline-none focus:ring-2 focus:ring-bmn-blue focus:ring-offset-2",
        selected
          ? "border-bmn-blue bg-blue-50/50 shadow-md ring-1 ring-bmn-blue/20"
          : "border-bmn-border bg-white hover:border-bmn-blue/40 hover:shadow-md hover:-translate-y-0.5",
        disabled && "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none",
        className
      )}
    >
      {children}
    </button>
  );
}

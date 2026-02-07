import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureIconProps {
  icon: LucideIcon;
  variant?: 'primary' | 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  gradientId?: string; // Default to "gradient-primary"
}

export function FeatureIcon({ 
  icon: Icon, 
  variant = 'primary', 
  size = 'md', 
  className,
  gradientId = 'gradient-primary'
}: FeatureIconProps) {
  
  // Size mappings
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  // Wrapper variants
  const wrapperVariants = {
    primary: '', // No wrapper bg usually, or handled by parent
    solid: 'bg-bmn-blue text-white rounded-full p-2.5',
    outline: 'bg-gray-100 text-text-secondary rounded-full p-2.5 group-hover:bg-white group-hover:text-bmn-blue transition-colors',
    ghost: 'text-text-secondary',
  };

  // Icon variants (Stroke/Fill)
  const isGradient = variant === 'primary';

  return (
    <div className={cn("inline-flex items-center justify-center", wrapperVariants[variant], className)}>
      <Icon 
        className={cn(sizeClasses[size])}
        stroke={isGradient ? `url(#${gradientId})` : "currentColor"}
      />
    </div>
  );
}

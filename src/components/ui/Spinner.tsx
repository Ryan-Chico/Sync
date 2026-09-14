import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={cn('animate-spin text-blue-600', sizeStyles[size], className)} />
    </div>
  );
}

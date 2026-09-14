import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-4">
          An unexpected error occurred. Please try again.
        </p>
        <p className="text-sm text-gray-400 mb-6 font-mono break-all">
          {message}
        </p>
        <Button onClick={resetErrorBoundary}>
          Try Again
        </Button>
      </div>
    </div>
  );
}

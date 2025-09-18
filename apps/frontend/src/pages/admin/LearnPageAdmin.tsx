import { Suspense, useEffect, useState } from 'react';
import { Spinner } from '@nextui-org/react';
import LearnAdmin from '@/admin/components/LearnAdmin';

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      setHasError(true);
      setError(error.error);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div className="p-4 text-danger-500">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="mb-4">{error?.message || 'An unknown error occurred'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export default function LearnPageAdmin() {
  return (
    <ErrorBoundary>
      <Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <Spinner size="lg" />
          </div>
        }
      >
        <LearnAdmin />
      </Suspense>
    </ErrorBoundary>
  );
}

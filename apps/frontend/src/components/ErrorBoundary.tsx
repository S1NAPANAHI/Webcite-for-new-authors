import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props { 
    children: ReactNode;
    fallback?: ReactNode;
}

interface State { 
    hasError: boolean; 
    error?: Error;
    errorInfo?: any;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        this.setState({ error, errorInfo });
        
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error);
            console.error('Error Info:', errorInfo);
        }
        
        // In production, you might want to log to an error tracking service
        // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <div className="error-icon">
                            <AlertCircle size={48} color="#ef4444" />
                        </div>
                        
                        <h2 className="error-title">Something went wrong</h2>
                        
                        <p className="error-message">
                            We're sorry, but something unexpected happened. This has been logged and we'll look into it.
                        </p>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (Development)</summary>
                                <pre className="error-stack">
                                    {this.state.error.toString()}
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                        
                        <div className="error-actions">
                            <button 
                                className="btn btn-primary"
                                onClick={this.handleRetry}
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>
                            
                            <button 
                                className="btn btn-outline"
                                onClick={() => window.location.reload()}
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                    
                    <style jsx>{`
                        .error-boundary {
                            min-height: 400px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 2rem;
                            background: #fafafa;
                        }
                        
                        .error-boundary-content {
                            max-width: 500px;
                            text-align: center;
                            background: white;
                            padding: 3rem;
                            border-radius: 8px;
                            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        }
                        
                        .error-icon {
                            margin-bottom: 1.5rem;
                        }
                        
                        .error-title {
                            font-size: 1.5rem;
                            font-weight: 600;
                            color: #1f2937;
                            margin-bottom: 1rem;
                        }
                        
                        .error-message {
                            color: #6b7280;
                            margin-bottom: 2rem;
                            line-height: 1.6;
                        }
                        
                        .error-details {
                            margin-bottom: 2rem;
                            text-align: left;
                        }
                        
                        .error-details summary {
                            cursor: pointer;
                            font-weight: 500;
                            margin-bottom: 0.5rem;
                        }
                        
                        .error-stack {
                            background: #f3f4f6;
                            padding: 1rem;
                            border-radius: 4px;
                            font-size: 0.875rem;
                            overflow-x: auto;
                            white-space: pre-wrap;
                        }
                        
                        .error-actions {
                            display: flex;
                            gap: 1rem;
                            justify-content: center;
                        }
                        
                        .btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 0.5rem;
                            padding: 0.75rem 1.5rem;
                            border-radius: 6px;
                            font-weight: 500;
                            text-decoration: none;
                            cursor: pointer;
                            border: 1px solid transparent;
                            transition: all 0.2s;
                        }
                        
                        .btn-primary {
                            background: #3b82f6;
                            color: white;
                            border-color: #3b82f6;
                        }
                        
                        .btn-primary:hover {
                            background: #2563eb;
                            border-color: #2563eb;
                        }
                        
                        .btn-outline {
                            background: transparent;
                            color: #6b7280;
                            border-color: #d1d5db;
                        }
                        
                        .btn-outline:hover {
                            background: #f9fafb;
                            color: #374151;
                        }
                    `}</style>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
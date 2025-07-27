interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
}

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorInfo[] = [];
  private isProcessing = false;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    });
  }

  public handleError(errorInfo: ErrorInfo): void {
    // Add user ID if available
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        errorInfo.userId = userData.id;
      } catch (e) {
        // Ignore parsing errors
      }
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorHandler:', errorInfo);
    }

    // Add to queue for batch processing
    this.errorQueue.push(errorInfo);

    // Process queue if not already processing
    if (!this.isProcessing) {
      this.processErrorQueue();
    }
  }

  private async processErrorQueue(): Promise<void> {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // In production, you would send errors to your error tracking service
      // For now, we'll just log them
      const errors = [...this.errorQueue];
      this.errorQueue = [];

      if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
        // Send to error tracking service (e.g., Sentry, LogRocket, etc.)
        await this.sendErrorsToService(errors);
      }
    } catch (error) {
      console.error('Failed to process error queue:', error);
    } finally {
      this.isProcessing = false;
      
      // Process any new errors that came in while processing
      if (this.errorQueue.length > 0) {
        setTimeout(() => this.processErrorQueue(), 1000);
      }
    }
  }

  private async sendErrorsToService(errors: ErrorInfo[]): Promise<void> {
    // This is where you would integrate with your error tracking service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    
    // For now, we'll just log to console
    console.group('Production Errors');
    errors.forEach(error => {
      console.error(`[${error.timestamp}] ${error.message}`, {
        stack: error.stack,
        userId: error.userId,
        url: error.url,
      });
    });
    console.groupEnd();
  }

  public logUserAction(action: string, data?: unknown): void {
    if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
      // Send analytics data
      console.log('User Action:', { action, data, timestamp: new Date().toISOString() });
    }
  }
}

export const errorHandler = ErrorHandler.getInstance();

// React Error Boundary hook
export const useErrorHandler = () => {
  return {
    handleError: (error: Error, errorInfo?: any) => {
      errorHandler.handleError({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    },
    logUserAction: errorHandler.logUserAction.bind(errorHandler),
  };
}; 
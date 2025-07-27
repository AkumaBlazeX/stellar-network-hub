interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  url: string;
  userAgent: string;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];

  private constructor() {
    this.setupPerformanceMonitoring();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupPerformanceMonitoring(): void {
    // Monitor page load performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.measurePageLoadPerformance();
        }, 0);
      });
    }

    // Monitor API call performance
    this.setupAPIPerformanceMonitoring();
  }

  private measurePageLoadPerformance(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics = [
        { name: 'page_load_time', value: navigation.loadEventEnd - navigation.loadEventStart },
        { name: 'dom_content_loaded', value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart },
        { name: 'first_paint', value: this.getFirstPaint() },
        { name: 'first_contentful_paint', value: this.getFirstContentfulPaint() },
      ];

      metrics.forEach(metric => {
        this.recordMetric(metric.name, metric.value);
      });
    }
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }

  private setupAPIPerformanceMonitoring(): void {
    // Override fetch to monitor API performance
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        this.recordMetric('api_call_duration', endTime - startTime, { url });
        return response;
      } catch (error) {
        const endTime = performance.now();
        this.recordMetric('api_call_error_duration', endTime - startTime, { url, error: (error as Error).message });
        throw error;
      }
    };
  }

  public recordMetric(name: string, value: number, metadata?: unknown): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(metric);

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`Performance Metric - ${name}:`, value, metadata);
    }

    // Send to monitoring service in production
    if (import.meta.env.PROD && import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true') {
      this.sendMetricsToService([metric]);
    }
  }

  private async sendMetricsToService(metrics: PerformanceMetric[]): Promise<void> {
    // In production, send to your monitoring service
    // Example: Google Analytics, DataDog, New Relic, etc.
    
    // For now, just log
    if (metrics.length > 0) {
      console.group('Performance Metrics');
      metrics.forEach(metric => {
        console.log(`[${metric.timestamp}] ${metric.name}: ${metric.value}ms`);
      });
      console.groupEnd();
    }
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public clearMetrics(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  return {
    recordMetric: performanceMonitor.recordMetric.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    clearMetrics: performanceMonitor.clearMetrics.bind(performanceMonitor),
  };
}; 
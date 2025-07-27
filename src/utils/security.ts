// Security utilities for production
export class SecurityUtils {
  // Sanitize user input to prevent XSS
  static sanitizeInput(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Generate secure random string
  static generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Hash sensitive data (client-side hashing for basic protection)
  static async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validate file upload
  static validateFileUpload(file: File, maxSize: number = 5 * 1024 * 1024): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
    }
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Only JPEG, PNG, GIF, and WebP images are allowed');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Rate limiting for API calls
  private static apiCallCounts: Map<string, { count: number; resetTime: number }> = new Map();
  
  static checkRateLimit(key: string, maxCalls: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.apiCallCounts.get(key);
    
    if (!record || now > record.resetTime) {
      this.apiCallCounts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxCalls) {
      return false;
    }
    
    record.count++;
    return true;
  }

  // Content Security Policy headers (for reference)
  static getCSPHeaders(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://d7s6ppdffi.execute-api.us-east-1.amazonaws.com https://d84l1y8p4kdic.cloudfront.net",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }
}

// CSRF protection
export class CSRFProtection {
  private static token: string | null = null;

  static generateToken(): string {
    this.token = SecurityUtils.generateSecureToken();
    return this.token;
  }

  static getToken(): string | null {
    return this.token;
  }

  static validateToken(token: string): boolean {
    return this.token === token;
  }

  static addTokenToHeaders(headers: Headers): void {
    if (this.token) {
      headers.append('X-CSRF-Token', this.token);
    }
  }
} 
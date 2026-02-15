// Base API Service with security features
// Auth tokens stored in memory only - never in localStorage

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Rate limiter
class RateLimiter {
  private timestamps: number[] = [];
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  canProceed(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    if (this.timestamps.length >= this.maxRequests) return false;
    this.timestamps.push(now);
    return true;
  }
}

// Input sanitization
export function sanitizeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

export function validateString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function validateNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

// API Service class
class ApiService {
  private baseUrl: string;
  private authToken: string | null = null; // In-memory only
  private csrfToken: string | null = null;
  private rateLimiter = new RateLimiter(60, 60_000); // 60 req/min

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  setCsrfToken(token: string | null) {
    this.csrfToken = token;
  }

  private buildHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.authToken) headers['Authorization'] = `Bearer ${this.authToken}`;
    if (this.csrfToken) headers['X-CSRF-Token'] = this.csrfToken;
    return headers;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.rateLimiter.canProceed()) {
      throw new ApiError('Rate limit exceeded. Please wait.', 429, 'RATE_LIMITED');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.buildHeaders(), ...(options.headers as Record<string, string>) },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new ApiError(body || response.statusText, response.status);
    }

    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) });
  }

  put<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiService();

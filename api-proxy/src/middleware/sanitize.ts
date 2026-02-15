import { Request, Response, NextFunction } from 'express';
import { redact } from '../lib/redact';

/** Middleware that wraps res.json to auto-redact sensitive fields */
export function sanitizeMiddleware(req: Request, res: Response, next: NextFunction): void {
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    return originalJson(redact(body));
  };
  next();
}

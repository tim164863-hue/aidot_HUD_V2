import { Request, Response, NextFunction } from 'express';

/** Verify Bearer token from Authorization header */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return;
  }

  const token = authHeader.slice(7);
  if (token !== process.env.API_AUTH_TOKEN) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  next();
}

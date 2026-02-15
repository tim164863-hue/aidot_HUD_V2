import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from './middleware/auth';
import { sanitizeMiddleware } from './middleware/sanitize';
import agentsRouter from './routes/agents';
import cronRouter from './routes/cron';
import statsRouter from './routes/stats';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// Security headers
app.use(helmet());
app.disable('x-powered-by');

// Remove Server header
app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
});

// CORS whitelist
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting: 100 req/min per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
}));

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Health endpoint - no auth required
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    version: '1.0.0',
  });
});

// Apply auth + sanitize to all other /api routes
app.use('/api', authMiddleware);
app.use('/api', sanitizeMiddleware);

// Mount routes
app.use('/api/agents', agentsRouter);
app.use('/api/cron', cronRouter);
app.use('/api', statsRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'CORS: Origin not allowed' });
    return;
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`[aidot-hud-v2-api-proxy] Running on port ${PORT}`);
  console.log(`[aidot-hud-v2-api-proxy] Allowed origins: ${allowedOrigins.join(', ')}`);
});

export default app;

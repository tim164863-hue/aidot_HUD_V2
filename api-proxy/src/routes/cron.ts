import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { redact } from '../lib/redact';

const router = Router();

const OPENCLAW_BASE = process.env.OPENCLAW_BASE || '/Users/chiayingchu/.openclaw';
const CRON_JOBS_PATH = path.join(OPENCLAW_BASE, 'cron', 'jobs.json');

function readCronJobs(): Array<Record<string, unknown>> {
  if (!fs.existsSync(CRON_JOBS_PATH)) return [];
  const raw = JSON.parse(fs.readFileSync(CRON_JOBS_PATH, 'utf-8'));
  return raw.jobs || [];
}

/** GET /api/cron/jobs - List all cron jobs */
router.get('/jobs', (req: Request, res: Response) => {
  try {
    const jobs = readCronJobs();
    res.json({ jobs: redact(jobs) as unknown[] });
  } catch (err) {
    console.error('Error reading cron jobs:', err);
    res.status(500).json({ error: 'Failed to read cron jobs' });
  }
});

/** GET /api/cron/jobs/:id - Single job detail */
router.get('/jobs/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const jobs = readCronJobs();
    const job = jobs.find(j => j.id === req.params.id || j.name === req.params.id);
    if (!job) {
      res.status(404).json({ error: 'Cron job not found' });
      return;
    }
    res.json(redact(job));
  } catch (err) {
    console.error('Error reading cron job:', err);
    res.status(500).json({ error: 'Failed to read cron job' });
  }
});

export default router;

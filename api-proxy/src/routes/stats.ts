import { Router, Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { readAgentConfig, readAgentSessions } from '../lib/openclaw-reader';

const router = Router();
const startTime = Date.now();

const OPENCLAW_BASE = process.env.OPENCLAW_BASE || '/Users/chiayingchu/.openclaw';
const CRON_JOBS_PATH = path.join(OPENCLAW_BASE, 'cron', 'jobs.json');

/** GET /api/health */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    version: '1.0.0',
  });
});

/** GET /api/stats - Aggregate stats */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const agents = readAgentConfig();
    const thirtyMinAgo = Date.now() - 30 * 60 * 1000;
    let activeAgents = 0;
    let totalTokens = 0;

    for (const agent of agents) {
      const sessions = readAgentSessions(agent.id);
      const mainKey = `agent:${agent.id}:main`;
      const mainSession = sessions[mainKey];

      if (mainSession?.updatedAt && mainSession.updatedAt > thirtyMinAgo) {
        activeAgents++;
      }

      for (const session of Object.values(sessions)) {
        const usage = session.tokenUsage as Record<string, unknown> | undefined;
        if (usage) {
          for (const val of Object.values(usage)) {
            if (typeof val === 'number') totalTokens += val;
            else if (typeof val === 'object' && val !== null) {
              for (const v of Object.values(val as Record<string, unknown>)) {
                if (typeof v === 'number') totalTokens += v;
              }
            }
          }
        }
      }
    }

    // Read cron from file
    let totalCronJobs = 0;
    let enabledCronJobs = 0;
    const cronLastRunStatuses: string[] = [];

    try {
      if (fs.existsSync(CRON_JOBS_PATH)) {
        const raw = JSON.parse(fs.readFileSync(CRON_JOBS_PATH, 'utf-8'));
        const jobs: Array<Record<string, unknown>> = raw.jobs || [];
        totalCronJobs = jobs.length;
        for (const job of jobs) {
          if (job.enabled !== false) enabledCronJobs++;
          const state = job.state as Record<string, unknown> | undefined;
          if (state?.lastStatus) cronLastRunStatuses.push(state.lastStatus as string);
        }
      }
    } catch {
      // cron file might not exist
    }

    res.json({
      agents: {
        total: agents.length,
        active: activeAgents,
      },
      cron: {
        total: totalCronJobs,
        enabled: enabledCronJobs,
        lastRunStatuses: cronLastRunStatuses,
      },
      tokenUsage: totalTokens,
      uptime: Math.floor((Date.now() - startTime) / 1000),
    });
  } catch (err) {
    console.error('Error computing stats:', err);
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

export default router;

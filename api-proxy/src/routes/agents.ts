import { Router, Request, Response } from 'express';
import {
  readAgentConfig,
  readAgentSessions,
  readAgentIdentity,
  readSessionTranscript,
  findMainSessionId,
  AgentConfig,
} from '../lib/openclaw-reader';

const router = Router();

/** GET /api/agents - List all agents */
router.get('/', (req: Request, res: Response) => {
  try {
    const agents = readAgentConfig();
    const enriched = agents.map((agent: AgentConfig) => {
      const sessions = readAgentSessions(agent.id);
      const mainKey = `agent:${agent.id}:main`;
      const mainSession = sessions[mainKey];

      const lastUpdated = mainSession?.updatedAt;
      const thirtyMinAgo = Date.now() - 30 * 60 * 1000;
      const status = lastUpdated && lastUpdated > thirtyMinAgo ? 'active' : 'idle';

      const { soul } = readAgentIdentity(agent.id);
      const capabilities = soul
        ? soul.split('\n').filter(l => l.startsWith('- ')).slice(0, 10).map(l => l.slice(2).trim())
        : [];

      return {
        id: agent.id,
        name: agent.name,
        model: agent.model,
        identity: agent.identity || null,
        status,
        capabilities,
        lastActive: lastUpdated ? new Date(lastUpdated).toISOString() : null,
        tokenUsage: mainSession?.tokenUsage || null,
      };
    });

    res.json({ agents: enriched });
  } catch (err) {
    console.error('Error reading agents:', err);
    res.status(500).json({ error: 'Failed to read agent data' });
  }
});

/** GET /api/agents/:id - Detailed agent info */
router.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    const agents = readAgentConfig();
    const agent = agents.find(a => a.id === id);
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    const sessions = readAgentSessions(id);
    const { soul, identity } = readAgentIdentity(id);
    const mainKey = `agent:${id}:main`;
    const mainSession = sessions[mainKey];

    res.json({
      id: agent.id,
      name: agent.name,
      model: agent.model,
      identity: agent.identity || null,
      soul,
      identityMd: identity,
      lastActive: mainSession?.updatedAt
        ? new Date(mainSession.updatedAt).toISOString()
        : null,
      tokenUsage: mainSession?.tokenUsage || null,
      sessionCount: Object.keys(sessions).length,
    });
  } catch (err) {
    console.error('Error reading agent detail:', err);
    res.status(500).json({ error: 'Failed to read agent data' });
  }
});

/** GET /api/agents/:id/sessions - List sessions for an agent */
router.get('/:id/sessions', (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    const agents = readAgentConfig();
    if (!agents.find(a => a.id === id)) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    const sessions = readAgentSessions(id);
    const list = Object.entries(sessions).map(([key, session]) => ({
      key,
      sessionId: session.sessionId,
      updatedAt: session.updatedAt ? new Date(session.updatedAt).toISOString() : null,
      channel: session.channel || key.split(':')[0] || null,
      model: session.model || null,
      tokenUsage: session.tokenUsage || null,
    }));

    res.json({ sessions: list });
  } catch (err) {
    console.error('Error reading sessions:', err);
    res.status(500).json({ error: 'Failed to read session data' });
  }
});

/** GET /api/agents/:id/activity - Recent activity from transcripts */
router.get('/:id/activity', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = req.params.id;
    const agents = readAgentConfig();
    if (!agents.find(a => a.id === id)) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    const sessionId = findMainSessionId(id);
    if (!sessionId) {
      res.json({ activity: [] });
      return;
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const entries = await readSessionTranscript(id, sessionId, limit);
    res.json({ activity: entries });
  } catch (err) {
    console.error('Error reading activity:', err);
    res.status(500).json({ error: 'Failed to read activity data' });
  }
});

export default router;

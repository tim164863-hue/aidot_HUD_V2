import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { redact, redactString } from './redact';

const OPENCLAW_BASE = process.env.OPENCLAW_BASE || '/Users/chiayingchu/.openclaw';

/** Prevent directory traversal - validate that resolved path stays within base */
function safePath(base: string, ...segments: string[]): string {
  // Reject any segment with traversal patterns
  for (const seg of segments) {
    if (/[\/\\]/.test(seg) || seg === '..' || seg === '.') {
      throw new Error('Invalid path segment');
    }
  }
  const resolved = path.resolve(base, ...segments);
  if (!resolved.startsWith(path.resolve(base))) {
    throw new Error('Path traversal detected');
  }
  return resolved;
}

export interface AgentConfig {
  id: string;
  name: string;
  model: string;
  workspace?: string;
  identity?: { name?: string; theme?: string };
}

export interface SessionInfo {
  sessionId: string;
  updatedAt: number;
  channel?: string;
  model?: string;
  tokenUsage?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TranscriptEntry {
  timestamp?: string;
  role?: string;
  content?: string;
}

/** Read openclaw.json and extract agent list (redacted) */
export function readAgentConfig(): AgentConfig[] {
  const configPath = path.join(OPENCLAW_BASE, 'openclaw.json');
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const agents: AgentConfig[] = (raw.agents?.list || []).map((a: Record<string, unknown>) => ({
    id: a.id,
    name: a.name,
    model: a.model,
    workspace: a.workspace,
    identity: a.identity,
  }));
  return agents;
}

/** Read full gateway config (redacted) for internal use */
export function readGatewayConfig(): Record<string, unknown> {
  const configPath = path.join(OPENCLAW_BASE, 'openclaw.json');
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return redact(raw) as Record<string, unknown>;
}

/** Read sessions.json for an agent */
export function readAgentSessions(agentId: string): Record<string, SessionInfo> {
  const sessionsPath = safePath(OPENCLAW_BASE, 'agents', agentId, 'sessions', 'sessions.json');
  if (!fs.existsSync(sessionsPath)) return {};
  const raw = JSON.parse(fs.readFileSync(sessionsPath, 'utf-8'));
  return redact(raw) as Record<string, SessionInfo>;
}

/** Read SOUL.md and IDENTITY.md for an agent */
export function readAgentIdentity(agentId: string): { soul: string | null; identity: string | null } {
  const agentBase = safePath(OPENCLAW_BASE, 'agents', agentId);
  const workspacePath = path.join(agentBase, 'workspace');

  let soul: string | null = null;
  let identity: string | null = null;

  const soulPath = path.join(workspacePath, 'SOUL.md');
  if (fs.existsSync(soulPath)) {
    soul = redactString(fs.readFileSync(soulPath, 'utf-8'));
  }

  const identityPath = path.join(workspacePath, 'IDENTITY.md');
  if (fs.existsSync(identityPath)) {
    identity = redactString(fs.readFileSync(identityPath, 'utf-8'));
  }

  return { soul, identity };
}

/** Read last N entries from a session .jsonl transcript */
export async function readSessionTranscript(
  agentId: string,
  sessionId: string,
  limit: number = 20
): Promise<TranscriptEntry[]> {
  const sessionsDir = safePath(OPENCLAW_BASE, 'agents', agentId, 'sessions');
  // Validate sessionId format (UUID)
  if (!/^[a-f0-9-]{36}$/.test(sessionId)) {
    throw new Error('Invalid session ID format');
  }
  const jsonlPath = path.join(sessionsDir, `${sessionId}.jsonl`);
  if (!fs.existsSync(jsonlPath)) return [];

  const entries: TranscriptEntry[] = [];
  const fileStream = fs.createReadStream(jsonlPath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line);
      entries.push(parsed);
    } catch {
      // skip malformed lines
    }
  }

  // Take last N entries and sanitize
  return entries.slice(-limit).map(entry => {
    let content = '';
    if (typeof entry.content === 'string') {
      content = entry.content;
    } else if (entry.content && typeof entry.content === 'object') {
      content = JSON.stringify(entry.content);
    }
    return {
      timestamp: entry.timestamp || (entry as Record<string, unknown>).ts as string || undefined,
      role: entry.role || (entry as Record<string, unknown>).type as string || undefined,
      content: redactString(content.slice(0, 200)),
    };
  });
}

/** Find the main session ID for an agent */
export function findMainSessionId(agentId: string): string | null {
  const sessions = readAgentSessions(agentId);
  const mainKey = `agent:${agentId}:main`;
  const session = sessions[mainKey];
  return session?.sessionId || null;
}

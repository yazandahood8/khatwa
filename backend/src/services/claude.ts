import Anthropic from '@anthropic-ai/sdk';
import { env } from '../utils/env';
import { logger } from '../utils/logger';

/**
 * عميل Claude — Anthropic client (null until ANTHROPIC_API_KEY is set).
 * النموذج الافتراضي claude-sonnet-4-6 (متوازن للتكلفة، حسب خطة المشروع).
 * يمكن التبديل لـ claude-opus-4-8 عبر CLAUDE_MODEL لجودة أعلى.
 */
export const claude = env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  : null;

export const CLAUDE_MODEL = env.CLAUDE_MODEL;
export const isAiConfigured = () => claude !== null;

if (!claude) logger.warn('ANTHROPIC_API_KEY غير مضبوط — AI tutor disabled until set');

/** تكلفة تقريبية بالدولار — rough USD cost per 1M tokens for cost tracking. */
const PRICING: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4-6': { input: 3, output: 15 },
  'claude-opus-4-8': { input: 5, output: 25 },
  'claude-haiku-4-5': { input: 1, output: 5 },
};

export function estimateCostUsd(model: string, inputTokens: number, outputTokens: number): number {
  const p = PRICING[model] ?? PRICING['claude-sonnet-4-6'];
  return (inputTokens * p.input + outputTokens * p.output) / 1_000_000;
}

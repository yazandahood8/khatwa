import type { Difficulty } from './enums';

/** استجابة API موحّدة — Standard API response envelope */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

/** استجابة فحص صحة الخادم — Health check response */
export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  uptime: number;
}

/** خطوة حل واحدة — A single solution step (matches solution_steps) */
export interface SolutionStep {
  step: number;
  description: string;
  expression: string;
  hint: string;
}

/** طريقة حل — A solution method (matches solution_methods) */
export interface SolutionMethod {
  methodId: number;
  name: string;
  recommended: boolean;
  steps: SolutionStep[];
}

/** خطأ شائع — A common mistake (matches common_mistakes) */
export interface CommonMistake {
  mistakeId: number;
  description: string;
  wrongExample: string;
  correction: string;
}

/** بنية المسألة الكاملة — Full problem structure (matches plan section 7) */
export interface Problem {
  problemId: string;
  subject: string;
  grade: number;
  level: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  finalAnswer: string;
  answerTolerance: number;
  knownMethods: SolutionMethod[];
  commonMistakes: CommonMistake[];
  allowFreeMethod: boolean;
}

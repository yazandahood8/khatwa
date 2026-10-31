import { prisma } from './prisma';

/** يوم بصيغة YYYY-MM-DD (UTC) — day key for streak math. */
const dayStr = (d: Date) => d.toISOString().slice(0, 10);

/** يوم محلي بتوقيت إسرائيل — local (Asia/Jerusalem) day key, so "today" resets at local midnight. */
const localDayStr = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(d);

/** يحسب أطول وأحدث سلسلة أيام متتالية — current + best consecutive-day streak. */
function computeStreaks(dates: Date[]): { current: number; best: number } {
  const days = [...new Set(dates.map(dayStr))].sort(); // تصاعدي
  if (days.length === 0) return { current: 0, best: 0 };

  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1] + 'T00:00:00Z').getTime();
    const cur = new Date(days[i] + 'T00:00:00Z').getTime();
    const gap = (cur - prev) / 86_400_000;
    run = gap === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  // السلسلة الحالية: متتالية تنتهي اليوم أو أمس
  const today = dayStr(new Date());
  const yesterday = dayStr(new Date(Date.now() - 86_400_000));
  let current = 0;
  if (days[days.length - 1] === today || days[days.length - 1] === yesterday) {
    current = 1;
    for (let i = days.length - 1; i > 0; i--) {
      const prev = new Date(days[i - 1] + 'T00:00:00Z').getTime();
      const cur = new Date(days[i] + 'T00:00:00Z').getTime();
      if ((cur - prev) / 86_400_000 === 1) current++;
      else break;
    }
  }
  return { current, best };
}

export interface Badge {
  key: string;
  label: string;
  icon: string;
  earned: boolean;
}

export interface StudentStats {
  points: number;
  completedLessons: number;
  inProgressLessons: number;
  problemsAttempted: number;
  problemsSolved: number;
  firstTrySolved: number;
  accuracy: number; // %
  streak: number;
  bestStreak: number;
  studyMinutes: number;
  badges: Badge[];
  week: { completedLessons: number; problemsSolved: number };
  today: { problemsSolved: number };
  difficult: { problemId: string; question: string; attempts: number }[];
}

const WEEK_MS = 7 * 86_400_000;

/** يجمّع كل إحصائيات الطالب — aggregates a student's full stats. */
export async function computeStudentStats(studentId: string): Promise<StudentStats> {
  const weekAgo = new Date(Date.now() - WEEK_MS);

  const [lessonProg, attempts] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { studentId },
      select: { completedAt: true, updatedAt: true, watchTimeSeconds: true },
    }),
    prisma.problemAttempt.findMany({
      where: { studentId },
      select: {
        problemId: true,
        isCorrect: true,
        attemptsCount: true,
        completedAt: true,
        createdAt: true,
        problem: { select: { question: true } },
      },
    }),
  ]);

  const completedLessons = lessonProg.filter((l) => l.completedAt).length;
  const inProgressLessons = lessonProg.length - completedLessons;
  const studyMinutes = Math.round(
    lessonProg.reduce((s, l) => s + l.watchTimeSeconds, 0) / 60,
  );

  const problemsAttempted = attempts.length;
  const solved = attempts.filter((a) => a.isCorrect);
  const problemsSolved = solved.length;
  const firstTrySolved = solved.filter((a) => a.attemptsCount === 1).length;
  const accuracy = problemsAttempted ? Math.round((problemsSolved / problemsAttempted) * 100) : 0;

  const activityDates = [
    ...lessonProg.map((l) => l.updatedAt),
    ...attempts.map((a) => a.createdAt),
  ];
  const { current: streak, best: bestStreak } = computeStreaks(activityDates);

  const points =
    completedLessons * 10 +
    firstTrySolved * 15 +
    (problemsSolved - firstTrySolved) * 8 +
    (bestStreak >= 7 ? 100 : 0);

  const week = {
    completedLessons: lessonProg.filter((l) => l.completedAt && l.completedAt >= weekAgo).length,
    problemsSolved: solved.filter((a) => a.completedAt && a.completedAt >= weekAgo).length,
  };

  const todayKey = localDayStr(new Date());
  const today = {
    problemsSolved: solved.filter((a) => a.completedAt && localDayStr(a.completedAt) === todayKey).length,
  };

  const difficult = attempts
    .filter((a) => a.attemptsCount > 3)
    .slice(0, 5)
    .map((a) => ({ problemId: a.problemId, question: a.problem.question, attempts: a.attemptsCount }));

  const badges: Badge[] = [
    { key: 'first_step', label: 'أول خطوة', icon: '👣', earned: completedLessons >= 1 },
    { key: 'great_solver', label: 'حل ممتاز', icon: '⭐', earned: firstTrySolved >= 5 },
    { key: 'persistent', label: 'مثابر', icon: '🔥', earned: bestStreak >= 7 },
    { key: 'math_genius', label: 'عبقري الرياضيات', icon: '🧠', earned: problemsSolved >= 50 },
  ];

  return {
    points,
    completedLessons,
    inProgressLessons,
    problemsAttempted,
    problemsSolved,
    firstTrySolved,
    accuracy,
    streak,
    bestStreak,
    studyMinutes,
    badges,
    week,
    today,
    difficult,
  };
}

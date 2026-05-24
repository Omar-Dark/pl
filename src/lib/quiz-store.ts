// Per-user quiz attempts stored locally
export interface QuizAttempt {
  quizId: string;
  title: string;
  score: number;
  total: number;
  takenAt: string;
}

const KEY = (userId: string) => `devpath-quiz-attempts-${userId}`;

export function getAttempts(userId: string): QuizAttempt[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY(userId)) || "[]"); } catch { return []; }
}

export function addAttempt(userId: string, attempt: QuizAttempt) {
  const all = getAttempts(userId);
  all.unshift(attempt);
  localStorage.setItem(KEY(userId), JSON.stringify(all.slice(0, 50)));
}

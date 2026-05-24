// Tracks per-user completion of roadmap sections and projects (to avoid double-awarding XP)
const KEY = (userId: string, kind: string) => `devpath-${kind}-${userId}`;

function load(userId: string, kind: string): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY(userId, kind)) || "[]"); } catch { return []; }
}
function save(userId: string, kind: string, ids: string[]) {
  localStorage.setItem(KEY(userId, kind), JSON.stringify(ids));
}

export function isCompleted(userId: string, kind: "section" | "project", id: string) {
  return load(userId, kind).includes(id);
}
export function markCompleted(userId: string, kind: "section" | "project", id: string): boolean {
  const all = load(userId, kind);
  if (all.includes(id)) return false;
  all.push(id);
  save(userId, kind, all);
  return true;
}
export function getCompleted(userId: string, kind: "section" | "project") {
  return load(userId, kind);
}

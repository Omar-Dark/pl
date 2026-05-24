const BASE = "https://roadmap-project-chi.vercel.app";
const KEY = "e7b12f8bf9c4e92b13a45b0d7c9e1b342fc4d8ff6c2a9a1e3b6d91f7c8a12bcd";

// Shared service account used to obtain the JWT cookie required by protected endpoints.
const SERVICE_EMAIL = "devpath@example.com";
const SERVICE_PASSWORD = "DevPath!2026";

let loginPromise: Promise<void> | null = null;
function ensureSession() {
  if (typeof window === "undefined") return Promise.resolve();
  if (loginPromise) return loginPromise;
  loginPromise = (async () => {
    try {
      const r = await fetch(`${BASE}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "x-api-key": KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email: SERVICE_EMAIL, password: SERVICE_PASSWORD }),
      });
      if (!r.ok) {
        // Try to register if login fails, then login again.
        await fetch(`${BASE}/api/v1/auth/signup`, {
          method: "POST",
          credentials: "include",
          headers: { "x-api-key": KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ name: "DevPath", username: "devpath_app", email: SERVICE_EMAIL, password: SERVICE_PASSWORD }),
        });
        await fetch(`${BASE}/api/v1/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: { "x-api-key": KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ email: SERVICE_EMAIL, password: SERVICE_PASSWORD }),
        });
      }
    } catch {
      // swallow — requests will retry as needed
      loginPromise = null;
    }
  })();
  return loginPromise;
}

async function req<T>(path: string): Promise<T> {
  await ensureSession();
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "x-api-key": KEY },
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export interface Resource { _id: string; title: string; url?: string; type?: string }
export interface Section { _id: string; title: string; description?: string; resources?: Resource[] }
export interface Roadmap {
  _id: string;
  title: string;
  description: string;
  sections: string[];
  tags?: string[];
  createdAt: string;
}
export interface Quiz { _id: string; title: string; description: string; rank: string }
export interface Question { _id: string; question: string; options: string[]; answer?: string }

interface PaginatedQuestions { questions: Question[]; mode?: string; page?: number; totalPages?: number }

async function fetchAllQuestions(quizId: string): Promise<Question[]> {
  const first = await req<{ success: boolean } & PaginatedQuestions>(`/api/v1/quiz/${quizId}/questions`);
  const all = [...(first.questions || [])];
  const totalPages = first.totalPages || 1;
  for (let p = 2; p <= totalPages; p++) {
    const next = await req<{ success: boolean } & PaginatedQuestions>(`/api/v1/quiz/${quizId}/questions?page=${p}`);
    all.push(...(next.questions || []));
  }
  return all;
}

export const api = {
  roadmaps: () => req<{ success: boolean; roadmap: Roadmap[] }>("/api/v1/roadmap").then((r) => r.roadmap),
  roadmap: (id: string) => req<{ success: boolean; roadmap: Roadmap }>(`/api/v1/roadmap/${id}`).then((r) => r.roadmap),
  sections: (id: string) =>
    req<{ success: boolean; sections: Section[] }>(`/api/v1/roadmap/${id}/sections`).then((r) => r.sections),
  // Resources are returned inline on each section; this is kept for compatibility.
  resources: async (_sectionId: string): Promise<Resource[]> => [],
  quizzes: () => req<{ success: boolean; quizData: Quiz[] }>("/api/v1/quiz").then((r) => r.quizData),
  questions: fetchAllQuestions,
};

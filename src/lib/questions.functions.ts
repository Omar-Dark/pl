import { createServerFn } from "@tanstack/react-start";

const BASE = "https://roadmap-project-chi.vercel.app";
const KEY = "e7b12f8bf9c4e92b13a45b0d7c9e1b342fc4d8ff6c2a9a1e3b6d91f7c8a12bcd";
const SERVICE_EMAIL = "devpath@example.com";
const SERVICE_PASSWORD = "DevPath!2026";

interface Question { _id: string; question: string; options: string[]; answer?: string }

let cookieJar = "";
let loginPromise: Promise<void> | null = null;

function extractCookies(setCookie: string | null): string {
  if (!setCookie) return "";
  return setCookie.split(/,(?=[^;]+=)/).map((c) => c.split(";")[0].trim()).join("; ");
}

async function login() {
  const tryLogin = async () => {
    const r = await fetch(`${BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "x-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: SERVICE_EMAIL, password: SERVICE_PASSWORD }),
    });
    if (r.ok) {
      cookieJar = extractCookies(r.headers.get("set-cookie"));
      return true;
    }
    return false;
  };
  if (await tryLogin()) return;
  await fetch(`${BASE}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "x-api-key": KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ name: "DevPath", username: "devpath_app", email: SERVICE_EMAIL, password: SERVICE_PASSWORD }),
  });
  await tryLogin();
}

async function ensureSession() {
  if (cookieJar) return;
  if (!loginPromise) loginPromise = login().finally(() => { loginPromise = null; });
  await loginPromise;
}

async function fetchPage(quizId: string, page: number) {
  await ensureSession();
  const url = `${BASE}/api/v1/quiz/${quizId}/questions${page > 1 ? `?page=${page}` : ""}`;
  let res = await fetch(url, { headers: { "x-api-key": KEY, Cookie: cookieJar } });
  if (res.status === 401 || res.status === 403) {
    cookieJar = "";
    await ensureSession();
    res = await fetch(url, { headers: { "x-api-key": KEY, Cookie: cookieJar } });
  }
  if (!res.ok) throw new Error(`Questions ${res.status}`);
  return res.json() as Promise<{ questions: Question[]; totalPages?: number }>;
}

export const fetchQuestions = createServerFn({ method: "GET" })
  .inputValidator((d: { quizId: string }) => d)
  .handler(async ({ data }) => {
    const first = await fetchPage(data.quizId, 1);
    const all = [...(first.questions || [])];
    const totalPages = first.totalPages || 1;
    for (let p = 2; p <= totalPages; p++) {
      const next = await fetchPage(data.quizId, p);
      all.push(...(next.questions || []));
    }
    return { questions: all };
  });

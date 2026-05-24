import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/lib/auth";
import { Avatar } from "@/components/Navbar";
import { api } from "@/lib/api";
import { getAttempts } from "@/lib/quiz-store";
import { MapPin, Github, Award, Flame, Code, Target, Trophy, Pencil, X, Upload } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — DevPath" }] }),
});

const ACHIEVEMENTS = [
  { id: "a1", icon: <Trophy className="h-4 w-4" />, color: "warning", title: "First Project Done", desc: "Completed onboarding" },
  { id: "a2", icon: <Flame className="h-4 w-4" />, color: "destructive", title: "7-Day Streak", desc: "Consistent learning" },
  { id: "a3", icon: <Code className="h-4 w-4" />, color: "primary", title: "Python Pro", desc: "Mastered advanced OOP" },
  { id: "a4", icon: <Target className="h-4 w-4" />, color: "accent", title: "100% Accuracy", desc: "Flawless quiz score" },
];

const CERTS = [
  { id: "c1", title: "Frontend Development Certificate", issued: "Sep 2025" },
  { id: "c2", title: "React Basics", issued: "Nov 2025" },
];

const SKILLS = [
  { name: "JavaScript", v: 85 },
  { name: "CSS", v: 78 },
  { name: "HTML", v: 90 },
  { name: "Python", v: 65 },
  { name: "SQL", v: 72 },
  { name: "Git", v: 80 },
];

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"achievements" | "certificates" | "quiz">("achievements");
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !user) navigate({ to: "/sign-in" });
  }, [user, navigate]);

  if (!user) return null;

  const xp = user.xp;
  const level = Math.floor(xp / 100) + 1;
  const xpToNext = level * 100 - xp;
  const progress = (xp % 100);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Identity card */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="rounded-2xl p-1 bg-gradient-brand shadow-glow">
                <Avatar name={user.fullName} avatar={user.avatar} size="xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold">{user.fullName}</h1>
                    <p className="text-sm text-muted-foreground"><span className="text-primary">{user.username}</span> · Joined {user.joined.slice(0, 7)}</p>
                  </div>
                  <button onClick={() => setEditOpen(true)} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
                    <Pencil className="h-3.5 w-3.5" /> Edit Profile
                  </button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground max-w-2xl">{user.bio || "Tell the community about yourself."}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {user.location && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {user.location}
                    </span>
                  )}
                  {user.github && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                      <Github className="h-3 w-3" /> {user.github}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Level card */}
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="text-sm font-semibold text-accent">Level {level}</div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{level < 3 ? "Novice Developer" : level < 6 ? "Apprentice" : "Master"}</div>
            <div className="mt-5 mx-auto relative h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" stroke="var(--secondary)" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="42" stroke="var(--accent)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${(progress / 100) * 264} 264`} />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div>
                  <div className="text-2xl font-bold">{xp} XP</div>
                  <div className="text-[10px] text-muted-foreground">XP Total</div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{xpToNext} XP to next level</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Tabs */}
          <div className="lg:col-span-2">
            <div className="flex gap-1 border-b border-border">
              {(["achievements", "certificates", "quiz"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`relative px-4 py-2.5 text-sm font-semibold capitalize transition ${tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {t}
                  {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </button>
              ))}
            </div>

            {tab === "achievements" && (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Achievements</h2>
                  <span className="text-xs font-semibold text-accent">4 Unlocked</span>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACHIEVEMENTS.map((a) => (
                    <div key={a.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-lg bg-${a.color}/15 text-${a.color}`} style={{ background: `color-mix(in oklab, var(--${a.color}) 15%, transparent)`, color: `var(--${a.color})` }}>{a.icon}</span>
                      <div>
                        <div className="font-semibold font-mono text-sm">{a.title}</div>
                        <div className="text-xs text-muted-foreground">{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "certificates" && (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Certificates</h2>
                  <span className="text-xs font-semibold text-accent">View all</span>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CERTS.map((c) => (
                    <div key={c.id} className="rounded-xl border border-border bg-card p-4">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="mt-2 font-semibold text-sm">{c.title}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">Issued: {c.issued}</p>
                      <a className="mt-3 inline-block text-xs font-semibold text-primary hover:underline" href="#">View Credential ↗</a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "quiz" && <QuizTab userId={user.id} />}
          </div>

          {/* Right: skills */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-bold">Skill Proficiency</h2>
              <SkillRadar />
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2.5">
              {SKILLS.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between text-xs"><span>{s.name}</span><span className="font-mono text-muted-foreground">{s.v}%</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-rainbow" style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
    </Layout>
  );
}

function SkillRadar() {
  const points = SKILLS.map((s, i) => {
    const a = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
    const r = (s.v / 100) * 70;
    return [80 + Math.cos(a) * r, 80 + Math.sin(a) * r];
  });
  const grid = [0.25, 0.5, 0.75, 1].map((s) =>
    SKILLS.map((_, i) => {
      const a = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
      return [80 + Math.cos(a) * 70 * s, 80 + Math.sin(a) * 70 * s];
    })
  );
  return (
    <div className="mt-3 grid place-items-center">
      <svg viewBox="0 0 160 160" className="w-56 h-56">
        {grid.map((g, i) => (
          <polygon key={i} points={g.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--border)" />
        ))}
        {SKILLS.map((_, i) => {
          const a = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
          return <line key={i} x1="80" y1="80" x2={80 + Math.cos(a) * 70} y2={80 + Math.sin(a) * 70} stroke="var(--border)" />;
        })}
        <polygon points={points.map((p) => p.join(",")).join(" ")} fill="color-mix(in oklab, var(--accent) 25%, transparent)" stroke="var(--accent)" strokeWidth="1.5" />
        {SKILLS.map((s, i) => {
          const a = (Math.PI * 2 * i) / SKILLS.length - Math.PI / 2;
          const x = 80 + Math.cos(a) * 82;
          const y = 80 + Math.sin(a) * 82;
          return <text key={s.name} x={x} y={y} fontSize="7" fill="var(--muted-foreground)" textAnchor="middle" dominantBaseline="middle">{s.name}</text>;
        })}
      </svg>
    </div>
  );
}

function QuizTab({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { data: quizzes, isLoading } = useQuery({ queryKey: ["quizzes"], queryFn: api.quizzes });
  const attempts = useMemo(() => getAttempts(userId), [userId]);

  return (
    <div className="mt-5 space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Recent Quiz Attempts</h2>
          <span className="text-xs text-muted-foreground">{attempts.length} total</span>
        </div>
        <div className="mt-3 space-y-2">
          {attempts.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              No attempts yet. Pick a quiz below to get started.
            </div>
          )}
          {attempts.slice(0, 5).map((a, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{a.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(a.takenAt).toLocaleString()}</div>
              </div>
              <div className={`text-sm font-mono font-bold ${a.score / a.total >= 0.7 ? "text-success" : "text-warning"}`}>{a.score}/{a.total}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold">Take a New Quiz</h2>
        {isLoading && <div className="mt-3 h-24 rounded-xl border border-border bg-card animate-pulse" />}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quizzes?.map((q) => (
            <button key={q._id} onClick={() => navigate({ to: "/quiz/$id", params: { id: q._id } })} className="text-left rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{q.title}</h3>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">{q.rank}</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{q.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    github: user?.github || "",
    avatar: user?.avatar || "",
  });

  if (!user) return null;

  const onFile = (file: File) => {
    const r = new FileReader();
    r.onload = () => setForm((f) => ({ ...f, avatar: r.result as string }));
    r.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">Customize Profile Sandbox</h2>
            <p className="text-xs text-muted-foreground mt-1">These values update all badges and your active workspace environment credentials.</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Display Name"><input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} className="input" /></Field>
          <Field label="Username Handle"><input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} className="input" /></Field>
          <Field label="Short Biography"><textarea rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} className="input resize-none" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Location"><input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="input" /></Field>
            <Field label="GitHub Handle"><input value={form.github} onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))} className="input" /></Field>
          </div>
          <Field label="Profile Picture">
            <label className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3 cursor-pointer hover:bg-secondary/40">
              <Avatar name={form.fullName || user.fullName} avatar={form.avatar} size="md" />
              <div className="text-xs">
                <div className="text-primary font-semibold">Image loaded securely</div>
                <div className="text-muted-foreground">Drag &amp; drop another image or click to replace</div>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            </label>
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border bg-background px-4 py-2 text-sm">Cancel</button>
          <button
            onClick={() => { updateUser(form); onClose(); }}
            className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground"
          >
            Save Changes
          </button>
        </div>
        <style>{`.input { width:100%; border-radius: 0.5rem; background: var(--input); border: 1px solid var(--border); padding: 0.55rem 0.75rem; font-size: 0.875rem; outline: none; color: var(--foreground); } .input:focus { border-color: var(--primary); }`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{label}</div>
      {children}
    </div>
  );
}

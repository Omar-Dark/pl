import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { isCompleted, markCompleted } from "@/lib/progress-store";
import { Folder, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects — DevPath" },
      { name: "description", content: "Hands-on, real-world projects to apply your roadmap skills." },
    ],
  }),
});

function ProjectsPage() {
  // The projects endpoint requires auth; gracefully show derived projects from quizzes/roadmaps for browsing
  const { data: roadmaps } = useQuery({ queryKey: ["roadmaps"], queryFn: api.roadmaps });
  const { data: quizzes } = useQuery({ queryKey: ["quizzes"], queryFn: api.quizzes });

  // Synthesize project ideas from roadmap tags
  const projects = (roadmaps ?? []).flatMap((r) =>
    (r.tags || []).slice(0, 2).map((t, i) => ({
      id: `${r._id}-${i}`,
      title: `${t} Capstone`,
      from: r.title,
      desc: `Build a production-ready ${t} project guided by the ${r.title}.`,
      level: ["Beginner", "Intermediate", "Advanced"][i % 3],
    })),
  );

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Project Workshop</h1>
        <p className="mt-2 text-muted-foreground">Apply what you've learned in real-world, production-ready builds.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!roadmaps && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl border border-border bg-card animate-pulse" />
          ))}
          {projects.slice(0, 12).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        {quizzes && quizzes.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold">Pair with a Quiz</h2>
            <p className="mt-1 text-sm text-muted-foreground">Validate your project skills with a related assessment.</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quizzes.slice(0, 6).map((q) => (
                <div key={q._id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">{q.rank}</span>
                  </div>
                  <h3 className="mt-2 font-semibold">{q.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{q.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

interface ProjectItem { id: string; title: string; from: string; desc: string; level: string }
function ProjectCard({ project: p }: { project: ProjectItem }) {
  const { user, addXp } = useAuth();
  const [done, setDone] = useState(() => (user ? isCompleted(user.id, "project", p.id) : false));
  const complete = () => {
    if (!user || done) return;
    if (markCompleted(user.id, "project", p.id)) {
      addXp(75);
      setDone(true);
    }
  };
  return (
    <div className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent">
          <Folder className="h-5 w-5" />
        </span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{p.level}</span>
      </div>
      <h3 className="mt-4 font-semibold group-hover:text-primary">{p.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.desc}</p>
      <p className="mt-3 text-[11px] text-muted-foreground">From: <span className="text-foreground">{p.from}</span></p>
      {user ? (
        <button
          onClick={complete}
          disabled={done}
          className={`mt-4 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${done ? "bg-success/15 text-success cursor-default" : "bg-primary text-primary-foreground hover:opacity-90"}`}
        >
          {done ? <><CheckCircle2 className="h-3.5 w-3.5" /> Completed (+75 XP)</> : <>Mark complete (+75 XP)</>}
        </button>
      ) : (
        <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          Start project <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { api, type Section } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { isCompleted, markCompleted } from "@/lib/progress-store";
import { ChevronLeft, Circle, CheckCircle2, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/roadmaps/$id")({
  component: RoadmapDetail,
});

function RoadmapDetail() {
  const { id } = Route.useParams();
  const { data: roadmap, isLoading } = useQuery({ queryKey: ["roadmap", id], queryFn: () => api.roadmap(id) });
  const { data: sections } = useQuery({ queryKey: ["sections", id], queryFn: () => api.sections(id), enabled: !!id });

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <Link to="/roadmaps" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> All roadmaps
        </Link>

        {isLoading ? (
          <div className="mt-6 h-32 rounded-xl border border-border bg-card animate-pulse" />
        ) : roadmap ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{roadmap.title}</h1>
            <p className="mt-3 text-muted-foreground">{roadmap.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(roadmap.tags || []).map((t) => (
                <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{t}</span>
              ))}
            </div>
          </div>
        ) : null}

        <h2 className="mt-10 text-xl font-bold">Sections</h2>
        <div className="mt-4 space-y-3">
          {!sections && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl border border-border bg-card animate-pulse" />
          ))}
          {sections?.map((s, i) => (
            <SectionCard key={s._id} index={i + 1} section={s} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

function SectionCard({ index, section }: { index: number; section: Section }) {
  const { user, addXp } = useAuth();
  const [done, setDone] = useState(() => (user ? isCompleted(user.id, "section", section._id) : false));

  const complete = () => {
    if (!user || done) return;
    if (markCompleted(user.id, "section", section._id)) {
      addXp(25);
      setDone(true);
    }
  };

  const resources = section.resources || [];

  return (
    <details className="group rounded-xl border border-border bg-card overflow-hidden">
      <summary className="cursor-pointer list-none p-4 flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary text-xs font-semibold">{index}</span>
        <div className="flex-1 min-w-0">
          <div className="font-semibold">{section.title}</div>
          {section.description && <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{section.description}</div>}
        </div>
        {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
      </summary>
      <div className="border-t border-border p-4 text-sm text-muted-foreground space-y-3">
        {section.description && <p>{section.description}</p>}
        {resources.length === 0 ? (
          <div className="text-xs italic">No resources listed.</div>
        ) : (
          <ul className="space-y-1.5">
            {resources.map((r) => (
              <li key={r._id}>
                <a href={r.url || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                  {r.title} <ExternalLink className="h-3 w-3" />
                </a>
                {r.type && <span className="ml-2 text-[10px] uppercase text-muted-foreground">{r.type}</span>}
              </li>
            ))}
          </ul>
        )}
        {user && (
          <button
            onClick={complete}
            disabled={done}
            className={`mt-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${done ? "bg-success/15 text-success cursor-default" : "bg-primary text-primary-foreground hover:opacity-90"}`}
          >
            {done ? <><CheckCircle2 className="h-3.5 w-3.5" /> Completed (+25 XP)</> : <>Mark as complete (+25 XP)</>}
          </button>
        )}
      </div>
    </details>
  );
}

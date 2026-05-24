import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { api } from "@/lib/api";
import { useState } from "react";
import { Search, BookOpen, Tag } from "lucide-react";

export const Route = createFileRoute("/roadmaps/")({
  component: RoadmapsPage,
  head: () => ({
    meta: [
      { title: "Roadmaps — DevPath" },
      { name: "description", content: "Explore curated learning roadmaps across frontend, backend, DevOps, and more." },
    ],
  }),
});

function RoadmapsPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ["roadmaps"], queryFn: api.roadmaps });
  const [q, setQ] = useState("");
  const list = (data ?? []).filter((r) => r.title.toLowerCase().includes(q.toLowerCase()) || r.description.toLowerCase().includes(q.toLowerCase()));

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Learning Roadmaps</h1>
            <p className="mt-2 text-muted-foreground">Curated paths from foundations to mastery. Powered by industry experts.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-2 border border-border w-full sm:w-72">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search roadmaps..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
        </div>

        {isLoading && <SkeletonGrid />}
        {error && <div className="mt-10 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">Failed to load roadmaps. Please try again.</div>}

        {!isLoading && !error && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((r) => (
              <Link key={r._id} to="/roadmaps/$id" params={{ id: r._id }} className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <span className="text-xs text-muted-foreground">{r.sections?.length ?? 0} sections</span>
                </div>
                <h3 className="mt-4 font-semibold text-lg group-hover:text-primary">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{r.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(r.tags || []).slice(0, 4).map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      <Tag className="h-2.5 w-2.5" />{t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
            {list.length === 0 && <div className="col-span-full rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">No roadmaps match your search.</div>}
          </div>
        )}
      </section>
    </Layout>
  );
}

function SkeletonGrid() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-44 rounded-xl border border-border bg-card animate-pulse" />
      ))}
    </div>
  );
}

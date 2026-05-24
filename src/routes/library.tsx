import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { LIBRARY, LIBRARY_CATEGORIES } from "@/lib/library-data";
import { useState } from "react";
import { Search, BookOpen } from "lucide-react";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
  head: () => ({
    meta: [
      { title: "Library — DevPath" },
      { name: "description", content: "Curated books, articles, videos, and courses to deepen your engineering craft." },
    ],
  }),
});

function LibraryPage() {
  const [cat, setCat] = useState<(typeof LIBRARY_CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");
  const list = LIBRARY.filter((it) => (cat === "All" || it.category === cat) && (it.title.toLowerCase().includes(q.toLowerCase()) || it.topic.toLowerCase().includes(q.toLowerCase())));

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">The Library</h1>
        <p className="mt-2 text-muted-foreground">Hand-picked resources to deepen your craft.</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {LIBRARY_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-2 border border-border w-full sm:w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search library..." className="bg-transparent outline-none text-sm flex-1" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((it) => (
            <article key={it.id} className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition">
              <div className="aspect-[5/3] overflow-hidden bg-secondary">
                <img src={it.cover} alt={it.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">{it.category}</span>
                  <span className="text-[10px] text-muted-foreground">{it.topic}</span>
                </div>
                <h3 className="mt-3 font-semibold leading-snug group-hover:text-primary line-clamp-2">{it.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{it.author}</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{it.description}</p>
              </div>
            </article>
          ))}
          {list.length === 0 && (
            <div className="col-span-full rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
              <BookOpen className="mx-auto h-8 w-8" />
              <p className="mt-2">Nothing here yet — try a different filter.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

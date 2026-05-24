import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Code2, Globe, Zap, Target, Terminal, BookOpen } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — DevPath" },
      { name: "description", content: "Empowering developers through guided paths. We build the structure, tools, and community needed to master complex engineering." },
    ],
  }),
});

const TEAM = [
  { name: "Youssef Zidan", role: "FOUNDER & CEO", initials: "YZ" },
  { name: "Ahmed Waleed", role: "DESIGN LEAD", initials: "AW" },
  { name: "Abraam Michel", role: "HR", initials: "AM" },
  { name: "Ali Mansour", role: "API", initials: "AM" },
  { name: "Omar Mosaad", role: "HEAD OF ENGINEERING", initials: "OM" },
];

function AboutPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">OUR MISSION</span>
          <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight">Empowering developers through<br/>guided paths.</h1>
          <p className="mt-5 mx-auto max-w-2xl text-muted-foreground">
            We believe learning to code shouldn't be a chaotic journey. DevPath provides the structure, tools, and community needed to master complex engineering domains with precision and confidence.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-7">
            <h2 className="text-xl font-bold text-primary">Our Story</h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              DevPath was born in 2022 from a simple frustration: the gap between generic tutorials and professional-grade engineering requirements. Our founders, former lead engineers at top-tier tech firms, realized that modern developers needed more than just syntax — they needed architecture, context, and clear progression.
            </p>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              What started as a collection of internal training docs quickly evolved into an integrated development ecosystem. Today, we serve thousands of developers worldwide, providing a workspace that feels like a high-end IDE while functioning as a comprehensive educational hub.
            </p>
            <Link to="/roadmaps" className="mt-6 inline-flex rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95">
              View Roadmaps
            </Link>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-brand p-6 text-primary-foreground shadow-glow">
              <Terminal className="h-5 w-5 opacity-90" />
              <div className="mt-6 text-2xl font-bold">25M+ Lines of Code</div>
              <p className="mt-2 text-xs text-primary-foreground/80">Compiled and executed within our integrated sandboxes by developers worldwide.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <span className="text-xs font-semibold text-primary">GLOBAL REACH</span>
              <div className="mt-2 text-2xl font-bold flex items-center gap-3">140+ <Globe className="h-5 w-5 text-muted-foreground" /></div>
              <p className="mt-1 text-xs text-muted-foreground">Countries Represented</p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between flex-wrap gap-2">
            <h2 className="text-3xl font-bold">Meet the Team</h2>
            <span className="text-xs font-semibold text-muted-foreground">FOUNDED IN SAN FRANCISCO</span>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TEAM.map((m) => (
              <div key={m.name}>
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-brand grid place-items-center text-3xl font-bold text-primary-foreground shadow-glow">
                  {m.initials}
                </div>
                <div className="mt-3 font-semibold text-sm">{m.name}</div>
                <div className="text-xs font-semibold text-primary mt-0.5">{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: <Code2 className="h-5 w-5" />, title: "Architecture First", body: "We teach patterns, not just syntax. Understanding the 'why' is as important as the 'how'." },
            { icon: <Target className="h-5 w-5" />, title: "Precision Tools", body: "Our built-in IDE and sandbox environments are designed for real-world production performance." },
            { icon: <BookOpen className="h-5 w-5" />, title: "Guided Mastery", body: "Paths are curated by experts to ensure you never hit a wall or learn deprecated technologies." },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-l-4 border-l-primary border-border bg-card p-5">
              <div className="flex items-center gap-2 text-primary">{c.icon}<span className="text-sm font-semibold text-foreground">{c.title}</span></div>
              <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

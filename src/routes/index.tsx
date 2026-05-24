import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ArrowRight, Sparkles, ShieldCheck, Activity, Cloud, MessageSquare, Zap, BookOpen, GitBranch } from "lucide-react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "DevPath — Master the Path to Engineering Excellence" },
      { name: "description", content: "Structured, project-based roadmaps designed by industry experts. Learn algorithms, system design, and full-stack development." },
    ],
  }),
});

function Landing() {
  const { data: roadmaps } = useQuery({ queryKey: ["roadmaps"], queryFn: api.roadmaps });
  const featured = (roadmaps ?? []).slice(0, 3);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "radial-gradient(60% 60% at 50% 0%, color-mix(in oklab, var(--primary) 20%, transparent), transparent)" }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> A NEW PATH TO ENGINEERING
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Master the Path to
            <br />
            <span className="text-gradient-brand">Engineering Excellence</span>
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground">
            Stop wandering through endless tutorials. Follow curated, project-based roadmaps designed by industry experts to take you from hello world to senior engineer.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/sign-up" className="inline-flex items-center gap-2 rounded-md bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="rounded-md border border-border bg-secondary/40 px-5 py-2.5 text-sm font-semibold hover:bg-secondary">
              Meet Our Mission
            </Link>
          </div>

          {/* Code preview card */}
          <div className="mt-12 mx-auto max-w-3xl rounded-2xl border border-border bg-card text-left shadow-glow overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2">
              <span className="h-3 w-3 rounded-full bg-destructive/80" />
              <span className="h-3 w-3 rounded-full bg-warning/80" />
              <span className="h-3 w-3 rounded-full bg-success/80" />
              <span className="ml-3 text-xs text-muted-foreground font-mono">~/devpath/roadmap.ts</span>
            </div>
            <pre className="overflow-x-auto p-5 text-xs sm:text-sm font-mono leading-relaxed text-muted-foreground">
{`// Engineering excellence, one commit at a time
function masterPath(developer) {
  const skills = ['algorithms', 'system-design', 'devops'];

  return skills.reduce((engineer, skill) => {
    engineer.learn(skill)
            .practice({ projects: 'real-world' })
            .level('senior');
    return engineer;
  }, developer);
}

// → Compiled successfully. 0 errors, 0 warnings.`}
            </pre>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Stat n="50,000+" label="Active Students" />
            <Stat n="100+" label="Expert Mentors" />
            <Stat n="500+" label="Real-World Projects" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold tracking-tight">Engineered for Deep Learning</h2>
        <p className="mt-2 text-muted-foreground">The dev tools built by developers, for developers.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Feature
            icon={<GitBranch className="h-5 w-5" />}
            title="Interactive Roadmaps"
            body="Visualize your journey with live linked skills. Jump between modules based on your current skill level and goals."
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Industry Verified"
            body="Earn credentials that matter. Our certifications are backed by performance in real projects."
          />
          <Feature
            icon={<Activity className="h-5 w-5" />}
            title="Visual Data-Driven Growth"
            body="Our skill radar analyzes your code submissions and reports back on your technical depth across different dimensions."
          />
          <Feature
            icon={<Cloud className="h-5 w-5" />}
            title="The Workspace of Tomorrow"
            body="DevPath IDE brings the roadmap, the documentation, and the terminal into a single, cohesive interface."
          />
        </div>
      </section>

      {/* Featured roadmaps */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold">Featured Roadmaps</h2>
            <Link to="/roadmaps" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((r) => (
              <Link key={r._id} to="/roadmaps/$id" params={{ id: r._id }} className="group rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-semibold group-hover:text-primary">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{r.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(r.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <h2 className="text-center text-3xl font-bold">Loved by Developers Worldwide</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">From transitioning juniors to hands-on engineers.</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { q: "I switched to a back-end role thanks to DevPath's project-based learning. The IDE is wild.", who: "Alex Chen" },
            { q: "The skill radar gave me a clear plan on what to learn. I've never had this kind of feedback before.", who: "Sarah Adler" },
            { q: "The roadmaps are the most up-to-date I've seen. They keep up with what the industry actually does.", who: "Marcus Thiam" },
          ].map((t, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-foreground">"{t.q}"</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-primary-foreground">{t.who.split(" ").map((w) => w[0]).join("")}</span>
                <span className="text-xs text-muted-foreground">{t.who}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="rounded-2xl bg-gradient-brand p-8 sm:p-12 text-center shadow-glow">
          <h2 className="text-3xl font-bold text-primary-foreground">Ready to master your path?</h2>
          <p className="mt-3 text-primary-foreground/80">Join over 50,000 developers building the future of software engineering. Start your first roadmap today.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/sign-up" className="rounded-md bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:opacity-90">Start Learning Today</Link>
            <Link to="/roadmaps" className="rounded-md border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10">Request Demo</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-gradient-brand">{n}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <span className="inline-grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">{icon}</span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

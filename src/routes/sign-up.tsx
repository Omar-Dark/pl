import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Code2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/sign-up")({
  component: SignUpPage,
  head: () => ({ meta: [{ title: "Create Account — DevPath" }] }),
});

function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await signUp(name, email, password);
      navigate({ to: "/profile" });
    } catch (e: any) {
      setErr(e.message || "Sign up failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold"><Code2 className="h-5 w-5 text-primary" /> DevPath</Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Platform</Link>
        </div>
      </header>
      <div className="flex-1 grid place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="h-1 rounded-full bg-gradient-rainbow" />
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 rounded-t-none border-t-0">
            <div className="text-center">
              <span className="inline-grid h-10 w-10 place-items-center rounded-lg bg-gradient-brand text-primary-foreground shadow-glow"><Code2 className="h-5 w-5" /></span>
              <h1 className="mt-4 text-2xl font-bold">Create Your Account</h1>
              <p className="mt-1 text-sm text-muted-foreground">Start your engineering journey today.</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <button type="button" className="rounded-md border border-border bg-background py-2 text-sm hover:bg-secondary">Google</button>
              <button type="button" className="rounded-md border border-border bg-background py-2 text-sm hover:bg-secondary">GitHub</button>
            </div>
            <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> Or Email <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Full Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="mt-1.5 w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground">Email Address</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dev@example.com" className="mt-1.5 w-full rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Password</label>
                  <span className="text-[10px] text-muted-foreground">At least 8 characters</span>
                </div>
                <div className="relative mt-1.5">
                  <input type={show ? "text" : "password"} required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-md border border-border bg-input px-3 py-2 pr-9 text-sm outline-none focus:border-primary" />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button disabled={loading} className="w-full rounded-md bg-gradient-brand py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
                {loading ? "Creating..." : "Create Account"}
              </button>
              <p className="text-center text-xs text-muted-foreground">Already have an account? <Link to="/sign-in" className="text-primary font-semibold">Sign In</Link></p>
              <Link to="/" className="block text-center text-xs text-primary font-semibold">Continue as a guest</Link>
            </form>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-card p-4 flex items-start gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary text-xs">DB</span>
            <p className="text-xs text-muted-foreground">Join <b className="text-foreground">50,000+</b> developers shipping better code with our integrated IDE learning paths.</p>
          </div>
        </div>
      </div>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-12 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2026 DevPath IDE. All rights reserved.</span>
          <div className="flex gap-4"><a href="#" className="hover:text-foreground">Privacy Policy</a><a href="#" className="hover:text-foreground">Terms of Service</a><a href="#" className="hover:text-foreground">Cookie Policy</a><a href="#" className="hover:text-foreground">Support</a></div>
        </div>
      </footer>
    </div>
  );
}

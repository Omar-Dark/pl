import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Avatar } from "@/components/Navbar";
import { Shield, Users, Activity, Terminal, Code2, ChevronUp, Trash2, Plus, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — DevPath" }, { name: "robots", content: "noindex" }] }),
});

function AdminPage() {
  const { user, users, promote, remove, addUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!user) navigate({ to: "/sign-in" });
      else if (user.role !== "admin") navigate({ to: "/" });
    }
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const stats = [
    { icon: <Users className="h-4 w-4" />, value: "50,000", label: "Total System Accounts", note: `+${users.length} this session`, color: "primary" },
    { icon: <Terminal className="h-4 w-4" />, value: "2,847", label: "Daily Active Sandbox Instances", note: "↑ 12% from yesterday", color: "success" },
    { icon: <Code2 className="h-4 w-4" />, value: "18", label: "Active API Integrations", note: "3 pending review", color: "accent" },
    { icon: <Activity className="h-4 w-4" />, value: "99.9%", label: "System Health", note: "All services nominal", color: "warning" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 font-bold"><span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-brand text-primary-foreground"><Code2 className="h-3.5 w-3.5" /></span>DevPath</Link>
            <span className="text-muted-foreground">|</span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-warning"><Shield className="h-3.5 w-3.5" /> Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">View Site</Link>
            <button onClick={() => { signOut(); navigate({ to: "/" }); }} className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/20">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Shield className="h-5 w-5 text-warning" /> System Administration</h1>
        <p className="mt-1 text-sm text-muted-foreground">User Management Dashboard — Logged in as <span className="text-warning font-semibold">{user.email}</span></p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-5">
              <span className={`inline-grid h-9 w-9 place-items-center rounded-lg`} style={{ background: `color-mix(in oklab, var(--${s.color}) 15%, transparent)`, color: `var(--${s.color})` }}>
                {s.icon}
              </span>
              <div className="mt-4 text-3xl font-bold">{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
              <div className={`mt-1 text-[11px] font-semibold`} style={{ color: `var(--${s.color})` }}>{s.note}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold">Active User Accounts</h2>
            <span className="text-xs text-muted-foreground">{users.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground bg-secondary/40">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">User ID</th>
                  <th className="text-left px-4 py-3 font-semibold">Profile</th>
                  <th className="text-left px-4 py-3 font-semibold">Full Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Role</th>
                  <th className="text-left px-4 py-3 font-semibold">Joined</th>
                  <th className="text-left px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/30">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{u.id}</td>
                    <td className="px-4 py-3"><Avatar name={u.fullName} avatar={u.avatar} size="sm" /></td>
                    <td className="px-4 py-3 font-semibold">{u.fullName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => promote(u.id)} disabled={u.role === "admin"} className="inline-flex items-center gap-1 rounded-md border border-success/40 bg-success/10 px-2 py-1 text-[11px] text-success hover:bg-success/20 disabled:opacity-40">
                          <ChevronUp className="h-3 w-3" /> Promote
                        </button>
                        <button onClick={() => remove(u.id)} disabled={u.email === "admin@admin.com"} className="inline-flex items-center gap-1 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-[11px] text-destructive hover:bg-destructive/20 disabled:opacity-40">
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-semibold text-primary"><Plus className="h-4 w-4" /> Add User Manually</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" className="rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary" />
            <button
              disabled={!name || !email}
              onClick={() => { addUser(name, email); setName(""); setEmail(""); }}
              className="inline-flex items-center gap-1.5 rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Insert User
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">New users are added with default "User" role. You can promote them from the table above.</p>
        </div>
      </main>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    admin: { bg: "color-mix(in oklab, var(--success) 15%, transparent)", fg: "var(--success)" },
    moderator: { bg: "color-mix(in oklab, var(--warning) 15%, transparent)", fg: "var(--warning)" },
    user: { bg: "color-mix(in oklab, var(--primary) 15%, transparent)", fg: "var(--primary)" },
  };
  const s = map[role] || map.user;
  return <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize" style={{ background: s.bg, color: s.fg }}>{role}</span>;
}

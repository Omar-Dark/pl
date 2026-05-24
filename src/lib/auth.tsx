import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "admin" | "moderator" | "user";
export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  role: Role;
  bio?: string;
  location?: string;
  github?: string;
  avatar?: string;
  joined: string;
  xp: number;
}

interface AuthCtx {
  user: User | null;
  users: User[];
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (fullName: string, email: string, password: string) => Promise<User>;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
  promote: (id: string) => void;
  remove: (id: string) => void;
  addUser: (fullName: string, email: string) => void;
  addXp: (amount: number) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "adminadmin";

const SEED_USERS: User[] = [
  { id: "USR-000", email: ADMIN_EMAIL, fullName: "Admin", username: "@admin", role: "admin", joined: "2026-01-01", xp: 0, bio: "Platform administrator." },
];

function loadUsers(): User[] {
  if (typeof window === "undefined") return SEED_USERS;
  const raw = localStorage.getItem("devpath-users");
  if (!raw) {
    localStorage.setItem("devpath-users", JSON.stringify(SEED_USERS));
    return SEED_USERS;
  }
  try { return JSON.parse(raw); } catch { return SEED_USERS; }
}
function saveUsers(u: User[]) { localStorage.setItem("devpath-users", JSON.stringify(u)); }
function loadPasswords(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem("devpath-pw") || "{}"); } catch { return {}; }
}
function savePasswords(p: Record<string, string>) { localStorage.setItem("devpath-pw", JSON.stringify(p)); }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(loadUsers());
    const sess = localStorage.getItem("devpath-session");
    if (sess) {
      try { setUser(JSON.parse(sess)); } catch { /* ignore */ }
    }
  }, []);

  const persistSession = (u: User | null) => {
    if (u) localStorage.setItem("devpath-session", JSON.stringify(u));
    else localStorage.removeItem("devpath-session");
  };

  const signIn = async (email: string, password: string) => {
    const lcEmail = email.trim().toLowerCase();
    if (lcEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const all = loadUsers();
      let admin = all.find((u) => u.email === ADMIN_EMAIL);
      if (!admin) { admin = SEED_USERS[0]; all.push(admin); saveUsers(all); }
      setUser(admin); setUsers(all); persistSession(admin);
      return admin;
    }
    const pws = loadPasswords();
    const all = loadUsers();
    const found = all.find((u) => u.email.toLowerCase() === lcEmail);
    if (!found || pws[lcEmail] !== password) throw new Error("Invalid email or password");
    setUser(found); persistSession(found);
    return found;
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    const lcEmail = email.trim().toLowerCase();
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    const all = loadUsers();
    if (all.some((u) => u.email.toLowerCase() === lcEmail)) throw new Error("Email already in use");
    const newUser: User = {
      id: `USR-${String(all.length).padStart(3, "0")}`,
      email: lcEmail,
      fullName,
      username: "@" + fullName.toLowerCase().replace(/\s+/g, "_"),
      role: "user",
      joined: new Date().toISOString().slice(0, 10),
      xp: 0,
    };
    const next = [...all, newUser];
    saveUsers(next); setUsers(next);
    const pws = loadPasswords(); pws[lcEmail] = password; savePasswords(pws);
    setUser(newUser); persistSession(newUser);
    return newUser;
  };

  const signOut = () => { setUser(null); persistSession(null); };

  const updateUser = (patch: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...patch };
    const next = loadUsers().map((u) => (u.id === user.id ? updated : u));
    saveUsers(next); setUsers(next); setUser(updated); persistSession(updated);
  };

  const promote = (id: string) => {
    const next = loadUsers().map((u) => {
      if (u.id !== id) return u;
      const order: Role[] = ["user", "moderator", "admin"];
      const idx = order.indexOf(u.role);
      return { ...u, role: order[Math.min(idx + 1, 2)] };
    });
    saveUsers(next); setUsers(next);
    if (user && user.id === id) {
      const me = next.find((u) => u.id === id)!;
      setUser(me); persistSession(me);
    }
  };

  const remove = (id: string) => {
    const target = loadUsers().find((u) => u.id === id);
    if (target?.email === ADMIN_EMAIL) return;
    const next = loadUsers().filter((u) => u.id !== id);
    saveUsers(next); setUsers(next);
  };

  const addUser = (fullName: string, email: string) => {
    const lcEmail = email.trim().toLowerCase();
    const all = loadUsers();
    if (all.some((u) => u.email.toLowerCase() === lcEmail)) return;
    const u: User = {
      id: `USR-${String(all.length).padStart(3, "0")}`,
      email: lcEmail, fullName, username: "@" + fullName.toLowerCase().replace(/\s+/g, "_"),
      role: "user", joined: new Date().toISOString().slice(0, 10), xp: 0,
    };
    const next = [...all, u]; saveUsers(next); setUsers(next);
  };

  const addXp = (amount: number) => {
    if (!user) return;
    updateUser({ xp: user.xp + amount });
  };

  return (
    <Ctx.Provider value={{ user, users, signIn, signUp, signOut, updateUser, promote, remove, addUser, addXp }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};

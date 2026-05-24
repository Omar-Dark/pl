// Dummy library content (user said dummy data is allowed in the library tab only)
export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  category: "Book" | "Article" | "Video" | "Course";
  topic: string;
  description: string;
  url: string;
  cover: string;
}

const palette = ["258 70% 55%", "165 60% 50%", "285 65% 55%", "25 80% 55%", "210 70% 55%", "330 65% 55%"];
const cover = (i: number, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'><defs><linearGradient id='g${i}' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='hsl(${palette[i % palette.length]})'/><stop offset='100%' stop-color='hsl(${palette[(i + 1) % palette.length]})'/></linearGradient></defs><rect width='400' height='240' fill='url(%23g${i})'/><text x='20' y='200' font-family='monospace' font-size='28' font-weight='700' fill='white'>${label}</text></svg>`,
  )}`;

export const LIBRARY: LibraryItem[] = [
  { id: "lib-1", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", category: "Book", topic: "System Design", description: "The big ideas behind reliable, scalable, and maintainable systems.", url: "#", cover: cover(0, "DDIA") },
  { id: "lib-2", title: "You Don't Know JS Yet", author: "Kyle Simpson", category: "Book", topic: "JavaScript", description: "Deep dive into JavaScript core mechanics from scope to async.", url: "#", cover: cover(1, "YDKJS") },
  { id: "lib-3", title: "Clean Architecture", author: "Robert C. Martin", category: "Book", topic: "Architecture", description: "Principles for building software that lasts decades.", url: "#", cover: cover(2, "CLEAN ARCH") },
  { id: "lib-4", title: "Refactoring", author: "Martin Fowler", category: "Book", topic: "Code Quality", description: "Improving the design of existing code, step by step.", url: "#", cover: cover(3, "REFACTOR") },
  { id: "lib-5", title: "The Pragmatic Programmer", author: "Hunt & Thomas", category: "Book", topic: "Craft", description: "Timeless wisdom for writing better software, faster.", url: "#", cover: cover(4, "PRAGMATIC") },
  { id: "lib-6", title: "An Introduction to React Server Components", author: "Dan Abramov", category: "Article", topic: "React", description: "Modern React explained from first principles.", url: "#", cover: cover(5, "RSC") },
  { id: "lib-7", title: "PostgreSQL Performance Tuning", author: "Bruce Momjian", category: "Video", topic: "Databases", description: "Deep dive into Postgres planner and query tuning.", url: "#", cover: cover(0, "PG TUNE") },
  { id: "lib-8", title: "Modern CSS for Dynamic Component-Based Architecture", author: "Stephanie Eckles", category: "Course", topic: "CSS", description: "Container queries, cascade layers, and color spaces in practice.", url: "#", cover: cover(1, "MODERN CSS") },
  { id: "lib-9", title: "Distributed Systems for Fun and Profit", author: "Mikito Takada", category: "Article", topic: "Distributed", description: "A beginner-friendly tour of distributed system fundamentals.", url: "#", cover: cover(2, "DIST SYS") },
  { id: "lib-10", title: "Type-Driven Development with TypeScript", author: "Sandro Maglione", category: "Course", topic: "TypeScript", description: "Modeling your domain with the type system as a compiler-checked spec.", url: "#", cover: cover(3, "TS TYPES") },
  { id: "lib-11", title: "Kubernetes the Hard Way", author: "Kelsey Hightower", category: "Article", topic: "DevOps", description: "Bootstrap Kubernetes from scratch — no shortcuts.", url: "#", cover: cover(4, "K8S HARD") },
  { id: "lib-12", title: "Crafting Interpreters", author: "Robert Nystrom", category: "Book", topic: "Compilers", description: "Build two complete interpreters by hand.", url: "#", cover: cover(5, "INTERPRET") },
];

export const LIBRARY_CATEGORIES = ["All", "Book", "Article", "Video", "Course"] as const;

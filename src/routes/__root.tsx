import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-gradient-brand">404</h1>
        <p className="mt-3 text-muted-foreground">This path doesn't exist on the roadmap.</p>
        <a href="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Go home</a>
      </div>
    </div>
  );
}

function ErrComp({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DevPath — Master the Path to Engineering Excellence" },
      { name: "description", content: "Pathfinder Hub is a web application for exploring roadmaps, projects, and quizzes, with an AI-powered chatbot." },
      { property: "og:title", content: "DevPath — Master the Path to Engineering Excellence" },
      { property: "og:description", content: "Pathfinder Hub is a web application for exploring roadmaps, projects, and quizzes, with an AI-powered chatbot." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "DevPath — Master the Path to Engineering Excellence" },
      { name: "twitter:description", content: "Pathfinder Hub is a web application for exploring roadmaps, projects, and quizzes, with an AI-powered chatbot." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6a3ea416-17a9-42b7-ba5c-d37240827e1d/id-preview-aa81c10c--c1eb88f5-de38-463a-8090-e97917a598cb.lovable.app-1779545004462.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6a3ea416-17a9-42b7-ba5c-d37240827e1d/id-preview-aa81c10c--c1eb88f5-de38-463a-8090-e97917a598cb.lovable.app-1779545004462.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: Shell,
  component: Root,
  notFoundComponent: NotFound,
  errorComponent: ErrComp,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function Root() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

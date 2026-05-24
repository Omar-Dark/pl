import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Chatbot } from "./Chatbot";
import type { ReactNode } from "react";

export function Layout({ children, hideChat = false, hideFooter = false }: { children: ReactNode; hideChat?: boolean; hideFooter?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      {!hideChat && <Chatbot />}
    </div>
  );
}

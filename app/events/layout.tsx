import { GraduationCap } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card px-4 md:px-6 z-10 sticky top-0">
        <div className="mx-auto flex h-14 max-w-6xl items-center">
          <Link
            href="/events"
            className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
          >
            <GraduationCap className="size-5" />
            CertifyPro
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 md:px-6 py-6">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

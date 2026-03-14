import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ui/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Certificate Automation",
  description: "Generate and send certificates for your events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} min-h-screen flex flex-col antialiased`}
      >
        <ConvexClientProvider>
          <header className="border-b bg-card px-4 md:px-6">
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
        </ConvexClientProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}

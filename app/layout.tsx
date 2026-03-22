import type { Metadata } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ui/convex-client-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "CertifyPro | Premium Certificate Automation",
  description: "Generate and send breathtaking certificates instantly. Elevate your event experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${manrope.variable} font-sans min-h-screen antialiased selection:bg-primary/30`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

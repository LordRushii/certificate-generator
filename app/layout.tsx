import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ui/convex-client-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Certificate Automation",
  description: "Certificate Automation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} min-h-[calc(100vh-2rem)] flex flex-col gap-4 antialiased`}
      >
        <ConvexClientProvider>
          <main className=" px-2 md:px-4 grow flex flex-col">{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

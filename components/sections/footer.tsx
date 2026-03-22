import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 py-12 md:py-16">
      <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group opacity-50 hover:opacity-100 transition-opacity">
          <GraduationCap className="size-6 text-foreground" />
          <span className="font-heading font-medium tracking-tight">CertifyPro</span>
        </Link>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-foreground transition-colors">X (Twitter)</Link>
        </div>
      </div>
    </footer>
  );
}

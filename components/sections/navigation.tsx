"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function Navigation() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-background/50 border-b border-white/5"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <motion.div
          whileHover={{ rotate: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <GraduationCap className="size-6 text-foreground group-hover:text-primary transition-colors" />
        </motion.div>
        <span className="font-heading font-bold text-lg tracking-tight">
          CertifyPro
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
        <Link href="#demo" className="hover:text-foreground transition-colors">Demo</Link>
        <Link href="#testimonials" className="hover:text-foreground transition-colors">Customers</Link>
      </div>

      <MagneticButton className="bg-foreground text-background hidden md:block select-none">
        <Link href="/events" className="px-2">Platform Access</Link>
      </MagneticButton>
    </motion.nav>
  );
}

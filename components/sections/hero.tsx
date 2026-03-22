"use client";

import { motion } from "framer-motion";
import { AnimatedText } from "@/components/ui/animated-text";
import { MagneticButton } from "@/components/ui/magnetic-button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden selection:bg-primary/30">
      <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay z-0 pointer-events-none"></div>
      
      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-primary/10 rounded-full blur-[120px] mix-blend-screen z-0 pointer-events-none"></div>

      <div className="container relative z-10 flex flex-col items-center text-center px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-white/90 backdrop-blur-md mb-8 shadow-sm"
        >
          <span className="flex size-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          CertifyPro 2.0 is now live
        </motion.div>

        <AnimatedText
          el="h1"
          text={["Automate credentials.", "Elevate experiences."]}
          className="font-heading text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter leading-[1.05] text-balance mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground font-sans mb-12 text-balance leading-relaxed"
        >
          Generate beautiful, verifiable certificates and dispatch them instantly. Designed for premium events, professional organizations, and creators matching elite standards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <MagneticButton className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg shadow-[0_0_40px_-15px_rgba(255,255,255,0.4)] transition-all duration-300">
            <Link href="/events" className="flex items-center gap-2 group">
              Start Building Free <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </MagneticButton>
          <MagneticButton className="bg-transparent text-foreground border border-border hover:bg-white/5 text-lg transition-colors">
            <Link href="#demo" className="flex items-center gap-2">
              View Interactive Demo
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

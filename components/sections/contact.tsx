"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[3rem] p-8 md:p-16 bg-gradient-to-b from-white/5 to-transparent border border-white/10 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 tracking-tight">Ready to elevate your credentials?</h2>
          <p className="text-muted-foreground text-lg text-balance mb-12 max-w-2xl mx-auto">
            Join the beta and start generating stunning certificates today. Fill out the form below to get instant access to the API and visual builder.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
            <input 
              type="email" 
              required
              placeholder="Enter your email address" 
              className="flex-1 rounded-full px-6 py-4 bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
            />
            <MagneticButton className="bg-primary text-primary-foreground hover:bg-primary/90 py-4 shrink-0 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] min-w-[160px]">
              {status === "idle" && "Request Access"}
              {status === "loading" && "Sending..."}
              {status === "success" && "Check Your Inbox"}
            </MagneticButton>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

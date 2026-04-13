"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, FileText, Send, Loader2 } from "lucide-react";

export function InteractiveDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0) return;
    
    if (step < 3) {
      const timer = setTimeout(() => {
        setStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const reset = setTimeout(() => {
        setStep(0);
      }, 3000);
      return () => clearTimeout(reset);
    }
  }, [step]);

  return (
    <section id="demo" className="py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 tracking-tight">Experience Magic.</h2>
          <p className="text-muted-foreground text-lg text-balance">
            See how fast your data turns into stunning credentials delivered straight to your attendees' inboxes.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
          <div className="flex h-12 items-center border-b border-white/5 px-4 gap-2 bg-black/60">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="mx-auto px-16 py-1 rounded-md bg-white/5 text-xs text-white/40 font-mono">
              app.certifypro.dev
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row h-[500px]">
            {/* Sidebar */}
            <div className="w-full md:w-64 border-r border-white/5 bg-white/5 p-6 flex flex-col justify-center">
              <div className="space-y-6">
                <div onClick={() => step === 0 && setStep(1)} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${step === 0 ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30" : "text-muted-foreground opacity-50"}`}>
                  <FileText className="size-5" />
                  <span className="font-medium">1. Prepare Data</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${step === 1 ? "bg-primary/20 text-primary" : "text-muted-foreground opacity-50"}`}>
                  <Loader2 className={`size-5 ${step === 1 ? "animate-spin" : ""}`} />
                  <span className="font-medium">2. Generating</span>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${step === 2 ? "bg-primary/20 text-primary" : "text-muted-foreground opacity-50"}`}>
                  <Send className={`size-5 ${step === 2 ? "animate-pulse" : ""}`} />
                  <span className="font-medium">3. Dispatching</span>
                </div>
              </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 p-8 md:p-12 flex items-center justify-center relative bg-grid-white/[0.02]">
              {step === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/10">
                    <FileText className="size-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Ready to dispatch?</h3>
                  <p className="text-sm text-muted-foreground mb-6">142 attendees found in dataset.</p>
                  <button onClick={() => setStep(1)} className="px-6 py-2 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors shadow-lg" suppressHydrationWarning>
                    Generate & Send All
                  </button>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <h3 className="text-xl font-medium mb-8">Rendering Certificates...</h3>
                  <div className="relative w-64 h-80 bg-white/10 border border-white/20 rounded-sm shadow-2xl p-4 flex flex-col items-center justify-center overflow-hidden">
                    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                    <div className="w-16 h-16 rounded-full bg-white/20 mb-4 animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-white/20 rounded-full mb-2 animate-pulse"></div>
                    <div className="w-1/2 h-3 bg-white/10 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <h3 className="text-xl font-medium mb-8">Sending Emails via Resend</h3>
                  <div className="flex gap-4">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: -100 }}
                        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                        className="w-12 h-8 bg-white/10 rounded-sm flex items-center justify-center border border-white/20 shadow-lg"
                      >
                        <Send className="size-4 text-primary" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                    className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/50"
                  >
                    <CheckCircle2 className="size-12 text-primary" />
                  </motion.div>
                  <h3 className="text-2xl font-medium mb-2 text-white">All Done!</h3>
                  <p className="text-muted-foreground">142 certificates successfully delivered.</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

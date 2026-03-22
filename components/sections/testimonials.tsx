"use client";

import { motion } from "framer-motion";

export function Testimonials() {
  const testimonials = [
    {
      quote: "CertifyPro cut our post-event admin time by 90%. The certificates look exactly like our premium print versions.",
      author: "Sarah Jenkins",
      title: "VP of Events, TechCorp",
    },
    {
      quote: "The programmatic generation API is flawless. We integrated it into our LMS in an afternoon and never looked back.",
      author: "David Chen",
      title: "CTO, EduFlow",
    },
    {
      quote: "Our attendees love tweeting their certificates now. The pixel-perfect rendering makes a huge difference for our brand.",
      author: "Elena Rodriguez",
      title: "Founder, DesignSummit",
    },
  ];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 skew-y-3 transform origin-bottom-left -z-10" />
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-16 text-center tracking-tight text-balance">
          Trusted by operators who value taste.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 rounded-3xl bg-black/40 backdrop-blur-sm border border-white/10 flex flex-col justify-between hover:bg-black/60 transition-colors shadow-xl"
            >
              <p className="text-lg text-muted-foreground mb-8 text-pretty">"{t.quote}"</p>
              <div>
                <p className="font-medium text-white">{t.author}</p>
                <p className="text-sm text-muted-foreground">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

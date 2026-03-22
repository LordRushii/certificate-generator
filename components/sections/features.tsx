"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Mail, Paintbrush, Layers, CheckCircle } from "lucide-react";

export function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  };

  const features = [
    {
      title: "Pixel-Perfect Generation",
      description: "Our high-fidelity PDF rendering engine ensures every pixel is exactly where it belongs, preserving your meticulous designs.",
      icon: Paintbrush,
      colSpan: "md:col-span-2",
    },
    {
      title: "Bulletproof Delivery",
      description: "Integrated directly with enterprise-grade email APIs to ensure 99.9% inbox placement.",
      icon: Mail,
      colSpan: "md:col-span-1",
    },
    {
      title: "Instant Processing",
      description: "Generate 1,000s of certificates in seconds, not hours. The platform scales effortlessly.",
      icon: Zap,
      colSpan: "md:col-span-1",
    },
    {
      title: "Cryptographic Verification",
      description: "Each certificate is uniquely hashed, providing your attendees with verifiable proof of achievement.",
      icon: Shield,
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-white/[0.02]">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row gap-12 mb-20 items-end">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 tracking-tight">
              Engineered for scale.
              <br />
              <span className="text-muted-foreground">Designed for humans.</span>
            </h2>
          </div>
          <div className="flex-1 text-muted-foreground text-lg text-balance pb-2">
            We stripped away the complexity of traditional certification tools, replacing them with a streamlined, impossibly fast workflow that respects your time and your brand.
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`group p-8 rounded-3xl bg-card border border-border overflow-hidden relative shadow-sm hover:shadow-xl transition-all ${feature.colSpan}`}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:border-primary/30 transition-colors">
                <feature.icon className="size-6 text-foreground group-hover:text-primary transition-colors" />
              </div>
              
              <h3 className="text-2xl font-medium mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-pretty leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

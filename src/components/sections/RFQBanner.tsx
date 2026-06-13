"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, ShieldCheck, Globe } from "lucide-react";
import { Container } from "@/components/ui";
import Link from "next/link";

const USP_ITEMS = [
  {
    icon: Zap,
    title: "24-Hour Quotes",
    desc: "Detailed RFQ responses within one business day",
  },
  {
    icon: ShieldCheck,
    title: "Verified Quality",
    desc: "Every supplier is audited — no compromises",
  },
  {
    icon: Globe,
    title: "PAN India Delivery",
    desc: "From quarry to site across all major cities",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function RFQBanner() {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background — deep dark with faint marble veining */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(135deg, transparent 0%, rgba(139,115,85,0.07) 35%, transparent 65%)",
            "linear-gradient(45deg, transparent 20%, rgba(180,155,120,0.06) 52%, transparent 78%)",
            "linear-gradient(160deg, #0d0d0d 0%, #111111 45%, #0a0a0a 100%)",
          ].join(", "),
        }}
      />

      {/* Ambient orbs */}
      <motion.div
        className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(201,169,97,0.12) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,115,85,0.1) 0%, transparent 65%)",
        }}
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,169,97,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,97,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Eyebrow */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-amber-gold/60" />
            <span className="text-amber-gold font-sans text-xs font-medium uppercase tracking-[0.22em]">
              Ready to Source?
            </span>
            <span className="w-8 h-px bg-amber-gold/60" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={itemVariants}
            className="font-serif font-bold text-stone-light leading-[1.05] mb-6"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}
          >
            Source Your Vision.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #c9a961 0%, #e8dcc4 50%, #c9a961 100%)",
              }}
            >
              On Your Terms.
            </span>
          </motion.h2>

          {/* Sub-copy */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-stone-light/55 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Describe your project, select your preferred stone, and receive competitive quotes
            from verified suppliers — all through our intelligent RFQ builder.
          </motion.p>

          {/* USP row */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
          >
            {USP_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-stone-light/8 bg-stone-light/4 backdrop-blur-sm hover:border-amber-gold/20 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-gold/10 border border-amber-gold/20 flex items-center justify-center">
                  <item.icon size={18} className="text-amber-gold" />
                </div>
                <div className="text-center">
                  <p className="font-serif text-stone-light text-sm font-semibold">
                    {item.title}
                  </p>
                  <p className="font-sans text-stone-light/40 text-xs mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/rfq">
              <motion.button
                whileHover={{ scale: 1.04, x: 3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2.5 px-8 py-4 bg-amber-gold text-stone-950 font-serif font-bold text-base rounded-2xl shadow-[0_4px_24px_rgba(201,169,97,0.35)] hover:bg-amber-gold/90 hover:shadow-[0_6px_32px_rgba(201,169,97,0.45)] transition-all duration-300"
              >
                Start RFQ Builder
                <ArrowRight size={18} />
              </motion.button>
            </Link>

            <Link href="/products">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-8 py-4 border border-stone-light/18 text-stone-light font-sans font-medium text-sm rounded-2xl hover:bg-stone-light/6 hover:border-stone-light/30 transition-all duration-300"
              >
                Browse Catalog
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust footnote */}
          <motion.p
            variants={itemVariants}
            className="font-sans text-stone-light/25 text-xs mt-8 uppercase tracking-[0.15em]"
          >
            Trusted by 500+ architects, designers & contractors across India
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

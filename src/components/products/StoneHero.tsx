"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui";
import type { Stone } from "@/types";

interface StoneHeroProps {
  stone: Stone;
}

export function StoneHero({ stone }: StoneHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-stone-dark/20 to-stone-dark/5 border border-stone-dark/10"
    >
      {/* Background Image Placeholder */}
      <div className="relative h-96 bg-gradient-to-br from-stone-950/30 via-stone-900/20 to-amber-gold/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-gold rounded-full mix-blend-screen blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-bronze-accent rounded-full mix-blend-screen blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative text-center"
        >
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-stone-950 mb-2">
            {stone.name}
          </h2>
          <p className="text-stone-dark/70 font-sans text-lg">
            From {stone.origin}
          </p>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-8 md:p-12">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Badge variant="default">{stone.category}</Badge>
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-gold to-bronze-accent" />
          <span className="text-stone-dark/60 font-sans text-sm">
            {stone.origin}
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-sans text-lg text-stone-dark/80 leading-relaxed max-w-2xl"
        >
          {stone.description}
        </motion.p>
      </div>
    </motion.div>
  );
}

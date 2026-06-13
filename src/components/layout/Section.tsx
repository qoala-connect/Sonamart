"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className = "", id }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      id={id}
      className={`py-16 md:py-24 lg:py-32 ${className}`}
    >
      {children}
    </motion.section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  centered = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${centered ? "text-center" : ""}`}
    >
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-amber-gold font-sans font-medium text-sm uppercase tracking-wider mb-2"
        >
          {subtitle}
        </motion.p>
      )}

      <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-950 mb-4">
        {title}
      </h2>

      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`font-sans text-lg text-stone-dark/70 ${
            centered ? "max-w-2xl mx-auto" : "max-w-3xl"
          }`}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

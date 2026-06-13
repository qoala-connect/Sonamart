"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  tagline: string;
  count: number;
  bg: string;
  accentColor: string;
  textLight: boolean;
  colSpan?: string;
}

const CATEGORIES: Category[] = [
  {
    id: "marble",
    name: "Marble",
    tagline: "Timeless elegance",
    count: 248,
    // Veined marble — layered gradients simulate natural veining
    bg: [
      "linear-gradient(135deg, transparent 0%, rgba(139,115,85,0.08) 35%, transparent 65%)",
      "linear-gradient(45deg, transparent 20%, rgba(180,155,120,0.1) 50%, transparent 75%)",
      "linear-gradient(165deg, #f7f4ef 0%, #ede7de 40%, #e2dbd0 70%, #ede8df 100%)",
    ].join(", "),
    accentColor: "#8b7355",
    textLight: false,
    colSpan: "lg:col-span-2",
  },
  {
    id: "granite",
    name: "Granite",
    tagline: "Enduring strength",
    count: 412,
    // Dark granite with mineral flecks
    bg: [
      "radial-gradient(circle at 25% 30%, rgba(201,169,97,0.14) 0%, transparent 9%)",
      "radial-gradient(circle at 75% 62%, rgba(255,255,255,0.05) 0%, transparent 7%)",
      "radial-gradient(circle at 48% 80%, rgba(139,115,85,0.1) 0%, transparent 11%)",
      "radial-gradient(circle at 85% 20%, rgba(201,169,97,0.08) 0%, transparent 6%)",
      "linear-gradient(140deg, #1d1d1d 0%, #262626 50%, #181818 100%)",
    ].join(", "),
    accentColor: "#c9a961",
    textLight: true,
  },
  {
    id: "quartz",
    name: "Quartz",
    tagline: "Contemporary purity",
    count: 156,
    // Clean engineered quartz
    bg: [
      "linear-gradient(135deg, transparent 0%, rgba(200,190,175,0.12) 30%, transparent 60%)",
      "linear-gradient(160deg, #f2eeea 0%, #e6e0d8 45%, #f0ece4 100%)",
    ].join(", "),
    accentColor: "#8b7355",
    textLight: false,
  },
  {
    id: "sandstone",
    name: "Sandstone",
    tagline: "Warm heritage",
    count: 89,
    // Warm golden sandstone
    bg: [
      "linear-gradient(135deg, transparent 0%, rgba(255,220,100,0.1) 30%, transparent 65%)",
      "linear-gradient(135deg, #d4b06a 0%, #b88940 30%, #e0c080 60%, #9a7030 100%)",
    ].join(", "),
    accentColor: "#f5f3f0",
    textLight: true,
  },
  {
    id: "onyx",
    name: "Onyx",
    tagline: "Rare luxury",
    count: 67,
    // Deep onyx with subtle teal/green undertones
    bg: [
      "radial-gradient(ellipse at 30% 25%, rgba(20,15,50,0.9) 0%, transparent 55%)",
      "radial-gradient(ellipse at 72% 78%, rgba(5,30,15,0.7) 0%, transparent 45%)",
      "linear-gradient(140deg, #0c0c0c 0%, #141414 50%, #080808 100%)",
    ].join(", "),
    accentColor: "#c9a961",
    textLight: true,
    colSpan: "lg:col-span-2",
  },
  {
    id: "other",
    name: "Other Materials",
    tagline: "Unique selections",
    count: 134,
    // Bronze/terracotta
    bg: [
      "linear-gradient(135deg, transparent 0%, rgba(100,70,30,0.15) 35%, transparent 70%)",
      "linear-gradient(140deg, #7a6040 0%, #5e4830 40%, #9a7858 70%, #4e3820 100%)",
    ].join(", "),
    accentColor: "#e8dcc4",
    textLight: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  const textClass = category.textLight ? "text-stone-light" : "text-stone-950";

  return (
    <motion.div variants={cardVariants} className={category.colSpan ?? ""}>
      <Link href={`/products?category=${category.id}`}>
        <motion.div
          className="relative h-60 lg:h-64 rounded-2xl overflow-hidden cursor-pointer group"
          whileHover="hover"
          initial="rest"
        >
          {/* Stone texture background — zooms on hover */}
          <motion.div
            className="absolute inset-0"
            style={{ background: category.bg }}
            variants={{
              rest: { scale: 1 },
              hover: {
                scale: 1.07,
                transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
              },
            }}
          />

          {/* SVG noise overlay for texture depth */}
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
              backgroundSize: "160px 160px",
            }}
          />

          {/* Base tint overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.08)" }}
          />

          {/* Hover darkening */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.28)" }}
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 1, transition: { duration: 0.3 } },
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-5">
            {/* Top row: count badge + arrow */}
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-sans font-medium uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: `1px solid ${category.accentColor}50`,
                  color: category.accentColor,
                  backdropFilter: "blur(4px)",
                }}
              >
                {category.count}+
              </span>

              <motion.div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(4px)",
                }}
                variants={{
                  rest: { opacity: 0, scale: 0.75 },
                  hover: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.25 },
                  },
                }}
              >
                <ArrowUpRight size={13} className="text-white" />
              </motion.div>
            </div>

            {/* Bottom: name + tagline + CTA */}
            <div>
              <motion.p
                className="font-sans text-[11px] mb-1.5 uppercase tracking-[0.15em]"
                style={{ color: `${category.accentColor}bb` }}
                variants={{
                  rest: { opacity: 0.65, y: 4 },
                  hover: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3 },
                  },
                }}
              >
                {category.tagline}
              </motion.p>

              <h3
                className={`font-serif text-2xl font-semibold leading-tight ${textClass}`}
              >
                {category.name}
              </h3>

              <motion.div
                className="flex items-center gap-1.5 mt-2"
                variants={{
                  rest: { opacity: 0, y: 6 },
                  hover: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.28, delay: 0.06 },
                  },
                }}
              >
                <span
                  className="text-xs font-sans font-medium"
                  style={{ color: category.accentColor }}
                >
                  Browse collection
                </span>
                <ArrowUpRight size={11} style={{ color: category.accentColor }} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function CategoryGrid() {
  return (
    <section id="categories" className="py-20 md:py-28 bg-stone-light">
      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14"
        >
          <div>
            <p className="text-amber-gold font-sans text-xs font-medium uppercase tracking-[0.18em] mb-3">
              Stone Collections
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-stone-950 leading-tight">
              Explore by Category
            </h2>
          </div>
          <p className="font-sans text-stone-dark/55 text-base max-w-xs leading-relaxed">
            Six distinct families of natural and engineered stone, each with its own character.
          </p>
        </motion.div>

        {/* Premium card grid — asymmetric layout on lg */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

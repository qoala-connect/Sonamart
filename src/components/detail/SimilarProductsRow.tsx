"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import type { CatalogProduct } from "@/components/catalog/types";

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

// ─── Mini Product Card ─────────────────────────────────────────────────────────
function MiniProductCard({ product, index }: { product: CatalogProduct; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.06 + index * 0.055, duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ scrollSnapAlign: "start" }}
      className="flex-shrink-0 w-52"
    >
      <Link href={`/products/${product.id}`}>
        <motion.div
          className="group bg-white rounded-2xl border border-stone-dark/8 overflow-hidden hover:border-stone-dark/18 hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)] transition-all duration-300 cursor-pointer"
          whileHover="hover"
          initial="rest"
        >
          {/* Stone thumbnail */}
          <div className="relative h-36 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{ background: product.bg }}
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.07, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
              }}
            />
            <div
              className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: NOISE_URI, backgroundSize: "64px 64px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card body */}
          <div className="p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.12em] text-amber-gold">
                {product.materialType}
              </span>
              <span className="text-stone-dark/20 text-xs">·</span>
              <span className="text-[9px] font-sans text-stone-dark/40">
                {product.finish}
              </span>
            </div>
            <h4 className="font-serif text-sm font-semibold text-stone-950 leading-tight mb-2.5 group-hover:text-amber-gold transition-colors duration-200 truncate">
              {product.name}
            </h4>
            <div className="flex items-center justify-between">
              <p className="font-serif text-xs font-semibold text-amber-gold">
                {product.priceRange}
              </p>
              <motion.div
                className="flex items-center gap-0.5 text-[10px] font-sans text-stone-dark/38 group-hover:text-amber-gold transition-colors duration-200"
                variants={{
                  rest: { x: 0 },
                  hover: { x: 2, transition: { duration: 0.2 } },
                }}
              >
                View
                <ArrowUpRight size={10} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Row Component ─────────────────────────────────────────────────────────────
interface SimilarProductsRowProps {
  label: string;
  sublabel?: string;
  products: CatalogProduct[];
  isAI?: boolean;
}

export function SimilarProductsRow({
  label,
  sublabel,
  products,
  isAI = false,
}: SimilarProductsRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollBy(delta: number) {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isAI && (
              <Sparkles size={12} className="text-amber-gold flex-shrink-0" />
            )}
            <p className="text-amber-gold font-sans text-[11px] font-semibold uppercase tracking-[0.16em]">
              {isAI ? "AI Recommendation" : "More Like This"}
            </p>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-950">{label}</h2>
          {sublabel && (
            <p className="font-sans text-sm text-stone-dark/44 mt-0.5">{sublabel}</p>
          )}
        </div>

        {/* Scroll arrows */}
        <div className="flex items-center gap-2 flex-shrink-0 mt-1">
          <motion.button
            onClick={() => scrollBy(-224)}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-dark/10 text-stone-dark/45 hover:border-stone-dark/20 hover:text-stone-dark/75 transition-all"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
          >
            <ChevronLeft size={15} />
          </motion.button>
          <motion.button
            onClick={() => scrollBy(224)}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-dark/10 text-stone-dark/45 hover:border-stone-dark/20 hover:text-stone-dark/75 transition-all"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
          >
            <ChevronRight size={15} />
          </motion.button>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{
          scrollSnapType: "x mandatory",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {products.map((product, i) => (
          <MiniProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CatalogProduct } from "./types";

const STATUS_CONFIG = {
  "in-stock": {
    label: "In Stock",
    icon: CheckCircle2,
    className: "text-emerald-600 border-emerald-500/25 bg-emerald-50",
  },
  limited: {
    label: "Limited",
    icon: AlertCircle,
    className: "text-amber-600 border-amber-500/25 bg-amber-50",
  },
  "pre-order": {
    label: "Pre-Order",
    icon: Clock,
    className: "text-blue-600 border-blue-500/25 bg-blue-50",
  },
};

interface CatalogProductListItemProps {
  product: CatalogProduct;
  index?: number;
  isVisuallySimilar?: boolean;
}

export function CatalogProductListItem({
  product,
  index = 0,
  isVisuallySimilar = false,
}: CatalogProductListItemProps) {
  const status = STATUS_CONFIG[product.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{
        delay: Math.min(index * 0.04, 0.25),
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      layout
    >
      <Link href={`/products/${product.id}`}>
        <motion.div
          className="group flex gap-0 bg-white rounded-2xl border border-stone-dark/8 overflow-hidden hover:border-stone-dark/18 hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer"
          whileHover="hover"
          initial="rest"
        >
          {/* Thumbnail — stone texture square */}
          <div className="relative w-36 md:w-44 flex-shrink-0 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{ background: product.bg }}
              variants={{
                rest: { scale: 1 },
                hover: {
                  scale: 1.06,
                  transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
            />
            {/* Noise texture */}
            <div
              className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
                backgroundSize: "128px 128px",
              }}
            />
            {/* Gradient edge fade into card */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />

            {/* Visually Similar badge */}
            {isVisuallySimilar && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-2.5 left-2.5"
              >
                <span className="flex items-center gap-1 px-2 py-0.5 bg-stone-950/80 border border-amber-gold/40 rounded-full text-[9px] font-sans font-bold text-amber-gold backdrop-blur-sm">
                  <Sparkles size={8} />
                  Match
                </span>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5 min-w-0">
            {/* Main info block */}
            <div className="flex-1 min-w-0">
              {/* Top row: category + status */}
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-amber-gold">
                  {product.materialType}
                </span>
                <span className="text-stone-dark/20 text-xs">·</span>
                <span className="text-[10px] font-sans text-stone-dark/45">
                  {product.category}
                </span>
                <span
                  className={cn(
                    "ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-sans font-semibold",
                    status.className
                  )}
                >
                  <StatusIcon size={9} className="flex-shrink-0" />
                  {status.label}
                </span>
              </div>

              {/* Product name */}
              <h3 className="font-serif text-lg md:text-xl font-semibold text-stone-950 leading-tight mb-2 group-hover:text-amber-gold transition-colors duration-200 truncate">
                {product.name}
              </h3>

              {/* Specs row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-xs font-sans text-stone-dark/50">
                  <MapPin size={10} className="text-amber-gold flex-shrink-0" />
                  {product.location}
                </span>
                <span className="text-stone-dark/20 text-xs">·</span>
                <span className="text-xs font-sans text-stone-dark/45">
                  {product.origin}
                </span>
                <span className="text-stone-dark/20 text-xs">·</span>
                <span className="text-xs font-sans text-stone-dark/45">
                  {product.finish}
                </span>
                <span className="text-stone-dark/20 text-xs">·</span>
                <span className="text-xs font-sans text-stone-dark/45">
                  {product.thickness}
                </span>
              </div>
            </div>

            {/* Right: price + actions */}
            <div className="flex md:flex-col items-center md:items-end gap-3 md:gap-2 md:pl-4 md:border-l md:border-stone-dark/6 flex-shrink-0">
              <div className="md:text-right">
                <p className="text-[9px] font-sans uppercase tracking-[0.12em] text-stone-dark/35 mb-0.5">
                  Price range
                </p>
                <p className="font-serif text-base font-semibold text-amber-gold whitespace-nowrap">
                  {product.priceRange}
                </p>
              </div>

              <div className="flex items-center gap-2 ml-auto md:ml-0">
                <motion.button
                  className="px-3.5 py-1.5 text-xs font-sans font-semibold border border-stone-dark/12 rounded-xl text-stone-dark/65 hover:border-amber-gold/40 hover:text-amber-gold transition-all duration-200"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => e.preventDefault()}
                >
                  Details
                </motion.button>
                <motion.button
                  className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-sans font-semibold bg-stone-950 text-stone-light rounded-xl hover:bg-stone-dark/85 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => e.preventDefault()}
                >
                  Quote
                  <ArrowUpRight size={11} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

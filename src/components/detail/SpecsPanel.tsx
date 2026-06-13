"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Globe, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import type { CatalogProduct } from "@/components/catalog/types";

const STATUS_CFG = {
  "in-stock": {
    label: "In Stock",
    icon: CheckCircle2,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  limited: {
    label: "Limited Stock",
    icon: AlertCircle,
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-600",
    dot: "bg-amber-400",
  },
  "pre-order": {
    label: "Pre-Order",
    icon: Clock,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
} as const;

interface SpecsPanelProps {
  product: CatalogProduct;
}

export function SpecsPanel({ product }: SpecsPanelProps) {
  const status = STATUS_CFG[product.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 }}
    >
      {/* Material · Category breadcrumb */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.18em] text-amber-gold">
          {product.materialType}
        </span>
        <span className="text-stone-dark/25 text-sm">·</span>
        <span className="text-[11px] font-sans text-stone-dark/50">
          {product.category}
        </span>
      </div>

      {/* Product name */}
      <h1 className="font-serif text-3xl md:text-[2.25rem] font-bold text-stone-950 leading-tight mb-4">
        {product.name}
      </h1>

      {/* Location + Origin */}
      <div className="flex items-center gap-4 flex-wrap mb-5">
        <div className="flex items-center gap-1.5 text-sm font-sans text-stone-dark/60">
          <MapPin size={13} className="text-amber-gold flex-shrink-0" />
          <span>{product.location}</span>
        </div>
        <span className="text-stone-dark/20 hidden sm:inline">·</span>
        <div className="flex items-center gap-1.5 text-sm font-sans text-stone-dark/50">
          <Globe size={13} className="text-stone-dark/30 flex-shrink-0" />
          <span>Origin: {product.origin}</span>
        </div>
      </div>

      {/* Availability badge */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border ${status.bg} ${status.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse flex-shrink-0`} />
          <StatusIcon size={13} className={`${status.text} flex-shrink-0`} />
          <span className={`text-xs font-sans font-semibold ${status.text}`}>
            {status.label}
          </span>
        </motion.div>
        <span className="text-[10px] font-sans text-stone-dark/35 italic">
          Verified by Stonamart
        </span>
      </div>

      {/* Price range card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="p-4 bg-cream-100 rounded-2xl border border-stone-dark/7"
      >
        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-stone-dark/38 mb-1">
          Indicative Price Range
        </p>
        <p className="font-serif text-[1.7rem] font-bold text-amber-gold leading-none mb-2">
          {product.priceRange}
        </p>
        <p className="text-[10px] font-sans text-stone-dark/40 leading-relaxed">
          Final pricing depends on quantity, slab size, finish, and installation.
          Submit an inquiry for an exact quotation.
        </p>
      </motion.div>
    </motion.div>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import type { CatalogProduct } from "@/components/catalog/types";

const STATUS_LABEL: Record<string, string> = {
  "in-stock": "In Stock",
  limited: "Limited Stock",
  "pre-order": "Pre-Order",
};

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface SpecRow {
  label: string;
  value: string;
}

interface SpecsTableProps {
  product: CatalogProduct;
}

export function SpecsTable({ product }: SpecsTableProps) {
  const rows: SpecRow[] = [
    { label: "Material Type", value: capitalize(product.materialType) },
    { label: "Color", value: product.color },
    { label: "Finish", value: product.finish },
    { label: "Thickness", value: product.thickness },
    { label: "Standard Dimensions", value: "600 × 600 mm  ·  600 × 1200 mm  ·  Custom cut available" },
    { label: "Origin", value: product.origin },
    { label: "Available City", value: product.location },
    { label: "Application", value: product.category },
    { label: "Availability", value: STATUS_LABEL[product.status] ?? product.status },
    { label: "Price Range", value: product.priceRange },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12 }}
    >
      <div className="mb-5">
        <p className="text-amber-gold font-sans text-[11px] font-semibold uppercase tracking-[0.18em] mb-1">
          Specifications
        </p>
        <h2 className="font-serif text-2xl font-bold text-stone-950">
          Stone Details
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-stone-dark/8 overflow-hidden">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 + i * 0.035, duration: 0.32 }}
            className={`flex items-start gap-4 md:gap-6 px-5 py-3.5 ${
              i < rows.length - 1 ? "border-b border-stone-dark/5" : ""
            } ${i % 2 === 0 ? "bg-cream-50/40" : "bg-white"}`}
          >
            <div className="w-44 flex-shrink-0">
              <span className="text-xs font-sans font-medium text-stone-dark/42">
                {row.label}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-sans font-semibold text-stone-950">
                {row.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

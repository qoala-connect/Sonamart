"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui";
import { MediaGallery } from "./MediaGallery";
import { SpecsPanel } from "./SpecsPanel";
import { ActionStack } from "./ActionStack";
import { SpecsTable } from "./SpecsTable";
import { SimilarProductsRow } from "./SimilarProductsRow";
import { CATALOG_PRODUCTS } from "@/components/catalog/data";
import type { CatalogProduct } from "@/components/catalog/types";

function getSimilarProducts(product: CatalogProduct, count = 8): CatalogProduct[] {
  return CATALOG_PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.materialType === product.materialType || p.category === product.category)
  )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, count);
}

function getAIRecommendedProducts(
  product: CatalogProduct,
  similar: CatalogProduct[],
  count = 8
): CatalogProduct[] {
  const usedIds = new Set([product.id, ...similar.map((p) => p.id)]);
  return CATALOG_PRODUCTS.filter(
    (p) =>
      !usedIds.has(p.id) &&
      (p.color === product.color || p.finish === product.finish)
  )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, count);
}

interface ProductDetailPageProps {
  product: CatalogProduct;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
  const similarProducts = getSimilarProducts(product);
  const aiProducts = getAIRecommendedProducts(product, similarProducts);

  const materialLabel =
    product.materialType.charAt(0).toUpperCase() + product.materialType.slice(1);

  return (
    <>
      {/* ── Breadcrumb bar ── */}
      <div className="bg-stone-950 py-4 border-b border-white/5">
        <Container>
          <div className="flex items-center justify-between">
            <Link href="/products">
              <motion.div
                className="flex items-center gap-2 text-stone-light/55 hover:text-stone-light transition-colors"
                whileHover={{ x: -2 }}
              >
                <ArrowLeft size={14} />
                <span className="text-sm font-sans font-medium">Back to Catalog</span>
              </motion.div>
            </Link>
            <nav className="hidden md:flex items-center gap-1.5 text-[11px] font-sans text-stone-light/28">
              <Link
                href="/"
                className="hover:text-stone-light/55 transition-colors"
              >
                Stonamart
              </Link>
              <span>/</span>
              <Link
                href="/products"
                className="hover:text-stone-light/55 transition-colors"
              >
                Products
              </Link>
              <span>/</span>
              <span className="text-stone-light/55">{product.name}</span>
            </nav>
          </div>
        </Container>
      </div>

      {/* ── Main page body ── */}
      <div className="bg-cream-50 min-h-screen">
        <Container>
          <div className="py-8 md:py-12">

            {/* ── Top grid: Gallery (left) + Specs + Actions (right) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 mb-14">
              {/* Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <MediaGallery product={product} />
              </motion.div>

              {/* Specs + Actions stacked */}
              <div className="flex flex-col gap-6">
                <SpecsPanel product={product} />
                <div className="border-t border-stone-dark/7 pt-5">
                  <ActionStack product={product} />
                </div>
              </div>
            </div>

            {/* ── Specs Table (full width) ── */}
            <div className="mb-14">
              <SpecsTable product={product} />
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-stone-dark/7 mb-12" />

            {/* ── Similar products row ── */}
            {similarProducts.length > 0 && (
              <div className="mb-12">
                <SimilarProductsRow
                  label="Similar Stones"
                  sublabel={`${materialLabel} & ${product.category} alternatives`}
                  products={similarProducts}
                />
              </div>
            )}

            {/* ── AI-recommended row ── */}
            {aiProducts.length > 0 && (
              <div className="mb-8">
                <SimilarProductsRow
                  label="You Might Also Like"
                  sublabel={`Matched on ${product.color.toLowerCase()} tone and ${product.finish.toLowerCase()} finish`}
                  products={aiProducts}
                  isAI
                />
              </div>
            )}

          </div>
        </Container>
      </div>
    </>
  );
}

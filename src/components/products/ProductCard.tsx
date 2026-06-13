"use client";

import { motion } from "framer-motion";
import { Badge, Card, CardContent, CardFooter, Button } from "@/components/ui";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const staggerDelay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: staggerDelay,
        ease: "easeOut",
      }}
      viewport={{ once: true, amount: 0.2 }}
      className="group"
    >
      <Card className="overflow-hidden flex flex-col h-full hover:scale-105 transition-transform duration-500">
        {/* Image */}
        <div className="relative h-64 bg-gradient-to-br from-stone-dark/10 to-stone-dark/5 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-amber-gold/20 to-bronze-accent/10"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Badge
              variant={
                product.status === "in-stock"
                  ? "success"
                  : product.status === "low-stock"
                    ? "warning"
                    : "destructive"
              }
            >
              {product.status === "in-stock"
                ? "In Stock"
                : product.status === "low-stock"
                  ? "Low Stock"
                  : "Pre-Order"}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: staggerDelay + 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="mb-0">
                {product.category}
              </Badge>
              {product.location && (
                <span className="text-xs text-stone-dark/60 font-sans">
                  📍 {product.location}
                </span>
              )}
            </div>

            <h3 className="font-serif text-xl font-semibold text-stone-950 mb-2">
              {product.name}
            </h3>

            <p className="font-sans text-sm text-stone-dark/60 mb-4 line-clamp-2">
              {product.description}
            </p>

            {product.specifications && (
              <div className="space-y-2 text-sm">
                {product.specifications.origin && (
                  <p className="text-stone-dark/70">
                    <span className="font-medium text-stone-dark">Origin:</span>{" "}
                    {product.specifications.origin}
                  </p>
                )}
                {product.specifications.finish && (
                  <p className="text-stone-dark/70">
                    <span className="font-medium text-stone-dark">Finish:</span>{" "}
                    {product.specifications.finish}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold text-amber-gold">
              ₹{(product.price / 100).toFixed(0)}–₹
              {(product.price / 50).toFixed(0)}
            </span>
            <span className="text-stone-dark/60 text-sm font-sans">
              / sq ft
            </span>
          </div>
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="luxury" className="w-full">
              View Details
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

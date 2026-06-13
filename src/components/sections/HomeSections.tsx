"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui";
import { Section, SectionHeader } from "@/components/layout";
import { ProductGrid, StoneHero } from "@/components/products";
import type { Product, Stone } from "@/types";

const featuredStones: Stone[] = [
  {
    id: "1",
    name: "Carrara Marble",
    category: "marble",
    description:
      "Timeless Italian marble featuring soft gray veining on a white background, perfect for luxurious applications.",
    color: "White with gray veining",
    image: "/stones/carrara.jpg",
    origin: "Italy",
  },
  {
    id: "2",
    name: "Black Granite",
    category: "granite",
    description:
      "Premium polished granite offering striking depth and elegance, ideal for modern luxury design.",
    color: "Deep black",
    image: "/stones/black-granite.jpg",
    origin: "Norway",
  },
];

const productShowcase: Product[] = [
  {
    id: "p1",
    name: "Premium Marble Slab",
    category: "marble",
    description:
      "Authentic Carrara marble with exquisite white and gray veining",
    price: 3500,
    minQuantity: 1,
    status: "in-stock",
    location: "Mumbai",
    images: [],
    specifications: {
      origin: "Italy",
      thickness: "2cm",
      finish: "Polished",
      dimensions: '60" x 30"',
    },
  },
  {
    id: "p2",
    name: "Granite Countertop",
    category: "granite",
    description:
      "Durable granite with natural grain patterns and lasting beauty",
    price: 2800,
    minQuantity: 2,
    status: "in-stock",
    location: "Bangalore",
    images: [],
    specifications: {
      origin: "Norway",
      thickness: "1.5cm",
      finish: "Polished",
      dimensions: '48" x 24"',
    },
  },
  {
    id: "p3",
    name: "Quartz Surface",
    category: "quartz",
    description:
      "Engineered quartz offering consistent color and superior durability",
    price: 1950,
    minQuantity: 1,
    status: "low-stock",
    location: "Delhi",
    images: [],
    specifications: {
      origin: "USA",
      thickness: "3cm",
      finish: "Matte",
      dimensions: '55" x 28"',
    },
  },
];

export function HeroSection() {
  return (
    <Section className="bg-gradient-to-b from-cream-100 via-stone-light to-stone-light">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-amber-gold font-sans font-medium text-sm uppercase tracking-wider mb-4"
          >
            Discover Luxury
          </motion.p>

          <h1 className="font-serif text-6xl md:text-7xl font-bold text-stone-950 mb-6 leading-tight">
            Premium Stone
            <br />
            <span className="text-gradient-luxury">Procurement</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-sans text-xl text-stone-dark/70 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Sourcing the world&apos;s finest marble, granite, and quartz for
            discerning designers and architects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-luxury"
            >
              Explore Collection
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline"
            >
              Request Catalog
            </motion.button>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

export function FeaturedSection() {
  return (
    <Section className="bg-stone-light">
      <Container>
        <SectionHeader
          subtitle="Featured Collection"
          title="Discover Exceptional Stones"
          description="Handpicked selections of the world's most luxurious stone materials"
        />

        <div className="space-y-12">
          {featuredStones.map((stone) => (
            <motion.div
              key={stone.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <StoneHero stone={stone} />
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function ProductsSection() {
  return (
    <Section className="bg-cream-100">
      <Container>
        <SectionHeader
          subtitle="Premium Products"
          title="Curated Stone Solutions"
          description="Select from our carefully curated collection of premium stone materials and finishes"
        />

        <ProductGrid products={productShowcase} columns={3} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline"
          >
            View All Products
          </motion.button>
        </motion.div>
      </Container>
    </Section>
  );
}

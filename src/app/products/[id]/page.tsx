import { CATALOG_PRODUCTS } from "@/components/catalog/data";
import { MainLayout } from "@/components/common";
import { ProductDetailPage } from "@/components/detail/ProductDetailPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return CATALOG_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = CATALOG_PRODUCTS.find((p) => p.id === id);
  if (!product) return { title: "Stone Not Found — Stonamart" };
  return {
    title: `${product.name} — Stonamart`,
    description: `Buy ${product.name} — ${product.materialType}, ${product.finish}, ${product.thickness} slab. Available in ${product.location}. Price range: ${product.priceRange}.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = CATALOG_PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <MainLayout>
      <ProductDetailPage product={product} />
    </MainLayout>
  );
}

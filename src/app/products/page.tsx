import { MainLayout } from "@/components/common";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stone Catalog — Stonamart",
  description:
    "Browse 20+ premium marble, granite, quartz, sandstone, and onyx stones. Filter by color, finish, thickness, city, and category.",
};

export default function ProductsPage() {
  return (
    <MainLayout>
      <CatalogPage />
    </MainLayout>
  );
}

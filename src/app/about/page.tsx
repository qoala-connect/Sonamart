import { MainLayout } from "@/components/common";
import { AboutPage } from "@/components/about/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Stonamart",
  description:
    "Stonamart is India's curated premium stone marketplace — connecting architects, designers, and builders with verified stone suppliers across the country.",
};

export default function About() {
  return (
    <MainLayout>
      <AboutPage />
    </MainLayout>
  );
}

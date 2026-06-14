import { AdminPortal } from "@/components/admin/AdminPortal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal — Stonamart",
  description: "Stonamart internal admin console for CRM lead management and quotation generation.",
};

export default function AdminPage() {
  return <AdminPortal />;
}

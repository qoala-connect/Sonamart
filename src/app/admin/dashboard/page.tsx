import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";
import { AdminPortal } from "@/components/admin/AdminPortal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — Stonamart",
};

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?from=/admin/dashboard");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <AdminPortal />;
}

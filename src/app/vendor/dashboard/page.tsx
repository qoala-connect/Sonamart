import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";

export const dynamic = "force-dynamic";
import { MainLayout } from "@/components/common";
import { VendorPortal } from "@/components/vendor/VendorPortal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Dashboard — Stonamart",
};

export default async function VendorDashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?from=/vendor/dashboard");
  }
  if (session.user.role !== "VENDOR") {
    redirect("/");
  }
  if (session.user.status === "INACTIVE") {
    redirect("/suspended");
  }
  if (session.user.status === "PENDING") {
    redirect("/vendor/pending");
  }

  return (
    <MainLayout>
      <VendorPortal />
    </MainLayout>
  );
}

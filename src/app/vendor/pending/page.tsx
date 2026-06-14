import { VendorPendingScreen } from "@/components/auth/VendorPendingScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Under Review — Stonamart",
  description: "Your vendor application is being reviewed by the Stonamart team.",
};

export default function VendorPendingPage() {
  return <VendorPendingScreen />;
}

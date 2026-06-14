import { SuspendedScreen } from "@/components/auth/SuspendedScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Suspended — Stonamart",
};

export default function SuspendedPage() {
  return <SuspendedScreen />;
}

import { AuthLayout } from "@/components/auth/AuthLayout";
import { VendorRegisterForm } from "@/components/auth/VendorRegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Registration — Stonamart",
  description: "Register your stone business on Stonamart and reach thousands of buyers across India.",
};

export default function VendorRegisterPage() {
  return (
    <AuthLayout
      headline={"Reach buyers\nacross India\nwith Stonamart."}
      subline="List your granite, marble, and natural stone inventory and get discovered by architects, designers, and developers who trust Stonamart."
      quote="Your stone finds its buyer when quality meets visibility."
      quoteAttrib="Stonamart Partner Program"
    >
      <VendorRegisterForm />
    </AuthLayout>
  );
}

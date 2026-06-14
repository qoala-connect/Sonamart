import { AuthLayout } from "@/components/auth/AuthLayout";
import { CustomerSignupForm } from "@/components/auth/CustomerSignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — Stonamart",
  description: "Join Stonamart and discover premium natural stone for your home or project.",
};

export default function SignupPage() {
  return (
    <AuthLayout
      headline={"Discover stone\ncurated for\nyour vision."}
      subline="Create a free account and get instant access to India's largest curated stone marketplace — over 200 varieties from 18+ origins."
      quote="Every space deserves a stone that tells a story."
      quoteAttrib="Stonamart"
    >
      <CustomerSignupForm />
    </AuthLayout>
  );
}

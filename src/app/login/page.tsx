import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Stonamart",
  description: "Sign in to your Stonamart account to manage inquiries, orders, and more.",
};

export default function LoginPage() {
  return (
    <AuthLayout
      headline={"India's finest\nstone, delivered\nto your door."}
      subline="From Calacatta Oro to Kashmir White — curated, quality-assured, and always competitively priced."
      quote="Stone is the memory of the earth, shaped by time and perfected by craft."
      quoteAttrib="Stonamart Philosophy"
    >
      <LoginForm />
    </AuthLayout>
  );
}

"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { customerSignupAction } from "@/lib/auth-actions";
import {
  FormField,
  AuthInput,
  AuthSelect,
  SubmitButton,
  AuthDivider,
} from "./AuthLayout";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
  "Kochi", "Chandigarh", "Indore", "Lucknow", "Nagpur",
];

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="flex items-center gap-3 flex-wrap mt-1.5">
      {checks.map((c) => (
        <div key={c.label} className="flex items-center gap-1">
          <CheckCircle2
            size={11}
            className={c.pass ? "text-emerald-500" : "text-stone-dark/20"}
          />
          <span className={`text-[10.5px] font-sans ${c.pass ? "text-emerald-600" : "text-stone-dark/35"}`}>
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function SubmitRow() {
  const { pending } = useFormStatus();
  return (
    <SubmitButton
      pending={pending}
      label="Create Account"
      pendingLabel="Creating account…"
    />
  );
}

export function CustomerSignupForm() {
  const [state, formAction] = useActionState(customerSignupAction, {});
  const [showPw, setShowPw] = React.useState(false);
  const [password, setPassword] = React.useState("");

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h2 className="font-serif text-[1.75rem] font-bold text-stone-950 leading-tight">
          Create your account
        </h2>
        <p className="mt-1.5 font-sans text-[13.5px] text-stone-dark/50">
          Join Stonamart and discover premium natural stone
        </p>
      </div>

      {/* Global error */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[13px] text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form action={formAction} className="space-y-4">
        <FormField label="Full Name" error={state.fieldErrors?.name}>
          <AuthInput
            name="name"
            type="text"
            placeholder="Arjun Mehta"
            autoComplete="name"
            error={!!state.fieldErrors?.name}
            required
          />
        </FormField>

        <FormField label="Email Address" error={state.fieldErrors?.email}>
          <AuthInput
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={!!state.fieldErrors?.email}
            required
          />
        </FormField>

        <FormField label="Password" error={state.fieldErrors?.password}>
          <div className="relative">
            <AuthInput
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              error={!!state.fieldErrors?.password}
              className="pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark/30 hover:text-stone-dark/60 transition-colors"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </FormField>

        <FormField label="City (optional)">
          <div className="relative">
            <AuthSelect name="city" defaultValue="">
              <option value="">Select your city</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Other">Other</option>
            </AuthSelect>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-dark/30">
              ▾
            </div>
          </div>
        </FormField>

        <SubmitRow />
      </form>

      {/* Benefits teaser */}
      <div className="p-4 bg-amber-gold/6 border border-amber-gold/18 rounded-xl">
        <p className="text-[11px] font-sans font-semibold text-amber-700 uppercase tracking-wide mb-2">
          Member benefits
        </p>
        <ul className="space-y-1">
          {[
            "Save inquiries & track order history",
            "Instant WhatsApp quotations",
            "Early access to new arrivals",
          ].map((b) => (
            <li key={b} className="flex items-center gap-2 text-[12px] font-sans text-stone-dark/60">
              <CheckCircle2 size={11} className="text-amber-gold flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <AuthDivider label="Already have an account?" />

      <Link
        href="/login"
        className="flex items-center justify-center w-full py-3 border border-stone-dark/12 rounded-xl text-[13px] font-sans font-semibold text-stone-dark/70 hover:border-stone-dark/25 hover:text-stone-950 transition-all"
      >
        Sign In
      </Link>
    </div>
  );
}

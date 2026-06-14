"use client";

import React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { loginAction } from "@/lib/auth-actions";
import {
  FormField,
  AuthInput,
  SubmitButton,
  AuthDivider,
} from "./AuthLayout";

function SubmitRow() {
  const { pending } = useFormStatus();
  return <SubmitButton pending={pending} label="Sign In" pendingLabel="Signing in…" />;
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});
  const [showPw, setShowPw] = React.useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif text-[1.75rem] font-bold text-stone-950 leading-tight">
          Welcome back
        </h2>
        <p className="mt-1.5 font-sans text-[13.5px] text-stone-dark/50">
          Sign in to your Stonamart account
        </p>
      </div>

      {/* Global error */}
      <AnimatePresence>
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl"
          >
            <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="font-sans text-[13px] text-red-700">{state.error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form action={formAction} className="space-y-5">
        <FormField label="Email Address" error={state.fieldErrors?.email}>
          <AuthInput
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={!!state.fieldErrors?.email}
            required
          />
        </FormField>

        <FormField label="Password" error={state.fieldErrors?.password}>
          <div className="relative">
            <AuthInput
              type={showPw ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={!!state.fieldErrors?.password}
              className="pr-12"
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
        </FormField>

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-[12px] font-sans text-amber-gold hover:text-amber-gold/70 transition-colors font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitRow />
      </form>

      <AuthDivider label="Don't have an account?" />

      {/* Signup links */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/signup"
          className="flex items-center justify-center gap-2 px-4 py-3 border border-stone-dark/12 rounded-xl text-[13px] font-sans font-semibold text-stone-dark/70 hover:border-stone-dark/25 hover:text-stone-950 transition-all group"
        >
          Customer
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href="/vendor/register"
          className="flex items-center justify-center gap-2 px-4 py-3 border border-amber-gold/30 rounded-xl text-[13px] font-sans font-semibold text-amber-700 hover:bg-amber-gold/6 hover:border-amber-gold/50 transition-all group"
        >
          Vendor
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

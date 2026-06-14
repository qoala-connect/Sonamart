"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Stone texture panels for the dark decorative left pane
const MARBLE_BG = [
  "linear-gradient(155deg, transparent 0%, rgba(139,115,85,0.14) 32%, transparent 64%)",
  "linear-gradient(55deg, transparent 18%, rgba(201,169,97,0.08) 50%, transparent 76%)",
  "linear-gradient(165deg, #0a0a0a 0%, #141414 40%, #0e0e0e 70%, #1a1a1a 100%)",
].join(", ");

const NOISE_OPACITY = 0.045;

interface AuthLayoutProps {
  headline: string;
  subline: string;
  quote?: string;
  quoteAttrib?: string;
  children: React.ReactNode;
}

export function AuthLayout({
  headline,
  subline,
  quote,
  quoteAttrib,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* ── Dark decorative pane ── */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative hidden lg:flex lg:w-[44%] xl:w-[42%] flex-col justify-between p-12 overflow-hidden"
        style={{ background: MARBLE_BG }}
      >
        {/* SVG noise overlay */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{ opacity: NOISE_OPACITY, mixBlendMode: "overlay" }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="auth-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#auth-noise)" />
        </svg>

        {/* Subtle veining lines */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{ opacity: 0.04 }}
          viewBox="0 0 440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 80 0 Q 120 200 60 400 T 140 900"
            stroke="#c9a961" strokeWidth="1.5" fill="none"
          />
          <path
            d="M 240 0 Q 280 300 200 500 T 320 900"
            stroke="#c9a961" strokeWidth="1" fill="none"
          />
          <path
            d="M 380 200 Q 340 400 400 600"
            stroke="#8b7355" strokeWidth="0.8" fill="none"
          />
        </svg>

        {/* Gold gradient accent at left edge */}
        <div
          className="absolute top-0 left-0 h-full w-[3px]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #c9a961 30%, #e8dcc4 55%, #c9a961 80%, transparent 100%)",
          }}
        />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-block group">
            <p className="text-[10px] font-sans font-bold text-amber-gold/60 uppercase tracking-[0.28em] mb-1">
              Premium Natural Stone
            </p>
            <h1 className="font-serif text-3xl font-bold text-stone-light tracking-tight group-hover:text-amber-gold transition-colors duration-300">
              Stonamart
            </h1>
          </Link>

          <div className="mt-10">
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-serif text-[2rem] font-bold text-stone-light leading-[1.2]"
            >
              {headline}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-4 font-sans text-[14px] text-stone-light/45 leading-relaxed max-w-[320px]"
            >
              {subline}
            </motion.p>
          </div>
        </div>

        {/* Bottom: Quote */}
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="relative z-10 border-l-2 border-amber-gold/40 pl-5 py-1"
          >
            <p className="font-serif text-[14px] italic text-stone-light/50 leading-relaxed">
              &ldquo;{quote}&rdquo;
            </p>
            {quoteAttrib && (
              <p className="mt-2 font-sans text-[11px] text-amber-gold/60 font-semibold uppercase tracking-[0.1em]">
                — {quoteAttrib}
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* ── Form pane ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-cream-50 min-h-screen lg:min-h-0 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10 text-center">
          <Link href="/">
            <p className="text-[9px] font-sans font-bold text-amber-gold/70 uppercase tracking-[0.22em] mb-0.5">
              Premium Natural Stone
            </p>
            <h1 className="font-serif text-2xl font-bold text-stone-950">Stonamart</h1>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Shared form primitives ───────────────────────────────────────────────────
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-sans font-semibold text-stone-dark/50 uppercase tracking-[0.12em]">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] font-sans text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}

export function AuthInput({
  className = "",
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 bg-white border rounded-xl text-[14px] font-sans text-stone-950 placeholder:text-stone-dark/25 focus:outline-none transition-all duration-200 ${
        error
          ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
          : "border-stone-dark/12 focus:border-amber-gold/60 focus:ring-2 focus:ring-amber-gold/12"
      } ${className}`}
    />
  );
}

export function AuthSelect({
  className = "",
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }) {
  return (
    <select
      {...props}
      className={`w-full px-4 py-3 bg-white border rounded-xl text-[14px] font-sans text-stone-950 focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${
        error
          ? "border-red-400 focus:border-red-500"
          : "border-stone-dark/12 focus:border-amber-gold/60 focus:ring-2 focus:ring-amber-gold/12"
      } ${className}`}
    >
      {children}
    </select>
  );
}

export function SubmitButton({
  pending,
  label,
  pendingLabel,
}: {
  pending: boolean;
  label: string;
  pendingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative w-full py-3.5 bg-stone-950 text-white font-sans font-semibold text-[14px] rounded-xl hover:bg-stone-dark disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden group"
    >
      <span className="relative z-10">
        {pending ? (pendingLabel ?? "Please wait…") : label}
      </span>
      {/* Shimmer on hover */}
      <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/6 to-transparent pointer-events-none" />
    </button>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-stone-dark/8" />
      <span className="text-[11px] font-sans text-stone-dark/30 font-medium">{label}</span>
      <div className="flex-1 h-px bg-stone-dark/8" />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  FileText,
  MessageCircle,
  X,
  Send,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import type { CatalogProduct } from "@/components/catalog/types";

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Pune",
  "Jaipur", "Chennai", "Kolkata", "Ahmedabad", "Surat",
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
}

// ─── Inquire Modal ─────────────────────────────────────────────────────────────
function InquireModal({
  isOpen,
  onClose,
  productName,
}: {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}) {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    city: "",
    message: `Hi, I'm interested in ${productName} and would like more details on pricing and availability.`,
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    // Reset after exit animation completes
    setTimeout(() => setSubmitted(false), 350);
  }

  const inputCls =
    "w-full px-3 py-2.5 text-sm font-sans bg-cream-50 border border-stone-dark/10 rounded-xl text-stone-950 placeholder:text-stone-dark/30 focus:outline-none focus:border-amber-gold/50 focus:ring-2 focus:ring-amber-gold/10 transition-all";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-stone-950/55 backdrop-blur-sm z-50"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.2)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-stone-dark/7">
              <div>
                <p className="text-amber-gold font-sans text-[10px] font-semibold uppercase tracking-[0.18em] mb-0.5">
                  Stone Inquiry
                </p>
                <h3 className="font-serif text-lg font-bold text-stone-950 leading-tight">
                  {productName}
                </h3>
              </div>
              <motion.button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-dark/40 hover:bg-stone-dark/6 hover:text-stone-dark/70 transition-colors mt-0.5"
                whileTap={{ scale: 0.92 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Body: form or success */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="px-5 py-10 flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 20 }}
                    className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 size={26} className="text-emerald-600" />
                  </motion.div>
                  <h4 className="font-serif text-xl font-bold text-stone-950 mb-2">
                    Inquiry Sent!
                  </h4>
                  <p className="font-sans text-sm text-stone-dark/55 max-w-xs leading-relaxed">
                    Our team will reach out within 2 hours regarding{" "}
                    <span className="font-semibold text-stone-950">{productName}</span>.
                  </p>
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-6 px-7 py-2.5 bg-stone-950 text-stone-light text-sm font-sans font-semibold rounded-xl hover:bg-stone-dark/85 transition-colors"
                  >
                    Done
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="px-5 pt-4 pb-5 space-y-3.5"
                >
                  {/* Name + Phone row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-dark/42 mb-1.5">
                        <User size={9} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Rahul Sharma"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-dark/42 mb-1.5">
                        <Phone size={9} />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 98765 43210"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Email + City row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-dark/42 mb-1.5">
                        <Mail size={9} />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@company.com"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-dark/42 mb-1.5">
                        <MapPin size={9} />
                        Your City
                      </label>
                      <div className="relative">
                        <select
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          required
                          className={`${inputCls} appearance-none pr-8`}
                        >
                          <option value="">Select city</option>
                          {CITIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={12}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-dark/35 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] font-sans font-semibold uppercase tracking-[0.1em] text-stone-dark/42 mb-1.5">
                      <MessageSquare size={9} />
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-stone-950 text-stone-light text-sm font-sans font-semibold rounded-xl hover:bg-stone-dark/85 transition-colors"
                  >
                    <Send size={14} />
                    Send Inquiry
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Action Stack ──────────────────────────────────────────────────────────────
interface ActionStackProps {
  product: CatalogProduct;
}

export function ActionStack({ product }: ActionStackProps) {
  const [inquireOpen, setInquireOpen] = useState(false);

  const waMsg = encodeURIComponent(
    `Hi, I'm interested in ${product.name} (${product.materialType}, ${product.finish}, ${product.thickness}) from Stonamart. Could you share availability and pricing details?`
  );
  const waUrl = `https://wa.me/919876543210?text=${waMsg}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="flex flex-col gap-3"
      >
        {/* Primary: Inquire */}
        <motion.button
          onClick={() => setInquireOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2.5 py-4 bg-stone-950 text-stone-light font-sans font-semibold rounded-2xl hover:bg-stone-dark/85 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.14)]"
        >
          <MessageSquare size={16} />
          Inquire About This Stone
        </motion.button>

        {/* Secondary: RFQ */}
        <Link href="/rfq" className="w-full block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 border-2 border-stone-dark/12 text-stone-dark/70 font-sans font-semibold rounded-2xl hover:border-amber-gold/45 hover:text-amber-gold transition-all duration-200 cursor-pointer"
          >
            <FileText size={16} />
            Request a Custom Quote
          </motion.div>
        </Link>

        {/* WhatsApp CTA */}
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="w-full block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-[#25D366]/10 border border-[#25D366]/28 text-[#1a8a50] font-sans font-semibold rounded-2xl hover:bg-[#25D366]/18 transition-colors cursor-pointer"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </motion.div>
        </a>

        {/* Trust note */}
        <p className="text-center text-[10px] font-sans text-stone-dark/32 mt-0.5">
          Verified supplier · No hidden charges · Responds within 2 hours
        </p>
      </motion.div>

      <InquireModal
        isOpen={inquireOpen}
        onClose={() => setInquireOpen(false)}
        productName={product.name}
      />
    </>
  );
}

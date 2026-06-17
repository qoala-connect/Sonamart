"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, Building, Phone, Mail, MapPin,
  FileText, Clock, AlertTriangle, RefreshCw, User,
  Shield, ExternalLink, X, ChevronRight, Eye, Store,
  ClockIcon, CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { approveVendor, rejectVendor } from "@/lib/admin-actions";
import type { VendorApplication } from "@/lib/admin-actions";

type Tab = "pending" | "registered";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? "1 day ago" : `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

function isPdf(url: string) {
  return url.toLowerCase().includes(".pdf");
}

// ─── Reject modal ──────────────────────────────────────────────────────────────
function RejectModal({
  vendor,
  onConfirm,
  onCancel,
  isLoading,
}: {
  vendor: VendorApplication;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [reason, setReason] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <XCircle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-stone-950 text-sm">Reject Application</h3>
            <p className="font-sans text-xs text-stone-dark/40 mt-0.5">{vendor.companyName ?? vendor.name}</p>
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-stone-dark/40 mb-2">
            Reason <span className="text-red-400 normal-case tracking-normal">(required)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Explain why this application is being rejected. This will be emailed to the vendor."
            className="w-full px-4 py-3 font-sans text-sm bg-stone-50 border border-stone-dark/10 rounded-xl text-stone-950 placeholder:text-stone-dark/25 focus:outline-none focus:border-amber-gold/40 focus:ring-2 focus:ring-amber-gold/10 resize-none transition-all"
          />
          <p className="text-[10px] font-sans text-stone-dark/30 mt-1.5">
            Will be sent to <span className="text-stone-dark/50">{vendor.email}</span>
          </p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 font-sans text-sm font-semibold border border-stone-dark/10 text-stone-dark/55 rounded-xl hover:bg-stone-dark/4 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim() || isLoading}
            className="flex-1 px-4 py-2.5 font-sans text-sm font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <RefreshCw size={13} className="animate-spin" /> : <XCircle size={13} />}
            {isLoading ? "Rejecting…" : "Confirm Reject"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Full detail modal ─────────────────────────────────────────────────────────
function VendorDetailModal({
  vendor,
  onClose,
  onApprove,
  onReject,
  approving,
  readOnly,
}: {
  vendor: VendorApplication;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  approving?: boolean;
  readOnly?: boolean;
}) {
  const docs = vendor.documentUrls ?? [];

  const infoRows = [
    { icon: User,    label: "Contact Person",  value: vendor.contactPerson ?? "—" },
    { icon: Mail,    label: "Email",            value: vendor.email },
    { icon: Phone,   label: "Phone",            value: vendor.phone ?? "—" },
    { icon: MapPin,  label: "City",             value: vendor.city ?? "—" },
    { icon: Shield,  label: "GST Number",       value: vendor.gstNumber ?? "Not provided" },
    { icon: MapPin,  label: "Business Address", value: vendor.businessAddress ?? "—" },
    { icon: Clock,   label: "Joined",           value: timeAgo(vendor.createdAt) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-7 pt-6 pb-5 border-b border-stone-dark/8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-gold/10 border border-amber-gold/20 flex items-center justify-center flex-shrink-0">
              <Building size={22} className="text-amber-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-stone-950 leading-tight">
                  {vendor.companyName ?? "—"}
                </h2>
                {readOnly ? (
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-sans font-bold text-emerald-600 uppercase tracking-wide">
                    Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-sans font-bold text-amber-600 uppercase tracking-wide">
                    Pending
                  </span>
                )}
              </div>
              <p className="font-sans text-xs text-stone-dark/45 mt-0.5">
                {readOnly ? "Registered Vendor" : "Vendor Application"} · {timeAgo(vendor.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-dark/5 hover:bg-stone-dark/10 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={15} className="text-stone-dark/50" />
          </button>
        </div>

        {/* Info grid */}
        <div className="px-7 py-5">
          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-dark/35 mb-3">
            Business Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoRows.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 px-4 py-3 bg-stone-50 rounded-xl border border-stone-dark/6">
                <div className="w-7 h-7 rounded-lg bg-white border border-stone-dark/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={13} className="text-amber-gold" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-sans text-stone-dark/40 uppercase tracking-wide">{label}</p>
                  <p className="text-[13px] font-sans font-semibold text-stone-950 mt-0.5 break-words">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="px-7 pb-5">
          <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-dark/35 mb-3">
            Uploaded Documents ({docs.length})
          </p>
          {docs.length === 0 ? (
            <div className="flex items-center gap-2.5 px-4 py-3.5 bg-stone-50 rounded-xl border border-stone-dark/6">
              <FileText size={14} className="text-stone-dark/25" />
              <p className="font-sans text-sm text-stone-dark/35">No documents uploaded</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {docs.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block rounded-xl overflow-hidden border border-stone-dark/8 hover:border-amber-gold/40 transition-colors"
                >
                  {isPdf(url) ? (
                    <div className="flex flex-col items-center justify-center gap-2 h-28 bg-red-50">
                      <FileText size={28} className="text-red-400" />
                      <span className="text-[10px] font-sans font-bold text-red-500 uppercase tracking-wider">PDF</span>
                    </div>
                  ) : (
                    <div className="relative h-28 bg-stone-100">
                      <Image
                        src={url}
                        alt={`Document ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="200px"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between px-2.5 py-2 bg-white border-t border-stone-dark/6">
                    <span className="text-[10px] font-sans text-stone-dark/50 truncate">
                      {isPdf(url) ? "Document" : "Image"} {i + 1}
                    </span>
                    <ExternalLink size={10} className="text-stone-dark/30 group-hover:text-amber-gold transition-colors flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="px-7 py-5 bg-stone-50 border-t border-stone-dark/8 rounded-b-3xl flex items-center gap-3">
          {readOnly ? (
            <>
              <a
                href={`mailto:${vendor.email}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-stone-dark/12 text-stone-dark/60 font-sans text-sm font-semibold rounded-xl hover:bg-stone-dark/4 transition-colors"
              >
                <Mail size={15} /> Email Vendor
              </a>
              {vendor.phone && (
                <a
                  href={`tel:${vendor.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-gold text-stone-950 font-sans text-sm font-semibold rounded-xl hover:bg-amber-gold/90 transition-colors shadow-sm"
                >
                  <Phone size={15} /> Call Vendor
                </a>
              )}
            </>
          ) : (
            <>
              <button
                onClick={onReject}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 font-sans text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
              >
                <XCircle size={15} /> Reject Application
              </button>
              <button
                onClick={onApprove}
                disabled={approving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-sans text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-sm"
              >
                {approving ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={15} />}
                {approving ? "Approving…" : "Approve Vendor"}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Pending card ──────────────────────────────────────────────────────────────
function PendingCard({ vendor, onClick }: { vendor: VendorApplication; onClick: () => void }) {
  return (
    <motion.div
      layout exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.22 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-stone-dark/7 p-5 shadow-sm hover:shadow-md hover:border-amber-gold/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Building size={13} className="text-amber-gold flex-shrink-0" />
            <h3 className="font-sans font-bold text-stone-950 text-[14px] truncate">{vendor.companyName ?? "—"}</h3>
          </div>
          <p className="font-sans text-[11px] text-stone-dark/40 truncate">{vendor.name} · {vendor.email}</p>
        </div>
        <div className="flex items-center gap-1 text-stone-dark/30 flex-shrink-0">
          <ClockIcon size={10} />
          <span className="font-sans text-[10px]">{timeAgo(vendor.createdAt)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 mb-3">
        <div className="flex items-center gap-1.5">
          <Phone size={10} className="text-stone-dark/25 flex-shrink-0" />
          <span className="font-sans text-[10.5px] text-stone-dark/50 truncate">{vendor.phone ?? "—"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={10} className="text-stone-dark/25 flex-shrink-0" />
          <span className="font-sans text-[10.5px] text-stone-dark/50 truncate">{vendor.city ?? "—"}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <Shield size={10} className="text-stone-dark/25 flex-shrink-0" />
          <span className="font-sans text-[10.5px] text-stone-dark/50 truncate">
            {vendor.gstNumber ? `GST: ${vendor.gstNumber}` : "No GST"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-stone-dark/6">
        <div className="flex items-center gap-1.5">
          <FileText size={11} className="text-stone-dark/25" />
          <span className="font-sans text-[10.5px] text-stone-dark/40">
            {(vendor.documentUrls ?? []).length} doc{(vendor.documentUrls ?? []).length !== 1 ? "s" : ""}
          </span>
        </div>
        <span className="flex items-center gap-1 font-sans text-[10.5px] font-semibold text-amber-gold group-hover:gap-2 transition-all">
          <Eye size={11} /> View Details <ChevronRight size={10} />
        </span>
      </div>
    </motion.div>
  );
}

// ─── Registered vendor card ────────────────────────────────────────────────────
function RegisteredCard({ vendor, onClick }: { vendor: VendorApplication; onClick: () => void }) {
  const initials = (vendor.companyName ?? vendor.name ?? "?")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22 }}
      onClick={onClick}
      className="bg-white rounded-2xl border border-stone-dark/7 p-5 shadow-sm hover:shadow-md hover:border-amber-gold/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-gold/20 to-amber-gold/5 border border-amber-gold/20 flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-sm font-bold text-amber-gold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-sans font-bold text-stone-950 text-[14px] truncate">{vendor.companyName ?? "—"}</h3>
            <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
          </div>
          <p className="font-sans text-[11px] text-stone-dark/40 truncate mt-0.5">{vendor.city ?? "—"}</p>
        </div>
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2">
          <User size={10} className="text-stone-dark/25 flex-shrink-0" />
          <span className="font-sans text-[11px] text-stone-dark/55 truncate">{vendor.contactPerson ?? vendor.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={10} className="text-stone-dark/25 flex-shrink-0" />
          <span className="font-sans text-[11px] text-stone-dark/55 truncate">{vendor.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={10} className="text-stone-dark/25 flex-shrink-0" />
          <span className="font-sans text-[11px] text-stone-dark/55 truncate">{vendor.phone ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={10} className="text-stone-dark/25 flex-shrink-0" />
          <span className="font-sans text-[11px] text-stone-dark/55 truncate">
            {vendor.gstNumber ?? "No GST"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-stone-dark/6">
        <span className="font-sans text-[10px] text-stone-dark/30">
          Joined {timeAgo(vendor.createdAt)}
        </span>
        <span className="flex items-center gap-1 font-sans text-[10.5px] font-semibold text-amber-gold group-hover:gap-2 transition-all">
          <Eye size={11} /> View <ChevronRight size={10} />
        </span>
      </div>
    </motion.div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────
export function VendorApprovalSection({
  initialVendors,
  registeredVendors,
}: {
  initialVendors: VendorApplication[];
  registeredVendors: VendorApplication[];
}) {
  const [tab, setTab] = useState<Tab>("pending");
  const [vendors, setVendors] = useState(initialVendors);
  const [detailVendor, setDetailVendor] = useState<VendorApplication | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VendorApplication | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [, startTransition] = useTransition();

  function showToast(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleApprove(userId: string) {
    setApprovingId(userId);
    startTransition(async () => {
      const res = await approveVendor(userId);
      if (res.ok) {
        setVendors((v) => v.filter((x) => x.userId !== userId));
        setDetailVendor(null);
        showToast("Vendor approved — they can now log in", "ok");
      } else {
        showToast(res.error ?? "Failed to approve", "err");
      }
      setApprovingId(null);
    });
  }

  function handleRejectConfirm(reason: string) {
    if (!rejectTarget) return;
    const userId = rejectTarget.userId;
    setRejectingId(userId);
    startTransition(async () => {
      const res = await rejectVendor(userId, reason);
      if (res.ok) {
        setVendors((v) => v.filter((x) => x.userId !== userId));
        setDetailVendor(null);
        showToast("Vendor rejected and notified by email", "ok");
      } else {
        showToast(res.error ?? "Failed to reject", "err");
      }
      setRejectTarget(null);
      setRejectingId(null);
    });
  }

  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 mb-6 bg-stone-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("pending")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-sans font-semibold transition-all ${
            tab === "pending"
              ? "bg-white shadow-sm text-stone-950"
              : "text-stone-dark/45 hover:text-stone-950"
          }`}
        >
          <ClockIcon size={13} />
          Pending Applications
          {vendors.length > 0 && (
            <span className="px-1.5 py-0.5 bg-amber-gold text-white text-[9px] font-bold rounded-full">
              {vendors.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("registered")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-sans font-semibold transition-all ${
            tab === "registered"
              ? "bg-white shadow-sm text-stone-950"
              : "text-stone-dark/45 hover:text-stone-950"
          }`}
        >
          <Store size={13} />
          Registered Vendors
          <span className="px-1.5 py-0.5 bg-stone-200 text-stone-600 text-[9px] font-bold rounded-full">
            {registeredVendors.length}
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Pending tab ── */}
        {tab === "pending" && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <p className="font-sans text-xs text-stone-dark/40 mb-5">
              {vendors.length === 0
                ? "No pending applications — all caught up"
                : `${vendors.length} vendor${vendors.length !== 1 ? "s" : ""} awaiting review — click any card to view full details and approve or reject`}
            </p>

            {vendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <CheckCircle size={44} strokeWidth={1} className="text-emerald-300 mb-3" />
                <p className="font-sans text-sm font-semibold text-stone-dark/35">All caught up</p>
                <p className="font-sans text-xs text-stone-dark/25 mt-1">New applications will appear here automatically</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {vendors.map((v) => (
                    <PendingCard key={v.userId} vendor={v} onClick={() => setDetailVendor(v)} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── Registered tab ── */}
        {tab === "registered" && (
          <motion.div
            key="registered"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <p className="font-sans text-xs text-stone-dark/40 mb-5">
              {registeredVendors.length === 0
                ? "No approved vendors yet"
                : `${registeredVendors.length} active vendor${registeredVendors.length !== 1 ? "s" : ""} on the platform — click any card to view full details`}
            </p>

            {registeredVendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Store size={44} strokeWidth={1} className="text-stone-300 mb-3" />
                <p className="font-sans text-sm font-semibold text-stone-dark/35">No active vendors yet</p>
                <p className="font-sans text-xs text-stone-dark/25 mt-1">Approved vendors will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {registeredVendors.map((v) => (
                  <RegisteredCard key={v.userId} vendor={v} onClick={() => setDetailVendor(v)} />
                ))}
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* Full detail modal */}
      <AnimatePresence>
        {detailVendor && (
          <VendorDetailModal
            vendor={detailVendor}
            onClose={() => setDetailVendor(null)}
            onApprove={detailVendor.status === "PENDING" ? () => handleApprove(detailVendor.userId) : undefined}
            onReject={detailVendor.status === "PENDING" ? () => setRejectTarget(detailVendor) : undefined}
            approving={approvingId === detailVendor.userId}
            readOnly={detailVendor.status === "ACTIVE"}
          />
        )}
      </AnimatePresence>

      {/* Reject confirm modal */}
      <AnimatePresence>
        {rejectTarget && (
          <RejectModal
            vendor={rejectTarget}
            onConfirm={handleRejectConfirm}
            onCancel={() => setRejectTarget(null)}
            isLoading={rejectingId === rejectTarget.userId}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 6, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-sans font-semibold pointer-events-none ${
              toast.type === "ok" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "ok" ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

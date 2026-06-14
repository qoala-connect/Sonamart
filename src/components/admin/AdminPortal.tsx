"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, FileText, ShieldCheck, BarChart3, Settings,
  Package, ChevronRight, Bell, Search, Layers,
} from "lucide-react";
import { LeadPipeline } from "./crm/LeadPipeline";
import { LeadDetailCard } from "./crm/LeadDetailCard";
import { QuotationGenerator } from "./quotation/QuotationGenerator";
import { MOCK_LEADS } from "./data";
import type { Lead, LeadStage } from "./types";

// ─── Nav items ────────────────────────────────────────────────────────────────
type NavId = "crm" | "quotations" | "products" | "vendors" | "analytics" | "settings";

const NAV_ITEMS: {
  id: NavId;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
  badge?: number;
}[] = [
  { id: "crm",        label: "CRM Leads",     icon: Users     },
  { id: "quotations", label: "Quotations",     icon: FileText  },
  { id: "products",   label: "Product Review", icon: Package,    disabled: true },
  { id: "vendors",    label: "Vendors",        icon: ShieldCheck,disabled: true },
  { id: "analytics",  label: "Analytics",      icon: BarChart3,  disabled: true },
  { id: "settings",   label: "Settings",       icon: Settings,   disabled: true },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  active,
  onNavigate,
  leadCount,
}: {
  active: NavId;
  onNavigate: (id: NavId) => void;
  leadCount: number;
}) {
  return (
    <aside className="flex-shrink-0 w-56 bg-stone-950 border-r border-white/5 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <p className="text-[9px] font-sans font-bold text-amber-gold/60 uppercase tracking-[0.25em] mb-0.5">
          Admin Console
        </p>
        <h1 className="font-serif text-xl font-bold text-white tracking-tight">
          Stonamart
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const badge = item.id === "crm" ? leadCount : item.badge;
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && onNavigate(item.id)}
              disabled={item.disabled}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                item.disabled
                  ? "opacity-35 cursor-not-allowed"
                  : isActive
                  ? "bg-white/8 text-white"
                  : "text-white/45 hover:text-white/75 hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute inset-0 rounded-lg bg-white/6"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                size={15}
                className={`relative z-10 flex-shrink-0 transition-colors ${
                  isActive ? "text-amber-gold" : ""
                }`}
              />
              <span className="relative z-10 text-[12.5px] font-sans font-medium flex-1">
                {item.label}
              </span>
              {badge && badge > 0 ? (
                <span className="relative z-10 flex items-center justify-center h-4.5 min-w-[18px] px-1 bg-amber-gold text-stone-950 text-[9px] font-bold rounded-full">
                  {badge}
                </span>
              ) : item.disabled ? (
                <ChevronRight size={11} className="relative z-10 opacity-25" />
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Admin badge */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-gold/20 flex items-center justify-center">
            <span className="text-[11px] font-sans font-bold text-amber-gold">SA</span>
          </div>
          <div>
            <p className="text-[11px] font-sans font-semibold text-white/70">Sneha Agarwal</p>
            <p className="text-[10px] font-sans text-white/30">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-between px-7 py-4 border-b border-stone-dark/8 bg-white">
      <div>
        <h2 className="font-serif text-xl font-bold text-stone-950 leading-tight">{title}</h2>
        {subtitle && (
          <p className="font-sans text-[12px] text-stone-dark/40 mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-stone-dark/5 text-stone-dark/35 hover:text-stone-950 transition-colors">
          <Search size={16} />
        </button>
        <button className="relative p-2 rounded-lg hover:bg-stone-dark/5 text-stone-dark/35 hover:text-stone-950 transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-gold" />
        </button>
      </div>
    </div>
  );
}

// ─── CRM Section ──────────────────────────────────────────────────────────────
function CRMSection({ leads, onLeadsChange }: { leads: Lead[]; onLeadsChange: (l: Lead[]) => void }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleStageChange = useCallback(
    (id: string, stage: LeadStage) => {
      onLeadsChange(leads.map((l) => (l.id === id ? { ...l, stage } : l)));
      setSelectedLead((prev) => (prev?.id === id ? { ...prev, stage } : prev));
    },
    [leads, onLeadsChange]
  );

  const handleFollowUpSave = useCallback(
    (id: string, date: string, note: string) => {
      onLeadsChange(
        leads.map((l) =>
          l.id === id ? { ...l, followUpDate: date, followUpNote: note } : l
        )
      );
      setSelectedLead((prev) =>
        prev?.id === id ? { ...prev, followUpDate: date, followUpNote: note } : prev
      );
    },
    [leads, onLeadsChange]
  );

  // Summary bar
  const stageGroups: Record<string, number> = {};
  leads.forEach((l) => { stageGroups[l.stage] = (stageGroups[l.stage] ?? 0) + 1; });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Summary pills */}
      <div className="flex-shrink-0 flex items-center gap-2 px-7 py-3 border-b border-stone-dark/6 bg-cream-50 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-[11px] font-sans text-stone-dark/40 mr-2">
          <Layers size={12} />
          <span>{leads.length} leads</span>
        </div>
        {[
          { label: "Active", count: leads.filter(l => !["DELIVERED","CLOSED"].includes(l.stage)).length, color: "bg-blue-500/10 text-blue-700" },
          { label: "Urgent", count: leads.filter(l => l.priority === "urgent").length, color: "bg-red-500/10 text-red-700" },
          { label: "Confirmed", count: leads.filter(l => l.stage === "CONFIRMED" || l.stage === "PROCUREMENT").length, color: "bg-emerald-500/10 text-emerald-700" },
        ].map((pill) => (
          <span key={pill.label} className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold ${pill.color}`}>
            {pill.count} {pill.label}
          </span>
        ))}
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-hidden px-7 py-5">
        <LeadPipeline leads={leads} onSelectLead={setSelectedLead} />
      </div>

      {/* Detail slide-in */}
      <LeadDetailCard
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStageChange={handleStageChange}
        onFollowUpSave={handleFollowUpSave}
      />
    </div>
  );
}

// ─── Quotations section ───────────────────────────────────────────────────────
function QuotationsSection() {
  return (
    <div className="flex-1 overflow-y-auto px-7 py-6">
      <QuotationGenerator />
    </div>
  );
}

// ─── Coming soon placeholder ──────────────────────────────────────────────────
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-stone-dark/20">
      <Layers size={40} strokeWidth={1} />
      <p className="font-sans text-sm">{label} — coming soon</p>
    </div>
  );
}

// ─── Admin Portal ─────────────────────────────────────────────────────────────
export function AdminPortal() {
  const [active, setActive] = useState<NavId>("crm");
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);

  const urgentCount = leads.filter(
    (l) => l.priority === "urgent" && !["DELIVERED", "CLOSED"].includes(l.stage)
  ).length;

  const PAGE_META: Record<NavId, { title: string; subtitle?: string }> = {
    crm:        { title: "CRM Lead Pipeline", subtitle: "Track and manage every customer inquiry across all stages" },
    quotations: { title: "Quotation Generator", subtitle: "Build, price, and dispatch professional quotations" },
    products:   { title: "Product Review", subtitle: "Approve or request changes to vendor listings" },
    vendors:    { title: "Vendor Management", subtitle: "Manage verified stone suppliers and their profiles" },
    analytics:  { title: "Analytics", subtitle: "Sales performance, pipeline velocity, and trends" },
    settings:   { title: "Settings", subtitle: "Configure platform preferences and team access" },
  };

  const meta = PAGE_META[active];

  return (
    <div className="flex h-screen overflow-hidden bg-cream-50 font-sans">
      {/* Sidebar */}
      <Sidebar active={active} onNavigate={setActive} leadCount={urgentCount} />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={meta.title} subtitle={meta.subtitle} />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden flex flex-col"
          >
            {active === "crm" && (
              <CRMSection leads={leads} onLeadsChange={setLeads} />
            )}
            {active === "quotations" && <QuotationsSection />}
            {active === "products"   && <ComingSoon label="Product Review" />}
            {active === "vendors"    && <ComingSoon label="Vendor Management" />}
            {active === "analytics"  && <ComingSoon label="Analytics" />}
            {active === "settings"   && <ComingSoon label="Settings" />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

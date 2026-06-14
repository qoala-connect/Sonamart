"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Lead, LeadStage } from "../types";
import { STAGE_CONFIG, PIPELINE_STAGES, PRIORITY_CONFIG } from "../data";

// ─── Utility ─────────────────────────────────────────────────────────────────
function ageLabel(ts: number): string {
  const s = Math.floor(Date.now() / 1000) - ts;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ─── Lead Card ────────────────────────────────────────────────────────────────
function LeadCard({
  lead,
  onSelect,
}: {
  lead: Lead;
  onSelect: (l: Lead) => void;
}) {
  const pc = PRIORITY_CONFIG[lead.priority];

  return (
    <motion.button
      onClick={() => onSelect(lead)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(10,10,10,0.1)" }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      className="w-full text-left bg-white border border-stone-dark/8 rounded-xl p-3.5 space-y-2.5 hover:border-amber-gold/30 transition-colors duration-200"
    >
      {/* Priority + age */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${pc.dot} ${lead.priority === "urgent" ? "animate-pulse" : ""}`} />
          <span className={`text-[10px] font-sans font-semibold uppercase tracking-wide ${pc.text}`}>
            {pc.label}
          </span>
        </div>
        <span className="text-[10px] text-stone-dark/35 font-sans tabular-nums">
          {ageLabel(lead.createdAt)}
        </span>
      </div>

      {/* Customer */}
      <div>
        <p className="font-sans font-semibold text-stone-950 text-[13px] leading-tight">
          {lead.customerName}
        </p>
        {lead.company && (
          <p className="font-sans text-[11px] text-stone-dark/45 mt-0.5 truncate">
            {lead.company}
          </p>
        )}
      </div>

      {/* Material + area pill */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="px-2 py-0.5 bg-stone-dark/5 rounded-md text-[10px] text-stone-dark/60 font-sans font-medium truncate max-w-[120px]">
          {lead.materialRequested.length > 22
            ? lead.materialRequested.slice(0, 22) + "…"
            : lead.materialRequested}
        </span>
        <span className="px-2 py-0.5 bg-amber-500/8 rounded-md text-[10px] text-amber-700 font-sans font-medium">
          {lead.areaRequired}
        </span>
      </div>

      {/* City */}
      <p className="text-[11px] font-sans text-stone-dark/40">{lead.city}</p>
    </motion.button>
  );
}

// ─── Stage Column ─────────────────────────────────────────────────────────────
function StageColumn({
  stage,
  leads,
  onSelect,
}: {
  stage: LeadStage;
  leads: Lead[];
  onSelect: (l: Lead) => void;
}) {
  const cfg = STAGE_CONFIG[stage];

  return (
    <div className="flex-shrink-0 w-56 flex flex-col gap-0">
      {/* Column header */}
      <div className={`flex items-center justify-between px-3 py-2.5 mb-2.5 rounded-lg border ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className={`text-[11px] font-sans font-semibold ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        <span className={`text-[11px] font-sans font-bold tabular-nums ${cfg.color}`}>
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-2.5 flex-1">
        {leads.length === 0 ? (
          <div className="h-16 border border-dashed border-stone-dark/10 rounded-xl flex items-center justify-center">
            <Plus size={14} className="text-stone-dark/15" />
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Lead Pipeline ────────────────────────────────────────────────────────────
export function LeadPipeline({
  leads,
  onSelectLead,
}: {
  leads: Lead[];
  onSelectLead: (l: Lead) => void;
}) {
  const byStage = useMemo(() => {
    const map: Record<LeadStage, Lead[]> = {} as Record<LeadStage, Lead[]>;
    PIPELINE_STAGES.forEach((s) => (map[s] = []));
    leads.forEach((l) => map[l.stage].push(l));
    return map;
  }, [leads]);

  return (
    <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
      <div className="flex gap-3 min-w-max px-1 pb-2">
        {PIPELINE_STAGES.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            leads={byStage[stage]}
            onSelect={onSelectLead}
          />
        ))}
      </div>
    </div>
  );
}

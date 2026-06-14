"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Sparkles, PhoneCall, Mail, MessageSquare, ArrowRight,
  FileText, Zap, Clock, User, MapPin, Building2, Calendar,
  ChevronDown, CheckCircle2,
} from "lucide-react";
import type { Lead, LeadStage, ActivityEntry } from "../types";
import { STAGE_CONFIG, PIPELINE_STAGES, PRIORITY_CONFIG } from "../data";

// ─── Timestamp helper ─────────────────────────────────────────────────────────
function fmtTime(ts: number): string {
  const d = new Date(ts * 1000);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  }) + " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

// ─── Activity type icon ───────────────────────────────────────────────────────
function ActivityIcon({ type }: { type: ActivityEntry["type"] }) {
  const map: Record<string, { Icon: React.ElementType; bg: string; text: string }> = {
    note:          { Icon: MessageSquare, bg: "bg-stone-dark/8",   text: "text-stone-dark/60" },
    call:          { Icon: PhoneCall,    bg: "bg-emerald-500/10",  text: "text-emerald-600"   },
    email:         { Icon: Mail,         bg: "bg-blue-500/10",     text: "text-blue-600"      },
    stage_change:  { Icon: ArrowRight,   bg: "bg-violet-500/10",   text: "text-violet-600"    },
    quotation_sent:{ Icon: FileText,     bg: "bg-amber-500/10",    text: "text-amber-700"     },
    system:        { Icon: Zap,          bg: "bg-stone-dark/5",    text: "text-stone-dark/35" },
    reminder_set:  { Icon: Clock,        bg: "bg-orange-500/10",   text: "text-orange-600"    },
  };
  const cfg = map[type] ?? map.note;
  return (
    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${cfg.bg}`}>
      <cfg.Icon size={13} className={cfg.text} />
    </span>
  );
}

// ─── Activity Timeline ────────────────────────────────────────────────────────
function ActivityTimeline({ entries }: { entries: ActivityEntry[] }) {
  const sorted = [...entries].sort((a, b) => b.timestamp - a.timestamp);
  return (
    <div className="space-y-4">
      {sorted.map((entry, i) => (
        <div key={entry.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <ActivityIcon type={entry.type} />
            {i < sorted.length - 1 && (
              <div className="w-px flex-1 bg-stone-dark/8 mt-1.5 min-h-[12px]" />
            )}
          </div>
          <div className="pb-4 flex-1 min-w-0">
            <p className="font-sans text-[12.5px] text-stone-950 leading-snug">{entry.text}</p>
            <p className="font-sans text-[11px] text-stone-dark/35 mt-0.5">
              {entry.author} · {fmtTime(entry.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Stage Selector ───────────────────────────────────────────────────────────
function StageSelector({
  current,
  onChange,
}: {
  current: LeadStage;
  onChange: (s: LeadStage) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PIPELINE_STAGES.map((stage) => {
        const cfg = STAGE_CONFIG[stage];
        const isCurrent = stage === current;
        return (
          <button
            key={stage}
            onClick={() => onChange(stage)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-sans font-semibold border transition-all duration-150 ${
              isCurrent
                ? `${cfg.bg} ${cfg.border} ${cfg.color} shadow-sm`
                : "bg-white border-stone-dark/10 text-stone-dark/40 hover:border-stone-dark/20 hover:text-stone-dark/60"
            }`}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot} ${isCurrent ? "" : "opacity-30"}`} />
            {cfg.short}
            {isCurrent && <CheckCircle2 size={10} className="ml-0.5" />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Follow-up Scheduler ─────────────────────────────────────────────────────
function FollowUpScheduler({
  date,
  note,
  onSave,
}: {
  date?: string;
  note?: string;
  onSave: (date: string, note: string) => void;
}) {
  const [d, setD] = useState(date ?? "");
  const [n, setN] = useState(note ?? "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!d) return;
    onSave(d, n);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-[10px] font-sans font-semibold text-stone-dark/45 uppercase tracking-wide mb-1">
            Date
          </label>
          <input
            type="date"
            value={d}
            onChange={(e) => setD(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-dark/12 bg-white text-[12.5px] font-sans text-stone-950 focus:outline-none focus:border-amber-gold/60 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-sans font-semibold text-stone-dark/45 uppercase tracking-wide mb-1">
          Note
        </label>
        <textarea
          rows={2}
          value={n}
          onChange={(e) => setN(e.target.value)}
          placeholder="Remind me to…"
          className="w-full px-3 py-2 rounded-lg border border-stone-dark/12 bg-white text-[12.5px] font-sans text-stone-950 resize-none focus:outline-none focus:border-amber-gold/60 transition-colors placeholder:text-stone-dark/25"
        />
      </div>
      <motion.button
        onClick={handleSave}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 px-3.5 py-2 bg-stone-950 text-white text-[12px] font-sans font-semibold rounded-lg hover:bg-stone-dark transition-colors"
      >
        <AnimatePresence mode="wait" initial={false}>
          {saved ? (
            <motion.span key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> Saved
            </motion.span>
          ) : (
            <motion.span key="set" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <Clock size={13} /> Set Reminder
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-sans font-semibold text-stone-dark/40 uppercase tracking-[0.12em] mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-1.5 border-b border-stone-dark/5 last:border-0">
      <span className="text-[11px] font-sans text-stone-dark/40 w-24 flex-shrink-0">{label}</span>
      <span className="text-[12.5px] font-sans text-stone-950 font-medium">{value}</span>
    </div>
  );
}

// ─── Main Lead Detail Card ────────────────────────────────────────────────────
export function LeadDetailCard({
  lead,
  onClose,
  onStageChange,
  onFollowUpSave,
}: {
  lead: Lead | null;
  onClose: () => void;
  onStageChange: (id: string, stage: LeadStage) => void;
  onFollowUpSave: (id: string, date: string, note: string) => void;
}) {
  const pc = lead ? PRIORITY_CONFIG[lead.priority] : null;

  return (
    <AnimatePresence>
      {lead && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/30 backdrop-blur-[2px] z-40"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-cream-50 border-l border-stone-dark/10 z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-start justify-between px-6 py-5 border-b border-stone-dark/8 bg-white">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {pc && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wide ${pc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pc.dot} ${lead.priority === "urgent" ? "animate-pulse" : ""}`} />
                      {pc.label}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-xl font-bold text-stone-950 leading-tight">
                  {lead.customerName}
                </h2>
                {lead.company && (
                  <p className="font-sans text-[12px] text-stone-dark/45 mt-0.5">{lead.company}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-stone-dark/6 transition-colors text-stone-dark/40 hover:text-stone-950"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* AI Summary */}
              <div className="relative rounded-xl border border-amber-gold/30 bg-gradient-to-br from-amber-500/8 to-amber-600/4 p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <Sparkles size={14} className="text-amber-gold" />
                  <span className="text-[11px] font-sans font-bold text-amber-700 uppercase tracking-widest">
                    AI Lead Summary
                  </span>
                </div>
                <p className="font-sans text-[13px] text-stone-950 leading-relaxed">
                  {lead.aiSummary}
                </p>
              </div>

              {/* Stage selector */}
              <Section title="Pipeline Stage">
                <StageSelector
                  current={lead.stage}
                  onChange={(s) => onStageChange(lead.id, s)}
                />
              </Section>

              {/* Customer info */}
              <Section title="Customer Details">
                <div className="bg-white rounded-xl border border-stone-dark/8 px-4 divide-y divide-stone-dark/5">
                  <InfoRow label="Email" value={lead.email} />
                  <InfoRow label="Phone" value={lead.phone} />
                  <InfoRow label="City" value={lead.city} />
                  <InfoRow label="Company" value={lead.company} />
                  <InfoRow label="Assigned to" value={lead.assignedTo} />
                </div>
              </Section>

              {/* Inquiry details */}
              <Section title="Inquiry Details">
                <div className="bg-white rounded-xl border border-stone-dark/8 p-4 space-y-3">
                  <p className="font-sans text-[12.5px] text-stone-950 leading-relaxed italic text-stone-dark/60">
                    &ldquo;{lead.inquiryText}&rdquo;
                  </p>
                  <div className="border-t border-stone-dark/6 pt-3 space-y-0">
                    <InfoRow label="Material" value={lead.materialRequested} />
                    <InfoRow label="Area" value={lead.areaRequired} />
                    <InfoRow label="Application" value={lead.applicationArea} />
                    <InfoRow label="Budget" value={lead.budget} />
                  </div>
                </div>
              </Section>

              {/* Follow-up */}
              <Section title="Follow-up Reminder">
                <div className="bg-white rounded-xl border border-stone-dark/8 p-4">
                  <FollowUpScheduler
                    date={lead.followUpDate}
                    note={lead.followUpNote}
                    onSave={(d, n) => onFollowUpSave(lead.id, d, n)}
                  />
                </div>
              </Section>

              {/* Activity log */}
              <Section title={`Activity Log (${lead.activityLog.length})`}>
                <div className="bg-white rounded-xl border border-stone-dark/8 p-4">
                  <ActivityTimeline entries={lead.activityLog} />
                </div>
              </Section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

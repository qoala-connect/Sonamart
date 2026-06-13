"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Layers, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import type { VendorListing } from "./types";

// Counts up from 0 to target on mount
function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const steps = 28;
    const ms = 900 / steps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVal(Math.round((target * i) / steps));
      if (i >= steps) clearInterval(id);
    }, ms);
    return () => clearInterval(id);
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

interface CardConfig {
  label: string;
  desc: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accentBar: string;
  getValue: (listings: VendorListing[]) => number;
  format?: (n: number) => string;
}

const CARDS: CardConfig[] = [
  {
    label: "Total Listings",
    desc: "All stones submitted",
    icon: Layers,
    iconBg: "bg-stone-dark/7",
    iconColor: "text-stone-dark/60",
    accentBar: "bg-stone-dark/18",
    getValue: (l) => l.length,
  },
  {
    label: "Pending Review",
    desc: "Awaiting admin approval",
    icon: Clock,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
    accentBar: "bg-amber-400",
    getValue: (l) => l.filter((x) => x.status === "PENDING_APPROVAL").length,
  },
  {
    label: "Approved",
    desc: "Live on marketplace",
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    accentBar: "bg-emerald-500",
    getValue: (l) => l.filter((x) => x.status === "APPROVED").length,
  },
  {
    label: "Rejected",
    desc: "Did not pass review",
    icon: XCircle,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500",
    accentBar: "bg-red-500",
    getValue: (l) => l.filter((x) => x.status === "REJECTED").length,
  },
  {
    label: "Total Views",
    desc: "Across all live listings",
    icon: Eye,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    accentBar: "bg-blue-500",
    getValue: (l) => l.reduce((s, x) => s + x.views, 0),
  },
];

interface KPICardsProps {
  listings: VendorListing[];
}

export function KPICards({ listings }: KPICardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {CARDS.map((card, i) => {
        const Icon = card.icon;
        const value = card.getValue(listings);
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: i * 0.07,
              duration: 0.42,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative bg-white rounded-2xl border border-stone-dark/8 overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-shadow duration-300"
          >
            {/* Top accent bar */}
            <div className={`h-0.5 w-full ${card.accentBar}`} />

            <div className="p-5">
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${card.iconBg}`}
              >
                <Icon size={16} className={card.iconColor} />
              </div>

              {/* Value */}
              <p className="font-serif text-3xl font-bold text-stone-950 leading-none mb-1.5">
                <Counter target={value} />
              </p>

              {/* Label */}
              <p className="font-sans text-xs font-semibold text-stone-950 mb-0.5">
                {card.label}
              </p>
              <p className="font-sans text-[10px] text-stone-dark/38">
                {card.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

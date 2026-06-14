"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Plus, BadgeCheck, MapPin } from "lucide-react";
import { Container } from "@/components/ui";
import { KPICards } from "./KPICards";
import { ListingsTable } from "./ListingsTable";
import { ProductSubmissionForm } from "./ProductSubmissionForm";
import { INITIAL_LISTINGS, BG_FOR_MATERIAL } from "./data";
import type {
  VendorListing,
  ListingStatus,
  FormStep1,
  FormStep2,
  FormStep3,
} from "./types";

type Tab = "overview" | "submit";

// ─── Tab bar ──────────────────────────────────────────────────────────────────
function TabBar({
  active,
  onChange,
  pendingCount,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  pendingCount: number;
}) {
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "submit", label: "Add New Listing", icon: Plus },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-stone-dark/8 mb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative flex items-center gap-2 px-4 py-3.5 text-sm font-sans font-semibold transition-colors duration-200 focus:outline-none"
          >
            <Icon
              size={14}
              className={isActive ? "text-amber-gold" : "text-stone-dark/35"}
            />
            <span className={isActive ? "text-stone-950" : "text-stone-dark/45"}>
              {tab.label}
            </span>
            {tab.id === "overview" && pendingCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full">
                {pendingCount}
              </span>
            )}
            {/* Active underline */}
            {isActive && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-gold rounded-t-full"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Vendor Portal ───────────────────────────────────────────────────────
export function VendorPortal() {
  const [listings, setListings] = useState<VendorListing[]>(INITIAL_LISTINGS);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [editData, setEditData] = useState<{
    step1: FormStep1;
    step2: FormStep2;
  } | null>(null);

  // ── OOS toggle (optimistic) ──
  const handleToggleOOS = useCallback((id: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, isOutOfStock: !l.isOutOfStock } : l
      )
    );
  }, []);

  // ── Open edit form for a CHANGES_REQUESTED listing ──
  const handleEditListing = useCallback(
    (id: string) => {
      const listing = listings.find((l) => l.id === id);
      if (!listing) return;
      setEditData({
        step1: {
          name: listing.name,
          materialType: listing.materialType,
          category: listing.category,
          stockQty: String(listing.stockQty),
          pricePerUnit: String(listing.pricePerUnit),
          unit: listing.unit,
        },
        step2: {
          color: listing.color,
          finish: listing.finish,
          thickness: listing.thickness,
          dimensions: listing.dimensions,
          warehouseCity: listing.warehouseCity,
        },
      });
      setActiveTab("submit");
    },
    [listings]
  );

  // ── Handle form submission ──
  const handleFormSubmit = useCallback(
    (
      action: "draft" | "review",
      data: { step1: FormStep1; step2: FormStep2; step3: FormStep3 }
    ) => {
      const { step1, step2 } = data;
      const mat = BG_FOR_MATERIAL[step1.materialType] ?? BG_FOR_MATERIAL.other;

      const newListing: VendorListing = {
        id: `v${Date.now()}`,
        name: step1.name,
        materialType: step1.materialType,
        category: step1.category,
        color: step2.color,
        finish: step2.finish,
        thickness: step2.thickness,
        dimensions: step2.dimensions,
        warehouseCity: step2.warehouseCity,
        pricePerUnit: parseFloat(step1.pricePerUnit) || 0,
        unit: step1.unit,
        stockQty: parseInt(step1.stockQty) || 0,
        isOutOfStock: false,
        status: (action === "draft" ? "DRAFT" : "PENDING_APPROVAL") as ListingStatus,
        views: 0,
        createdAt: Math.floor(Date.now() / 1000),
        bg: mat.bg,
        textLight: mat.textLight,
      };

      setListings((prev) => [newListing, ...prev]);
      setEditData(null);

      // After success animation, return to overview
      setTimeout(() => setActiveTab("overview"), 2500);
    },
    []
  );

  const pendingCount = listings.filter(
    (l) => l.status === "PENDING_APPROVAL" || l.status === "CHANGES_REQUESTED"
  ).length;

  return (
    <>
      {/* ── Header ── */}
      <div className="bg-stone-950 py-8 border-b border-white/5">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-start justify-between gap-4 flex-wrap"
          >
            <div>
              <p className="text-amber-gold font-sans text-[11px] font-semibold uppercase tracking-[0.18em] mb-2">
                Vendor Portal
              </p>
              <h1 className="font-serif text-3xl font-bold text-stone-light leading-tight">
                Rajesh Stone Co.
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-stone-light/45 text-xs font-sans">
                  <MapPin size={11} className="text-amber-gold/70" />
                  Mumbai, India
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/12 border border-emerald-500/20 rounded-full">
                  <BadgeCheck size={11} className="text-emerald-400" />
                  <span className="text-[10px] font-sans font-semibold text-emerald-400">
                    Verified Vendor
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={() => {
                setEditData(null);
                setActiveTab("submit");
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-gold text-stone-950 font-sans font-semibold text-sm rounded-xl hover:bg-amber-gold/85 transition-colors shadow-[0_2px_12px_rgba(201,169,97,0.28)] self-start mt-1"
            >
              <Plus size={15} />
              Add New Listing
            </motion.button>
          </motion.div>
        </Container>
      </div>

      {/* ── Page body ── */}
      <div className="bg-cream-50 min-h-screen">
        <Container>
          <div className="py-8">
            <TabBar
              active={activeTab}
              onChange={(t) => {
                setActiveTab(t);
                if (t === "submit") setEditData(null);
              }}
              pendingCount={pendingCount}
            />

            <AnimatePresence mode="wait">
              {activeTab === "overview" ? (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  {/* KPI cards */}
                  <KPICards listings={listings} />

                  {/* Divider */}
                  <div className="border-t border-stone-dark/7" />

                  {/* Listings table */}
                  <ListingsTable
                    listings={listings}
                    onToggleOOS={handleToggleOOS}
                    onEditListing={handleEditListing}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="submit"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {editData && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-2xl mx-auto mb-5 p-3.5 bg-orange-50 border border-orange-200/60 rounded-xl flex items-center gap-2.5"
                    >
                      <span className="text-orange-500 text-sm">⚠</span>
                      <p className="font-sans text-xs text-orange-700 font-medium">
                        Editing a listing with admin feedback — address all
                        comments before resubmitting.
                      </p>
                    </motion.div>
                  )}
                  <ProductSubmissionForm
                    onSubmit={handleFormSubmit}
                    editListing={editData}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Container>
      </div>
    </>
  );
}

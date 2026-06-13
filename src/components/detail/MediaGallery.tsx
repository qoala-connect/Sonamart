"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Play, ZoomIn, ChevronLeft, ChevronRight, GripHorizontal } from "lucide-react";
import type { CatalogProduct } from "@/components/catalog/types";

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

interface MediaSlot {
  id: string;
  bg: string;
  label: string;
  isVideo: boolean;
}

function makeSlots(product: CatalogProduct): MediaSlot[] {
  const b = product.bg;
  return [
    { id: "main", bg: b, label: "Main View", isVideo: false },
    {
      id: "warm",
      bg: `linear-gradient(180deg, rgba(201,169,97,0.18) 0%, transparent 55%), ${b}`,
      label: "Warm Lighting",
      isVideo: false,
    },
    {
      id: "detail",
      bg: `linear-gradient(135deg, rgba(0,0,0,0.12) 0%, transparent 40%), ${b}`,
      label: "Detail Close-up",
      isVideo: false,
    },
    {
      id: "cool",
      bg: `linear-gradient(0deg, rgba(60,90,140,0.14) 0%, transparent 60%), ${b}`,
      label: "Cool Light",
      isVideo: false,
    },
    {
      id: "edge",
      bg: `linear-gradient(90deg, rgba(0,0,0,0.22) 0%, transparent 35%), ${b}`,
      label: "Edge Profile",
      isVideo: false,
    },
    {
      id: "video",
      bg: b,
      label: "Installation Video",
      isVideo: true,
    },
  ];
}

interface MediaGalleryProps {
  product: CatalogProduct;
}

export function MediaGallery({ product }: MediaGalleryProps) {
  const [slots, setSlots] = useState<MediaSlot[]>(() => makeSlots(product));
  const [activeIdx, setActiveIdx] = useState(0);

  const activeSlot = slots[activeIdx];

  function goTo(idx: number) {
    setActiveIdx(((idx % slots.length) + slots.length) % slots.length);
  }

  function handleReorder(newOrder: MediaSlot[]) {
    const activeId = slots[activeIdx].id;
    setSlots(newOrder);
    const newIdx = newOrder.findIndex((s) => s.id === activeId);
    setActiveIdx(newIdx >= 0 ? newIdx : 0);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Hero image ── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: "4/3" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlot.id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0"
            style={{ background: activeSlot.bg }}
          />
        </AnimatePresence>

        {/* Noise overlay */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: NOISE_URI, backgroundSize: "128px 128px" }}
        />

        {/* Video play button */}
        {activeSlot.isVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/25"
          >
            <motion.div
              className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/25 cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.25)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={22} className="text-white ml-1" fill="white" />
            </motion.div>
          </motion.div>
        )}

        {/* Bottom scrim + label */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-3.5 left-4 right-14">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeSlot.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-[11px] font-sans font-medium text-white/65"
            >
              {activeSlot.label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Counter */}
        <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 bg-black/30 backdrop-blur-sm rounded-full text-[10px] font-sans font-medium text-white/80">
          {activeIdx + 1} / {slots.length}
        </div>

        {/* Zoom icon top-left */}
        <div className="absolute top-3 left-3 p-2 bg-black/20 backdrop-blur-sm rounded-xl">
          <ZoomIn size={14} className="text-white/65" />
        </div>

        {/* Nav arrows */}
        <button
          onClick={() => goTo(activeIdx - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/22 hover:bg-black/38 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => goTo(activeIdx + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/22 hover:bg-black/38 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── Thumbnails (drag to reorder) ── */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <GripHorizontal size={11} className="text-stone-dark/30" />
          <p className="text-[10px] font-sans text-stone-dark/30 uppercase tracking-[0.1em]">
            Drag thumbnails to reorder
          </p>
        </div>

        <Reorder.Group
          axis="x"
          values={slots}
          onReorder={handleReorder}
          className="flex gap-2.5"
        >
          {slots.map((slot, idx) => (
            <Reorder.Item
              key={slot.id}
              value={slot}
              style={{ listStyle: "none" }}
              whileDrag={{ scale: 1.08, zIndex: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
              className="flex-shrink-0"
            >
              <motion.button
                onClick={() => setActiveIdx(idx)}
                className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  idx === activeIdx
                    ? "border-amber-gold shadow-[0_0_0_3px_rgba(201,169,97,0.22)]"
                    : "border-transparent hover:border-stone-dark/18"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                style={{ cursor: "grab" }}
              >
                {/* Stone bg */}
                <div className="absolute inset-0" style={{ background: slot.bg }} />
                {/* Noise */}
                <div
                  className="absolute inset-0 opacity-15 mix-blend-overlay"
                  style={{ backgroundImage: NOISE_URI, backgroundSize: "64px 64px" }}
                />
                {/* Video overlay */}
                {slot.isVideo && (
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <Play size={11} className="text-white" fill="white" />
                  </div>
                )}
                {/* Active indicator */}
                {idx === activeIdx && (
                  <motion.div
                    layoutId="thumbActiveDot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-gold rounded-full"
                  />
                )}
              </motion.button>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}

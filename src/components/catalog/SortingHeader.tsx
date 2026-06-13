"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  ChevronDown,
  SlidersHorizontal,
  Camera,
  MapPin,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "./data";
import type { ViewMode, SortOption } from "./types";

interface SortingHeaderProps {
  resultCount: number;
  viewMode: ViewMode;
  onViewChange: (v: ViewMode) => void;
  sortBy: SortOption;
  onSortChange: (v: SortOption) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
  onOpenAISearch: () => void;
  userCity: string;
  isAISearchActive: boolean;
}

export function SortingHeader({
  resultCount,
  viewMode,
  onViewChange,
  sortBy,
  onSortChange,
  activeFilterCount,
  onOpenFilters,
  onOpenAISearch,
  userCity,
  isAISearchActive,
}: SortingHeaderProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeSort = SORT_OPTIONS.find((o) => o.value === sortBy)!;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Results count + city boost pill */}
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <motion.p
          key={resultCount}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-sans text-sm text-stone-dark/70"
        >
          <span className="font-semibold text-stone-950">{resultCount}</span>{" "}
          {resultCount === 1 ? "stone" : "stones"} found
        </motion.p>

        {sortBy === "recommended" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-gold/10 border border-amber-gold/25 rounded-full text-[10px] font-sans font-semibold text-amber-gold"
          >
            <MapPin size={9} />
            {userCity}-first
          </motion.span>
        )}

        {isAISearchActive && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1 px-2.5 py-1 bg-stone-950/10 border border-stone-950/20 rounded-full text-[10px] font-sans font-semibold text-stone-950"
          >
            <Camera size={9} />
            AI Results
          </motion.span>
        )}
      </div>

      {/* AI Image Search button */}
      <motion.button
        onClick={onOpenAISearch}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold border transition-all duration-200",
          isAISearchActive
            ? "bg-stone-950 text-stone-light border-stone-950"
            : "bg-stone-light border-stone-dark/15 text-stone-dark/70 hover:border-amber-gold/40 hover:text-amber-gold"
        )}
      >
        <Camera size={13} />
        {isAISearchActive ? "AI Active" : "Image Search"}
      </motion.button>

      {/* Sort dropdown */}
      <div className="relative" ref={sortRef}>
        <motion.button
          onClick={() => setSortOpen((v) => !v)}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 pl-3.5 pr-3 py-2 bg-white border border-stone-dark/12 rounded-xl text-sm font-sans hover:border-stone-dark/25 transition-colors shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
        >
          <span className="text-stone-dark/45 text-xs font-medium hidden sm:inline">
            Sort:
          </span>
          <span className="font-medium text-stone-950">{activeSort.label}</span>
          <motion.div
            animate={{ rotate: sortOpen ? 180 : 0 }}
            transition={{ duration: 0.18 }}
          >
            <ChevronDown size={13} className="text-stone-dark/40" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {sortOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute top-full right-0 mt-1.5 w-52 bg-white border border-stone-dark/8 rounded-2xl shadow-luxury-lg z-20 overflow-hidden py-1"
            >
              {SORT_OPTIONS.map((opt) => (
                <motion.button
                  key={opt.value}
                  onClick={() => {
                    onSortChange(opt.value as SortOption);
                    setSortOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-stone-dark/5 transition-colors duration-100",
                    opt.value === sortBy && "bg-amber-gold/8"
                  )}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.1 }}
                >
                  <span
                    className={cn(
                      "text-sm font-sans",
                      opt.value === sortBy
                        ? "font-semibold text-amber-gold"
                        : "text-stone-950"
                    )}
                  >
                    {opt.label}
                  </span>
                  {opt.value === sortBy && (
                    <Check size={13} className="text-amber-gold" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View mode toggle */}
      <div className="flex items-center gap-0.5 p-1 bg-white border border-stone-dark/10 rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
        {(["grid", "list"] as ViewMode[]).map((mode) => (
          <motion.button
            key={mode}
            onClick={() => onViewChange(mode)}
            whileTap={{ scale: 0.93 }}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200",
              viewMode === mode
                ? "bg-stone-950 text-stone-light shadow-sm"
                : "text-stone-dark/40 hover:text-stone-dark/70"
            )}
            title={mode === "grid" ? "Grid view" : "List view"}
          >
            {mode === "grid" ? (
              <LayoutGrid size={16} />
            ) : (
              <List size={16} />
            )}
          </motion.button>
        ))}
      </div>

      {/* Mobile: Filters button */}
      <motion.button
        onClick={onOpenFilters}
        whileTap={{ scale: 0.97 }}
        className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-white border border-stone-dark/12 rounded-xl text-sm font-sans font-medium text-stone-dark/70 hover:border-stone-dark/25 transition-colors shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
      >
        <SlidersHorizontal size={14} />
        Filters
        {activeFilterCount > 0 && (
          <span className="w-4 h-4 text-[10px] font-bold bg-amber-gold text-stone-950 rounded-full flex items-center justify-center leading-none">
            {activeFilterCount}
          </span>
        )}
      </motion.button>
    </div>
  );
}

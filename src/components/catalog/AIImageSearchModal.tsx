"use client";

import React, { useState, useEffect, useRef, useCallback, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATALOG_PRODUCTS, AI_SEARCH_MOCK_RESULTS } from "./data";

type ModalState = "idle" | "processing" | "results";

const ANALYSIS_STEPS = [
  { label: "Analyzing color palette", detail: "Extracting dominant tones & gradients" },
  { label: "Detecting texture pattern", detail: "Identifying surface roughness & grain" },
  { label: "Identifying veining structure", detail: "Mapping vein thickness & distribution" },
  { label: "Matching catalog stones", detail: "Searching 5,000+ verified stones" },
];

const STEP_DURATIONS = [950, 900, 850, 750]; // ms per step

interface AIImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchComplete: (ids: string[]) => void;
}

export function AIImageSearchModal({
  isOpen,
  onClose,
  onSearchComplete,
}: AIImageSearchModalProps) {
  const [modalState, setModalState] = useState<ModalState>("idle");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const matchedProducts = CATALOG_PRODUCTS.filter((p) =>
    AI_SEARCH_MOCK_RESULTS.includes(p.id)
  );

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setModalState("idle");
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setCompletedSteps([]);
        setCurrentStep(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, imagePreview]);

  // Processing state machine — walks through steps sequentially
  useEffect(() => {
    if (modalState !== "processing") return;

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const runSteps = () => {
      let cumulativeDelay = 0;
      STEP_DURATIONS.forEach((duration, i) => {
        // Mark step as current
        const startTimer = setTimeout(() => setCurrentStep(i), cumulativeDelay);
        // Mark step as completed
        const endTimer = setTimeout(() => {
          setCompletedSteps((prev) => [...prev, i]);
        }, cumulativeDelay + duration);
        timeouts.push(startTimer, endTimer);
        cumulativeDelay += duration;
      });

      // Transition to results after all steps complete
      const resultsTimer = setTimeout(() => {
        setModalState("results");
      }, cumulativeDelay + 300);
      timeouts.push(resultsTimer);
    };

    runSteps();
    return () => timeouts.forEach(clearTimeout);
  }, [modalState]);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      setCompletedSteps([]);
      setCurrentStep(0);
      setModalState("processing");
    },
    [imagePreview]
  );

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleViewResults = () => {
    onSearchComplete(AI_SEARCH_MOCK_RESULTS);
    onClose();
  };

  const handleReset = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setCompletedSteps([]);
    setCurrentStep(0);
    setModalState("idle");
  };

  const totalDuration = STEP_DURATIONS.reduce((a, b) => a + b, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-stone-dark/70 backdrop-blur-sm z-50"
            onClick={modalState === "idle" ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-auto px-4"
          >
            <div className="bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.25)] overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-dark/6">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-stone-950 rounded-lg flex items-center justify-center">
                    <Camera size={14} className="text-amber-gold" />
                  </div>
                  <div>
                    <p className="font-serif text-base font-semibold text-stone-950 leading-tight">
                      AI Image Search
                    </p>
                    <p className="text-[10px] font-sans text-stone-dark/40 leading-none mt-0.5">
                      Find visually similar stones
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-stone-dark/6 transition-colors"
                  whileTap={{ scale: 0.92 }}
                >
                  <X size={16} className="text-stone-dark/50" />
                </motion.button>
              </div>

              {/* ── IDLE STATE: Drop zone ── */}
              <AnimatePresence mode="wait">
                {modalState === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileInput}
                    />

                    <motion.div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
                        isDragging
                          ? "border-amber-gold bg-amber-gold/5"
                          : "border-stone-dark/15 hover:border-amber-gold/50 hover:bg-stone-dark/3"
                      )}
                    >
                      {/* Pulsing camera icon */}
                      <motion.div
                        className="w-14 h-14 bg-stone-dark/5 rounded-2xl flex items-center justify-center"
                        animate={isDragging ? { scale: 1.1 } : { scale: [1, 1.04, 1] }}
                        transition={
                          isDragging
                            ? { duration: 0.2 }
                            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }
                      >
                        <Upload size={22} className={cn(isDragging ? "text-amber-gold" : "text-stone-dark/40")} />
                      </motion.div>

                      <div className="text-center">
                        <p className="font-sans text-sm font-semibold text-stone-950 mb-1">
                          {isDragging ? "Drop it here" : "Drop a stone image here"}
                        </p>
                        <p className="text-xs font-sans text-stone-dark/45">
                          or{" "}
                          <span className="text-amber-gold font-medium underline-offset-2 hover:underline">
                            click to browse
                          </span>{" "}
                          · JPG, PNG, WebP
                        </p>
                      </div>

                      {/* Feature tags */}
                      <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {["Color match", "Texture analysis", "Vein pattern"].map((f) => (
                          <span
                            key={f}
                            className="px-2.5 py-1 bg-stone-dark/5 rounded-full text-[10px] font-sans text-stone-dark/55"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* ── PROCESSING STATE ── */}
                {modalState === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="flex gap-5">
                      {/* Image preview with spinner */}
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-stone-dark/10">
                          {imagePreview && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imagePreview}
                              alt="Analyzing"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        {/* Spinning ring overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="w-24 h-24 rounded-full border-2 border-transparent"
                            style={{ borderTopColor: "#c9a961", borderRightColor: "rgba(201,169,97,0.3)" }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </div>

                      {/* Steps list */}
                      <div className="flex-1 space-y-3">
                        {ANALYSIS_STEPS.map((step, i) => {
                          const isCompleted = completedSteps.includes(i);
                          const isCurrent = currentStep === i && !isCompleted;
                          return (
                            <div key={i} className="space-y-1">
                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                  >
                                    <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                                  </motion.div>
                                ) : isCurrent ? (
                                  <Loader2 size={13} className="text-amber-gold animate-spin flex-shrink-0" />
                                ) : (
                                  <div className="w-3 h-3 rounded-full border border-stone-dark/20 flex-shrink-0" />
                                )}
                                <p
                                  className={cn(
                                    "text-xs font-sans leading-tight",
                                    isCompleted
                                      ? "text-stone-950 font-medium"
                                      : isCurrent
                                      ? "text-stone-950 font-medium"
                                      : "text-stone-dark/35"
                                  )}
                                >
                                  {step.label}
                                </p>
                              </div>

                              {/* Progress bar — only shows for current step */}
                              {(isCurrent || isCompleted) && (
                                <div className="ml-5 h-1 bg-stone-dark/6 rounded-full overflow-hidden">
                                  <motion.div
                                    className={cn(
                                      "h-full rounded-full",
                                      isCompleted ? "bg-emerald-400" : "bg-amber-gold"
                                    )}
                                    initial={{ width: isCompleted ? "100%" : "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={
                                      isCompleted
                                        ? { duration: 0 }
                                        : {
                                            duration: STEP_DURATIONS[i] / 1000,
                                            ease: "linear",
                                          }
                                    }
                                  />
                                </div>
                              )}

                              {isCurrent && (
                                <p className="ml-5 text-[10px] font-sans text-stone-dark/40">
                                  {step.detail}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Overall progress */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-sans text-stone-dark/40 uppercase tracking-wider">
                          Analysis progress
                        </span>
                        <span className="text-[10px] font-sans font-semibold text-stone-950">
                          {Math.round(
                            ((completedSteps.length +
                              (currentStep < ANALYSIS_STEPS.length ? 0.5 : 0)) /
                              ANALYSIS_STEPS.length) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="h-1.5 bg-stone-dark/6 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-gold to-bronze-accent rounded-full"
                          initial={{ width: "0%" }}
                          animate={{
                            width: `${
                              ((completedSteps.length +
                                (currentStep < ANALYSIS_STEPS.length ? 0.5 : 0)) /
                                ANALYSIS_STEPS.length) *
                              100
                            }%`,
                          }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── RESULTS STATE ── */}
                {modalState === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="p-6"
                  >
                    {/* Results header */}
                    <div className="flex items-center gap-3 mb-5">
                      {imagePreview && (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-dark/10 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imagePreview}
                            alt="Your search"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-amber-gold" />
                          <p className="font-serif text-base font-semibold text-stone-950">
                            {matchedProducts.length} Visually Similar Stones
                          </p>
                        </div>
                        <p className="text-[10px] font-sans text-stone-dark/45 mt-0.5">
                          Matched on color, texture, and veining pattern
                        </p>
                      </div>
                    </div>

                    {/* Match cards */}
                    <div className="space-y-2.5 mb-5">
                      {matchedProducts.map((p, i) => (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                          className="flex items-center gap-3 p-3 bg-stone-dark/3 rounded-xl border border-stone-dark/6 hover:border-amber-gold/25 transition-colors cursor-pointer"
                        >
                          {/* Stone thumbnail */}
                          <div
                            className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden"
                            style={{ background: p.bg }}
                          />

                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-sm font-semibold text-stone-950 leading-tight truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] font-sans text-stone-dark/45 mt-0.5">
                              {p.materialType} · {p.finish} · {p.location}
                            </p>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p className="font-serif text-xs font-semibold text-amber-gold">
                              {p.priceRange}
                            </p>
                            {/* Match confidence bar */}
                            <div className="flex items-center gap-1 mt-1 justify-end">
                              <div className="h-1 w-12 bg-stone-dark/8 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-amber-gold rounded-full"
                                  style={{ width: `${92 - i * 7}%` }}
                                />
                              </div>
                              <span className="text-[9px] text-stone-dark/40 font-sans">
                                {92 - i * 7}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA row */}
                    <div className="flex items-center justify-between gap-3">
                      <motion.button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 text-xs font-sans font-medium text-stone-dark/50 hover:text-stone-950 transition-colors"
                        whileHover={{ scale: 1.03 }}
                      >
                        <RotateCcw size={12} />
                        Search again
                      </motion.button>

                      <motion.button
                        onClick={handleViewResults}
                        whileHover={{ scale: 1.03, x: 2 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-stone-950 text-stone-light font-sans text-xs font-semibold rounded-xl hover:bg-stone-dark/85 transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
                      >
                        View in Catalog
                        <ArrowRight size={13} />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

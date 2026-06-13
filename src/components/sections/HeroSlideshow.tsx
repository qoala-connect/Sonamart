"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Camera, ArrowRight, X } from "lucide-react";
import { Container } from "@/components/ui";

const SLIDES = [
  {
    id: 1,
    eyebrow: "Italian Heritage",
    title: ["Where Rarity", "Meets Architecture"],
    subtitle: "Premium marble & granite sourced from the world's finest quarries — direct to your project.",
    bgGradient: "radial-gradient(ellipse at 15% 60%, #f0ece5 0%, #e3dcd2 35%, #ccc4b6 65%, #b8b0a0 100%)",
    patternColor: "rgba(139, 115, 85, 0.05)",
    overlayFrom: "rgba(10,10,10,0.45)",
    overlayTo: "rgba(10,10,10,0.15)",
  },
  {
    id: 2,
    eyebrow: "Norwegian Origin",
    title: ["The Strength", "of Centuries"],
    subtitle: "Black Absolute Granite — enduring character for landmark architecture and landmark projects.",
    bgGradient: "radial-gradient(ellipse at 75% 30%, #2e2e2e 0%, #141414 50%, #0a0a0a 100%)",
    patternColor: "rgba(201, 169, 97, 0.06)",
    overlayFrom: "rgba(0,0,0,0.5)",
    overlayTo: "rgba(0,0,0,0.1)",
  },
  {
    id: 3,
    eyebrow: "Engineered Perfection",
    title: ["Precision.", "Purity. Stone."],
    subtitle: "Contemporary quartz surfaces — the preferred choice of leading interior architects across India.",
    bgGradient: "linear-gradient(145deg, #c9a961 0%, #9a7638 25%, #1f1f1f 55%, #0d0d0d 100%)",
    patternColor: "rgba(255,255,255,0.04)",
    overlayFrom: "rgba(0,0,0,0.55)",
    overlayTo: "rgba(0,0,0,0.1)",
  },
];

const SUGGESTIONS = ["Italian Marble", "Black Granite", "Calacatta", "Quartz Slabs", "Sandstone"];

function GlobalSearchBar() {
  const [query, setQuery] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    },
    [imagePreview]
  );

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Search input row */}
      <div className="flex items-center bg-white/96 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden">
        <Search size={17} className="ml-5 text-stone-dark/35 flex-shrink-0" />

        <input
          type="text"
          placeholder="Search by stone type, finish, city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && console.log("Search:", query)}
          className="flex-1 px-4 py-4 text-stone-950 placeholder-stone-dark/30 bg-transparent focus:outline-none font-sans text-sm md:text-[15px]"
          autoComplete="off"
        />

        {/* Image preview chip */}
        {imagePreview && (
          <div className="relative flex-shrink-0 mr-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Search preview"
              className="w-8 h-8 rounded-lg object-cover border border-stone-dark/10"
            />
            <button
              onClick={clearImage}
              className="absolute -top-1 -right-1 w-4 h-4 bg-stone-950 rounded-full flex items-center justify-center hover:bg-stone-dark/80"
            >
              <X size={8} className="text-white" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1 pr-2 flex-shrink-0">
          {/* Hidden file input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />

          {/* AI Image Search button */}
          <motion.button
            onClick={() => fileRef.current?.click()}
            className="p-2.5 rounded-xl hover:bg-amber-gold/10 transition-colors group"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            title="AI Image Search — upload a stone photo to find matches"
          >
            <Camera
              size={17}
              className="text-amber-gold group-hover:text-amber-gold/75 transition-colors"
            />
          </motion.button>

          {/* Search submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 bg-stone-950 text-stone-light font-sans text-sm font-medium rounded-xl hover:bg-stone-dark/90 transition-colors mr-1 flex-shrink-0"
          >
            Search
          </motion.button>
        </div>
      </div>

      {/* Suggestion chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        className="flex flex-wrap justify-center gap-2 mt-4"
      >
        {SUGGESTIONS.map((s) => (
          <motion.button
            key={s}
            onClick={() => setQuery(s)}
            className="px-3.5 py-1.5 text-xs font-sans font-medium text-stone-light/75 border border-stone-light/20 rounded-full hover:bg-stone-light/12 hover:border-stone-light/45 hover:text-stone-light transition-all duration-250"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {s}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((p) => (p + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[current];

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "calc(100vh - 80px)", minHeight: 580, maxHeight: 920 }}
    >
      {/* ── Background crossfade ── */}
      <AnimatePresence>
        <motion.div
          key={`bg-${current}`}
          style={{ background: slide.bgGradient }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0"
        >
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${slide.patternColor} 1px, transparent 1px), linear-gradient(90deg, ${slide.patternColor} 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Persistent dark vignette overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${slide.overlayFrom} 0%, ${slide.overlayTo} 100%)`,
          transition: "background 1.2s ease",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent pointer-events-none" />

      {/* ── Content ── */}
      <Container className="relative h-full flex flex-col justify-center items-center text-center pb-24 pt-8">
        {/* Text block — wait mode so lines animate cleanly per slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`copy-${current}`}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-5"
            >
              <span className="w-6 h-px bg-amber-gold/80" />
              <span className="text-amber-gold font-sans text-xs md:text-sm font-medium uppercase tracking-[0.22em]">
                {slide.eyebrow}
              </span>
              <span className="w-6 h-px bg-amber-gold/80" />
            </motion.div>

            {/* Headline — each line staggers in */}
            <h1
              className="font-serif font-bold text-stone-light leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
            >
              {slide.title.map((line, i) => (
                <motion.span
                  key={`${current}-${i}`}
                  className="block"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.12 + i * 0.14,
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="font-sans text-stone-light/65 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
            >
              {slide.subtitle}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Global Search Bar */}
        <GlobalSearchBar />

        {/* Elegant scroll CTA */}
        <motion.a
          href="#categories"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 group cursor-pointer"
          aria-label="Scroll to categories"
        >
          <span className="text-stone-light/45 font-sans text-[10px] uppercase tracking-[0.2em] group-hover:text-amber-gold transition-colors duration-300">
            Explore
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight size={13} className="text-amber-gold rotate-90" />
          </motion.div>
        </motion.a>
      </Container>

      {/* ── Slide indicators — right side ── */}
      <div className="absolute bottom-10 right-6 md:right-10 flex flex-col gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="flex items-center justify-end gap-2 group"
            aria-label={`Go to slide ${i + 1}`}
          >
            <motion.span
              animate={{ opacity: i === current ? 0.6 : 0 }}
              className="text-stone-light text-[10px] font-sans"
            >
              0{i + 1}
            </motion.span>
            <div className="relative h-px overflow-hidden bg-stone-light/20 rounded-full"
              style={{ width: i === current ? 32 : 18 }}
            >
              {i === current && (
                <motion.div
                  className="absolute inset-y-0 left-0 bg-amber-gold"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6.5, ease: "linear" }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

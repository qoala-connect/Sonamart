"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui";
import { MapPin, ChevronDown, Menu, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const CITIES = [
  { id: "mumbai", name: "Mumbai", region: "Maharashtra" },
  { id: "delhi", name: "Delhi", region: "Delhi NCR" },
  { id: "bangalore", name: "Bangalore", region: "Karnataka" },
  { id: "hyderabad", name: "Hyderabad", region: "Telangana" },
  { id: "pune", name: "Pune", region: "Maharashtra" },
  { id: "kolkata", name: "Kolkata", region: "West Bengal" },
  { id: "chennai", name: "Chennai", region: "Tamil Nadu" },
  { id: "jaipur", name: "Jaipur", region: "Rajasthan" },
  { id: "ahmedabad", name: "Ahmedabad", region: "Gujarat" },
  { id: "surat", name: "Surat", region: "Gujarat" },
];

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/collections", label: "Collections" },
  { href: "/vendors", label: "Vendors" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [cityOpen, setCityOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("mumbai");
  const [scrolled, setScrolled] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromCookie = document.cookie
      .split("; ")
      .find((r) => r.startsWith("selectedCity="))
      ?.split("=")[1];
    if (fromCookie) setSelectedCity(fromCookie);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCity = CITIES.find((c) => c.id === selectedCity);

  const handleSelectCity = (id: string) => {
    setSelectedCity(id);
    setCityOpen(false);
    document.cookie = `selectedCity=${id}; path=/; max-age=31536000`;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-stone-light/98 backdrop-blur-md shadow-luxury border-b border-stone-dark/10"
          : "bg-stone-light/95 backdrop-blur-sm border-b border-stone-dark/5"
      )}
    >
      <Container>
        <div className="relative flex items-center justify-between h-20">
          {/* Logo — left-aligned, minimalist */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0 z-10">
            <div className="relative w-9 h-9">
              <div className="w-9 h-9 bg-stone-950 rounded-lg flex items-center justify-center">
                <span className="text-amber-gold font-serif font-bold text-base leading-none">S</span>
              </div>
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-gold rounded-sm"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-serif text-xl font-semibold text-stone-950 tracking-tight leading-none">
                Stonamart
              </p>
              <p className="text-[10px] text-stone-dark/40 font-sans uppercase tracking-[0.15em] leading-none mt-0.5">
                Premium Stone
              </p>
            </div>
          </Link>

          {/* Nav — centered absolutely */}
          <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((item) => (
              <motion.div key={item.href} whileHover={{ y: -1 }} transition={{ duration: 0.15 }}>
                <Link
                  href={item.href}
                  className="relative text-stone-dark/60 font-sans text-sm font-medium hover:text-stone-950 transition-colors duration-200 group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right — City Selector + CTA */}
          <div className="flex items-center gap-3 z-10">
            {/* BookMyShow-style City Selector */}
            <div className="relative hidden sm:block" ref={cityRef}>
              <motion.button
                onClick={() => setCityOpen((v) => !v)}
                className="flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-xl border border-stone-dark/15 hover:border-amber-gold/50 hover:bg-amber-gold/5 transition-all duration-200"
                whileTap={{ scale: 0.97 }}
                aria-label="Select delivery city"
              >
                <MapPin size={14} className="text-amber-gold flex-shrink-0" />
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-[9px] text-stone-dark/40 font-sans uppercase tracking-[0.18em] leading-none">
                    Delivering to
                  </span>
                  <span className="text-sm font-semibold text-stone-950 font-sans leading-tight">
                    {activeCity?.name}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: cityOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={13} className="text-stone-dark/50 flex-shrink-0" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {cityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white border border-stone-dark/8 rounded-2xl shadow-luxury-lg z-50 overflow-hidden"
                  >
                    <div className="px-4 pt-3.5 pb-2 border-b border-stone-dark/5">
                      <p className="text-[10px] font-semibold text-stone-dark/35 uppercase tracking-[0.15em]">
                        Select Your City
                      </p>
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1">
                      {CITIES.map((city) => (
                        <motion.button
                          key={city.id}
                          onClick={() => handleSelectCity(city.id)}
                          className={cn(
                            "w-full px-4 py-3 text-left flex items-center justify-between hover:bg-stone-dark/5 transition-colors duration-150",
                            city.id === selectedCity && "bg-amber-gold/8"
                          )}
                          whileHover={{ x: 2 }}
                          transition={{ duration: 0.1 }}
                        >
                          <div>
                            <p
                              className={cn(
                                "text-sm font-medium",
                                city.id === selectedCity
                                  ? "text-amber-gold"
                                  : "text-stone-950"
                              )}
                            >
                              {city.name}
                            </p>
                            <p className="text-xs text-stone-dark/40 font-sans mt-0.5">
                              {city.region}
                            </p>
                          </div>
                          {city.id === selectedCity && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <Check size={14} className="text-amber-gold" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex btn-luxury text-sm font-medium rounded-xl px-5 py-2.5 whitespace-nowrap"
            >
              Get a Quote
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg hover:bg-stone-dark/5 transition-colors"
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={20} className="text-stone-950" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={20} className="text-stone-950" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden border-t border-stone-dark/5 bg-stone-light overflow-hidden"
          >
            <Container>
              <div className="py-4 space-y-1">
                {NAV_LINKS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-3 text-stone-dark/65 hover:text-stone-950 hover:bg-stone-dark/5 rounded-lg font-sans font-medium text-sm transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-3 mt-1 border-t border-stone-dark/5">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-amber-gold" />
                      <div>
                        <p className="text-[9px] text-stone-dark/40 uppercase tracking-widest">
                          Delivering to
                        </p>
                        <p className="text-sm font-semibold text-stone-950">
                          {activeCity?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-xs text-amber-gold font-medium hover:underline underline-offset-2"
                      onClick={() => {
                        setMobileOpen(false);
                        setTimeout(() => setCityOpen(true), 300);
                      }}
                    >
                      Change
                    </button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="mx-4 mt-2 w-[calc(100%-2rem)] btn-luxury text-sm font-medium rounded-xl py-3"
                  >
                    Get a Quote
                  </motion.button>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

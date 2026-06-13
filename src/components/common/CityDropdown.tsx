"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CITIES = [
  { id: "mumbai", name: "Mumbai", code: "MH" },
  { id: "delhi", name: "Delhi", code: "DL" },
  { id: "bangalore", name: "Bangalore", code: "KA" },
  { id: "hyderabad", name: "Hyderabad", code: "TG" },
  { id: "pune", name: "Pune", code: "MH" },
  { id: "kolkata", name: "Kolkata", code: "WB" },
  { id: "chennai", name: "Chennai", code: "TN" },
  { id: "jaipur", name: "Jaipur", code: "RJ" },
];

interface CityDropdownProps {
  currentCity?: string;
  onCityChange?: (cityId: string) => void;
}

export function CityDropdown({
  currentCity = "mumbai",
  onCityChange,
}: CityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(currentCity);

  // Get city from cookies on mount
  useEffect(() => {
    const cityFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("selectedCity="))
      ?.split("=")[1];

    if (cityFromCookie) {
      setSelectedCity(cityFromCookie);
    }
  }, []);

  const activeCity = CITIES.find((c) => c.id === selectedCity);

  const handleSelectCity = (cityId: string) => {
    setSelectedCity(cityId);
    setIsOpen(false);

    // Save to cookie
    document.cookie = `selectedCity=${cityId}; path=/; max-age=31536000`;

    onCityChange?.(cityId);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-dark/20 hover:border-amber-gold/50 hover:bg-stone-dark/5 transition-all duration-300 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col items-start">
          <span className="text-xs text-stone-dark/50 font-medium uppercase">
            City
          </span>
          <span className="text-sm font-semibold text-stone-950">
            {activeCity?.name}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-stone-dark/60" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full right-0 mt-2 w-56 bg-stone-light border border-stone-dark/10 rounded-lg shadow-luxury-lg z-50 overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {CITIES.map((city) => (
                <motion.button
                  key={city.id}
                  onClick={() => handleSelectCity(city.id)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-all duration-200 hover:bg-stone-dark/5 border-b border-stone-dark/5 last:border-b-0",
                    selectedCity === city.id && "bg-amber-gold/10",
                  )}
                  whileHover={{ paddingLeft: "1.25rem", x: 4 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          selectedCity === city.id
                            ? "text-amber-gold"
                            : "text-stone-950",
                        )}
                      >
                        {city.name}
                      </p>
                      <p className="text-xs text-stone-dark/50">{city.code}</p>
                    </div>
                    {selectedCity === city.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-amber-gold"
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

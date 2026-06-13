import { ReactNode } from "react";
import { motion } from "framer-motion";

export const luxuryVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.6, ease: "easeOut" },
  } as const,

  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  } as const,

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.5, ease: "easeOut" },
  } as const,

  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.5, ease: "easeOut" },
  } as const,
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

interface LuxuryMotionProps {
  children: ReactNode;
  variant?: keyof typeof luxuryVariants;
  className?: string;
}

export function LuxuryMotion({
  children,
  variant = "fadeInUp",
  className,
}: LuxuryMotionProps) {
  const selectedVariant = luxuryVariants[variant];

  return (
    <motion.div
      initial={selectedVariant.initial as any}
      whileInView={selectedVariant.animate as any}
      exit={selectedVariant.exit as any}
      transition={selectedVariant.transition}
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

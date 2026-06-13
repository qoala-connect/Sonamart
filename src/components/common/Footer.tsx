"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui";

export function Footer() {
  const footerSections = [
    {
      title: "Products",
      links: ["Marble", "Granite", "Quartz", "Limestone"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Sustainability"],
    },
    {
      title: "Support",
      links: ["Contact", "FAQs", "Shipping", "Returns"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-stone-950 text-stone-light/80 border-t border-stone-dark/30">
      <Container className="py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12"
        >
          {/* Brand */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-gold to-bronze-accent rounded-lg flex items-center justify-center">
                <span className="text-stone-950 font-serif font-bold text-sm">
                  S
                </span>
              </div>
              <span className="font-serif text-lg font-semibold">Sonamart</span>
            </div>
            <p className="text-stone-light/60 text-sm leading-relaxed">
              Curating the world&apos;s finest stone materials for discerning
              clients.
            </p>
          </motion.div>

          {/* Links */}
          {footerSections.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h3 className="font-serif font-semibold text-stone-light mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-stone-light/60 hover:text-amber-gold transition-colors duration-300 text-sm"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="pt-8 border-t border-stone-dark/30 flex flex-col md:flex-row items-center justify-between"
        >
          <p className="text-stone-light/60 text-sm">
            © 2024 Sonamart. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-stone-light/60 hover:text-amber-gold transition-colors duration-300 text-sm"
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}

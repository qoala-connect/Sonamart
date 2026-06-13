import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonamart - Premium Stone Procurement",
  description:
    "Luxury stone procurement platform for marble, granite, and quartz materials",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-stone-light text-stone-dark antialiased">
        {children}
      </body>
    </html>
  );
}

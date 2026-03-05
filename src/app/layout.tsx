import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Seasons Street | B2B Wholesale Artisan Crafts & Sustainable Solutions",
  description:
    "Premium wholesale exports of artisanal crafts and sustainable solutions from Bangladesh to the world. Paper quilling ornaments, handicrafts, sustainable disposables, and printing services.",
  keywords: [
    "B2B wholesale",
    "artisan crafts",
    "sustainable solutions",
    "paper quilling",
    "Bangladesh exports",
    "handicrafts",
    "eco-friendly jewelry",
  ],
  openGraph: {
    title: "Seasons Street | B2B Wholesale Artisan Crafts",
    description:
      "Premium wholesale exports from Bangladesh — artisanal crafts, sustainable disposables, and custom designs.",
    siteName: "Seasons Street",
    type: "website",
    url: "https://seasonsstreet.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${playfair.variable} ${manrope.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

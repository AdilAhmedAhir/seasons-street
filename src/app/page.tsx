"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedBrandSection from "@/components/sections/FeaturedBrandSection";
import CatalogSection from "@/components/sections/CatalogSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TeamSection from "@/components/sections/TeamSection";
import QuotationModal from "@/components/QuotationModal";

type OrderType = "standard" | "custom";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultOrderType, setDefaultOrderType] = useState<OrderType>("standard");

  const openStandardQuote = useCallback(() => {
    setDefaultOrderType("standard");
    setIsModalOpen(true);
  }, []);

  const openCustomQuote = useCallback(() => {
    setDefaultOrderType("custom");
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <Navbar onRequestQuote={openStandardQuote} />

      <main>
        <HeroSection />
        <AboutSection />
        <FeaturedBrandSection onRequestQuote={openStandardQuote} />
        <CatalogSection onRequestCustomQuote={openCustomQuote} />
        <PortfolioSection />
        <TeamSection />
      </main>

      <Footer />

      <QuotationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultOrderType={defaultOrderType}
      />
    </>
  );
}

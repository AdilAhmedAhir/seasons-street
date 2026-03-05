"use client";

import React from "react";
import SectionContainer from "@/components/ui/SectionContainer";
import Button from "@/components/ui/Button";

const categories = [
    {
        title: "Sustainable Disposables",
        description:
            "Eco-friendly plates, bowls, cups, and biodegradable packaging solutions designed for a greener planet.",
        accent: "border-accent-green",
        accentBg: "bg-accent-green",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        ),
    },
    {
        title: "Handicrafts",
        description:
            "Artisanal items, custom-designed crafts, and unique home décor that celebrate traditional Bangladeshi artistry.",
        accent: "border-accent-amber",
        accentBg: "bg-accent-amber",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
        ),
    },
    {
        title: "Printing Solutions",
        description:
            "Brochures, catalogs, packaging prints, and brand identity materials — comprehensive printing services for businesses.",
        accent: "border-accent-blue",
        accentBg: "bg-accent-blue",
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
        ),
    },
];

interface CatalogSectionProps {
    onRequestCustomQuote: () => void;
}

export default function CatalogSection({
    onRequestCustomQuote,
}: CatalogSectionProps) {
    return (
        <SectionContainer id="catalog" background="charcoal-dark">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center">
                <span className="gold-underline">Our Catalog</span>
            </h2>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                    <div
                        key={cat.title}
                        className={`rounded-xl bg-surface border-t-4 ${cat.accent} p-8 card-hover`}
                    >
                        <div
                            className={`w-14 h-14 rounded-lg ${cat.accentBg}/10 flex items-center justify-center text-gold mb-5`}
                        >
                            {cat.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3 font-serif">{cat.title}</h3>
                        <p className="text-text-secondary text-sm leading-relaxed font-sans">
                            {cat.description}
                        </p>
                        <a
                            href="#"
                            className="inline-block mt-5 text-gold text-sm font-medium hover:text-gold-light transition-colors font-sans"
                        >
                            Learn More →
                        </a>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-12">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={onRequestCustomQuote}
                >
                    Request Custom Quotation
                </Button>
            </div>
        </SectionContainer>
    );
}

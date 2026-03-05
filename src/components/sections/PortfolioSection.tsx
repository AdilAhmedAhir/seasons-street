import React from "react";
import SectionContainer from "@/components/ui/SectionContainer";

const galleryItems = [
    {
        title: "Past Work Orders",
        description: "Sample documentation and product prototypes",
    },
    {
        title: "Shipment & Logistics",
        description: "Packaging and international shipping operations",
    },
    {
        title: "Finished Goods",
        description: "Export-ready products, packaged and labeled",
    },
];

export default function PortfolioSection() {
    return (
        <SectionContainer id="portfolio" background="charcoal">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12">
                <span className="gold-underline">Global Export Portfolio</span>
            </h2>

            {/* Success Story */}
            <div className="rounded-xl bg-surface-elevated border border-white/5 p-8 mb-12">
                <div className="flex items-start gap-4">
                    <span className="text-3xl shrink-0">🌍</span>
                    <div>
                        <h3 className="text-xl font-bold text-gold mb-3 font-serif">
                            Success Story: Scandinavian Retail Partnership
                        </h3>
                        <p className="text-text-secondary leading-relaxed font-sans">
                            In 2025, Seasons Street successfully fulfilled a landmark order of
                            10,000+ handcrafted paper quilling ornaments for a major
                            Scandinavian retail chain. The shipment involved meticulous quality
                            control, custom branded packaging, and seamless international
                            logistics coordination across three time zones. This partnership
                            established a recurring quarterly supply agreement — a testament to
                            our commitment to reliability and excellence.
                        </p>
                    </div>
                </div>
            </div>

            {/* Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-xl overflow-hidden border border-white/5 card-hover"
                    >
                        {/* Image placeholder */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-emerald-dark to-charcoal-light flex items-center justify-center">
                            <svg
                                className="w-12 h-12 text-gold/20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <div className="p-4 bg-surface">
                            <h4 className="text-text-primary font-semibold text-sm font-serif">
                                {item.title}
                            </h4>
                            <p className="text-text-muted text-xs mt-1 font-sans">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </SectionContainer>
    );
}

import React from "react";
import SectionContainer from "@/components/ui/SectionContainer";

export default function AboutSection() {
    return (
        <SectionContainer id="about" background="charcoal-dark">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12">
                <span className="gold-underline">The Origin Story</span>
            </h2>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                {/* Text */}
                <div className="lg:col-span-3 space-y-6">
                    <p className="text-text-secondary text-lg leading-relaxed font-sans">
                        Seasons Street was born from a passion for preserving Bangladesh&apos;s rich artisanal
                        heritage while meeting the demands of a modern, sustainability-conscious global market.
                        We bridge the gap between rural craftsmen and international wholesale buyers, creating
                        opportunities that honour tradition and drive economic empowerment.
                    </p>
                    <p className="text-text-secondary text-lg leading-relaxed font-sans">
                        Our team works directly with skilled artisans across Bangladesh, curating collections
                        that blend centuries-old techniques with contemporary design sensibilities. From
                        intricate paper quilling ornaments to eco-friendly disposables, every product tells a
                        story of craftsmanship and care.
                    </p>
                </div>

                {/* Image placeholder */}
                <div className="lg:col-span-2">
                    <div className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-emerald to-emerald-dark border border-gold/20 flex items-center justify-center overflow-hidden">
                        <div className="text-center p-8">
                            <svg className="w-16 h-16 mx-auto text-gold/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-text-muted text-sm">Artisan Craftsmanship</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat callout */}
            <div className="mt-12 p-6 rounded-xl bg-gold/10 border border-gold/20">
                <div className="flex items-center gap-4">
                    <span className="text-3xl">🏆</span>
                    <div>
                        <p className="text-gold font-bold text-lg">
                            First in Bangladesh to introduce paper quilling ornaments commercially.
                        </p>
                        <p className="text-text-muted text-sm mt-1 italic font-serif">
                            &quot;Crafting Sustainability, Exporting Excellence.&quot;
                        </p>
                    </div>
                </div>
            </div>
        </SectionContainer>
    );
}

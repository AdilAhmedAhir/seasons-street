"use client";

import React from "react";
import SectionContainer from "@/components/ui/SectionContainer";

const products = [
    { name: "Crimson Spiral Earrings", aspect: "aspect-[3/4]" },
    { name: "Ivory Cascade Necklace", aspect: "aspect-square" },
    { name: "Emerald Blossom Studs", aspect: "aspect-[3/4]" },
    { name: "Ruby Teardrop Earrings", aspect: "aspect-square" },
    { name: "Golden Petal Necklace", aspect: "aspect-[3/4]" },
    { name: "Sapphire Swirl Set", aspect: "aspect-[4/5]" },
];

interface FeaturedBrandSectionProps {
    onRequestQuote: () => void;
}

export default function FeaturedBrandSection({
    onRequestQuote,
}: FeaturedBrandSectionProps) {
    return (
        <SectionContainer id="featured" background="charcoal">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                <span className="gold-underline">Featured Brand</span>
            </h2>
            <p className="text-2xl text-gold font-serif mb-4">
                Paper Quilling Ornaments
            </p>
            <p className="text-text-secondary text-lg max-w-2xl mb-6 font-sans">
                Intricately designed, lightweight, and eco-friendly jewelry. Each piece
                is handcrafted by skilled artisans in Bangladesh.
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-10">
                {["#Handcrafted", "#EcoFriendly", "#WholesaleJewelry"].map((tag) => (
                    <span
                        key={tag}
                        className="text-gold text-sm font-medium bg-gold/5 border border-gold/20 px-3 py-1 rounded-full"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Masonry Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {products.map((product) => (
                    <div
                        key={product.name}
                        className="break-inside-avoid group relative rounded-xl overflow-hidden border border-white/5 cursor-pointer card-hover"
                        onClick={onRequestQuote}
                    >
                        {/* Image placeholder */}
                        <div
                            className={`${product.aspect} bg-gradient-to-br from-emerald-dark to-charcoal-light flex items-center justify-center`}
                        >
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

                        {/* Product name overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-text-primary text-sm font-medium font-sans">
                                {product.name}
                            </p>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="px-5 py-2.5 bg-gold text-charcoal-dark font-semibold rounded-lg text-sm shadow-lg font-sans">
                                Request Quote
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-center text-text-muted text-sm mt-8 font-sans">
                Click any product to request a wholesale quote
            </p>
        </SectionContainer>
    );
}

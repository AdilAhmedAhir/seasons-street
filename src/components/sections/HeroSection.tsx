import React from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background — stays dark for contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#111111] via-[#1A1A1A] to-[#1a0505]" />

            {/* Decorative pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B91C1C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 section-container text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Logo */}
                    <div className="mb-8 animate-fade-in">
                        <Image
                            src="/logo-white.svg"
                            alt="Seasons Street"
                            width={160}
                            height={180}
                            className="h-28 w-auto mx-auto mb-6"
                            priority
                        />
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in">
                        {["B2B Wholesale", "Custom Designs", "Global Shipping"].map(
                            (badge) => (
                                <span
                                    key={badge}
                                    className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400 border border-red-400/30 rounded-full bg-red-400/5"
                                >
                                    {badge}
                                </span>
                            )
                        )}
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up text-white">
                        Bulk Artisanal Crafts &{" "}
                        <span className="text-red-400">Sustainable Solutions</span>
                    </h1>

                    {/* Sub-headline */}
                    <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-sans animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        Premium wholesale exports from Bangladesh to the world.
                    </p>

                    {/* CTA */}
                    <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                        <Button variant="primary" size="lg" href="#portfolio">
                            View Our Portfolio
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
                        <div className="w-1.5 h-3 bg-white/40 rounded-full" />
                    </div>
                </div>
            </div>
        </section>
    );
}

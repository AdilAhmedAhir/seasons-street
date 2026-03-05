"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const navLinks = [
    { label: "About", href: "#about" },
    { label: "Products", href: "#featured" },
    { label: "Services", href: "#catalog" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
];

interface NavbarProps {
    onRequestQuote: () => void;
}

export default function Navbar({ onRequestQuote }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
                ? "bg-charcoal-dark/95 backdrop-blur-md shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-[80rem] mx-auto flex items-center justify-between px-6 py-4">
                {/* Logo */}
                <a href="#" className="flex items-center">
                    <Image
                        src="/logo-horizontal-white.svg"
                        alt="Seasons Street"
                        width={200}
                        height={48}
                        className="h-10 w-auto"
                        priority
                    />
                </a>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-text-secondary hover:text-gold transition-colors duration-200 text-sm font-medium tracking-wide uppercase"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden lg:block">
                    <Button variant="primary" size="sm" onClick={onRequestQuote}>
                        Request a Quote
                    </Button>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="lg:hidden p-2 text-text-secondary hover:text-gold transition-colors cursor-pointer"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileOpen && (
                <div className="lg:hidden bg-charcoal-dark/98 backdrop-blur-md border-t border-white/10 animate-fade-in">
                    <div className="flex flex-col p-6 gap-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="text-text-secondary hover:text-gold transition-colors text-lg font-medium py-2"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-white/10">
                            <Button
                                variant="primary"
                                size="md"
                                className="w-full"
                                onClick={() => {
                                    setIsMobileOpen(false);
                                    onRequestQuote();
                                }}
                            >
                                Request a Quote
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

import React from "react";

interface SectionContainerProps {
    children: React.ReactNode;
    id?: string;
    className?: string;
    background?: "charcoal" | "charcoal-dark" | "emerald" | "surface";
}

const bgStyles: Record<string, string> = {
    charcoal: "bg-charcoal",
    "charcoal-dark": "bg-charcoal-dark",
    emerald: "bg-emerald",
    surface: "bg-surface",
};

export default function SectionContainer({
    children,
    id,
    className = "",
    background = "charcoal",
}: SectionContainerProps) {
    return (
        <section id={id} className={`${bgStyles[background]} ${className}`}>
            <div className="section-container">{children}</div>
        </section>
    );
}

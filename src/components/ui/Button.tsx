"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-gold text-white font-semibold hover:bg-gold-light gold-glow",
    secondary:
        "bg-surface text-text-primary font-semibold hover:bg-surface-elevated border border-white/10",
    outline:
        "bg-transparent text-gold border-2 border-gold hover:bg-gold hover:text-white",
    ghost:
        "bg-transparent text-text-secondary hover:text-gold hover:bg-white/5",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm rounded-md",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-lg rounded-lg",
};

export default function Button({
    variant = "primary",
    size = "md",
    children,
    href,
    className = "",
    ...props
}: ButtonProps) {
    const classes = `inline-flex items-center justify-center gap-2 font-sans transition-all duration-300 cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}

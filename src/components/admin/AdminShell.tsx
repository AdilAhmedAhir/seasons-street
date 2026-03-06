"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-charcoal-dark flex">
            <AdminSidebar />

            {/* Mobile header */}
            <div className="flex-1 flex flex-col">
                <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-charcoal">
                    <Link href="/" className="text-gold font-bold font-serif">
                        SS
                    </Link>
                    <h1 className="text-sm font-bold font-serif">Admin Panel</h1>
                    <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="text-gold text-xs font-bold">A</span>
                    </div>
                </header>

                {/* Mobile bottom nav */}
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-charcoal border-t border-gray-200 flex justify-around py-2">
                    {[
                        { label: "Home", href: "/admin", icon: "M3 12l9-9 9 9M5 10v10h4v-6h6v6h4V10" },
                        { label: "Products", href: "/admin/products", icon: "M20 7l-8-4-8 4m16 0v10l-8 4m0-10L4 7m8 4v10" },
                        { label: "Portfolio", href: "/admin/portfolio", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586" },
                        { label: "Team", href: "/admin/team", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z" },
                        { label: "Settings", href: "/admin/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-1 text-text-muted hover:text-gold transition-colors px-3 py-1"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                            </svg>
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Content area */}
                <div className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</div>
            </div>
        </div>
    );
}

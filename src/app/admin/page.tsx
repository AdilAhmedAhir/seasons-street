import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | Seasons Street",
    description: "Manage quotation requests for Seasons Street B2B wholesale.",
    robots: { index: false, follow: false },
};

const mockQuotations = [
    {
        id: "QR-001",
        date: "2026-02-28",
        company: "Nordic Craft Co.",
        orderType: "Standard" as const,
        product: "Paper Quilling Earrings - Red & White",
        quantity: 500,
        status: "Pending" as const,
    },
    {
        id: "QR-002",
        date: "2026-02-27",
        company: "Fair Trade EU",
        orderType: "Custom" as const,
        product: "Custom Ornaments Collection",
        quantity: 1200,
        status: "Reviewed" as const,
    },
    {
        id: "QR-003",
        date: "2026-02-25",
        company: "Eco Living Australia",
        orderType: "Standard" as const,
        product: "Sustainable Disposable Plates",
        quantity: 2000,
        status: "Approved" as const,
    },
    {
        id: "QR-004",
        date: "2026-02-24",
        company: "Berlin Design Haus",
        orderType: "Custom" as const,
        product: "Bespoke Jewelry Line",
        quantity: 300,
        status: "Pending" as const,
    },
    {
        id: "QR-005",
        date: "2026-02-22",
        company: "Artisan Collective NYC",
        orderType: "Standard" as const,
        product: "Paper Quilling Necklace - Ivory",
        quantity: 800,
        status: "Approved" as const,
    },
    {
        id: "QR-006",
        date: "2026-02-20",
        company: "Green Market Japan",
        orderType: "Custom" as const,
        product: "Custom Packaging Design",
        quantity: 5000,
        status: "Reviewed" as const,
    },
    {
        id: "QR-007",
        date: "2026-02-18",
        company: "Scandinavian Imports AB",
        orderType: "Standard" as const,
        product: "Paper Quilling Set - Ruby",
        quantity: 1500,
        status: "Rejected" as const,
    },
    {
        id: "QR-008",
        date: "2026-02-15",
        company: "Pacific Wholesale Ltd",
        orderType: "Standard" as const,
        product: "Handicraft — Custom Item",
        quantity: 400,
        status: "Pending" as const,
    },
];

const stats = [
    { label: "Total Requests", value: 47, color: "text-text-primary" },
    { label: "Pending", value: 12, color: "text-status-pending" },
    { label: "Reviewed", value: 28, color: "text-status-reviewed" },
    { label: "Converted", value: 7, color: "text-accent-green" },
];

const statusColors: Record<string, string> = {
    Pending: "bg-status-pending/10 text-status-pending",
    Reviewed: "bg-status-reviewed/10 text-status-reviewed",
    Approved: "bg-status-approved/10 text-status-approved",
    Rejected: "bg-status-rejected/10 text-status-rejected",
};

const orderTypeColors: Record<string, string> = {
    Standard: "bg-accent-green/10 text-accent-green",
    Custom: "bg-accent-amber/10 text-accent-amber",
};

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-charcoal-dark flex">
            {/* Sidebar — Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-charcoal border-r border-white/5 p-6">
                <Link href="/" className="text-xl font-bold text-gold font-serif mb-10">
                    Seasons Street
                </Link>
                <nav className="space-y-1">
                    {[
                        { label: "Dashboard", active: false },
                        { label: "Quotations", active: true },
                        { label: "Products", active: false },
                        { label: "Settings", active: false },
                    ].map((item) => (
                        <a
                            key={item.label}
                            href="#"
                            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.active
                                ? "bg-gold/10 text-gold border-l-2 border-gold"
                                : "text-text-muted hover:text-text-primary hover:bg-white/5"
                                }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className="mt-auto">
                    <Link
                        href="/"
                        className="text-text-muted text-sm hover:text-gold transition-colors"
                    >
                        ← Back to Website
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-charcoal">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="lg:hidden text-gold font-bold font-serif">
                            SS
                        </Link>
                        <h1 className="text-xl font-bold font-serif">Quotation Requests</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="hidden sm:block relative">
                            <svg
                                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search quotations..."
                                className="pl-10 pr-4 py-2 bg-charcoal-dark border border-white/10 rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-gold/50 w-60"
                            />
                        </div>
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                            <span className="text-gold text-sm font-bold">A</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-auto">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-surface rounded-xl p-5 border border-white/5"
                            >
                                <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">
                                    {stat.label}
                                </p>
                                <p className={`text-3xl font-bold ${stat.color}`}>
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block bg-surface rounded-xl border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left px-6 py-4 text-text-muted font-medium uppercase tracking-wider text-xs">
                                            Date
                                        </th>
                                        <th className="text-left px-6 py-4 text-text-muted font-medium uppercase tracking-wider text-xs">
                                            Company
                                        </th>
                                        <th className="text-left px-6 py-4 text-text-muted font-medium uppercase tracking-wider text-xs">
                                            Type
                                        </th>
                                        <th className="text-left px-6 py-4 text-text-muted font-medium uppercase tracking-wider text-xs">
                                            Product
                                        </th>
                                        <th className="text-left px-6 py-4 text-text-muted font-medium uppercase tracking-wider text-xs">
                                            Qty
                                        </th>
                                        <th className="text-left px-6 py-4 text-text-muted font-medium uppercase tracking-wider text-xs">
                                            Status
                                        </th>
                                        <th className="text-left px-6 py-4 text-text-muted font-medium uppercase tracking-wider text-xs">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockQuotations.map((q, i) => (
                                        <tr
                                            key={q.id}
                                            className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 === 1 ? "bg-white/[0.01]" : ""
                                                }`}
                                        >
                                            <td className="px-6 py-4 text-text-muted">{q.date}</td>
                                            <td className="px-6 py-4 text-text-primary font-medium">
                                                {q.company}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${orderTypeColors[q.orderType]
                                                        }`}
                                                >
                                                    {q.orderType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-text-secondary max-w-[200px] truncate">
                                                {q.product}
                                            </td>
                                            <td className="px-6 py-4 text-text-primary font-mono">
                                                {q.quantity.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[q.status]
                                                        }`}
                                                >
                                                    {q.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button className="p-1.5 text-gold hover:bg-gold/10 rounded-md transition-colors cursor-pointer" title="View">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button className="p-1.5 text-gold hover:bg-gold/10 rounded-md transition-colors cursor-pointer" title="Edit">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {mockQuotations.map((q) => (
                            <div
                                key={q.id}
                                className="bg-surface rounded-xl border border-white/5 p-5"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-text-primary font-semibold">{q.company}</p>
                                        <p className="text-text-muted text-xs mt-0.5">{q.date}</p>
                                    </div>
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${orderTypeColors[q.orderType]
                                            }`}
                                    >
                                        {q.orderType}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-text-secondary text-sm">
                                            Qty: <span className="font-mono text-text-primary">{q.quantity.toLocaleString()}</span>
                                        </span>
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[q.status]
                                                }`}
                                        >
                                            {q.status}
                                        </span>
                                    </div>
                                    <a href="#" className="text-gold text-sm font-medium hover:text-gold-light">
                                        View →
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6 text-sm text-text-muted">
                        <p>Showing 1-8 of 47 results</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 rounded-md bg-surface border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                                ←
                            </button>
                            <button className="px-3 py-1.5 rounded-md bg-gold/10 text-gold border border-gold/20 cursor-pointer">
                                1
                            </button>
                            <button className="px-3 py-1.5 rounded-md bg-surface border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                                2
                            </button>
                            <button className="px-3 py-1.5 rounded-md bg-surface border border-white/10 hover:bg-white/5 transition-colors cursor-pointer">
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

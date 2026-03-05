import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/db";
import { quotations, type Quotation } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export const metadata: Metadata = {
    title: "Admin Dashboard | Seasons Street",
    description: "Manage quotation requests for Seasons Street B2B wholesale.",
    robots: { index: false, follow: false },
};

// Force dynamic rendering — always reads fresh data from DB
export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
    Pending: "bg-status-pending/10 text-status-pending",
    Reviewed: "bg-status-reviewed/10 text-status-reviewed",
    Approved: "bg-status-approved/10 text-status-approved",
    Rejected: "bg-status-rejected/10 text-status-rejected",
};

const orderTypeColors: Record<string, string> = {
    standard: "bg-accent-green/10 text-accent-green",
    custom: "bg-accent-amber/10 text-accent-amber",
};

export default async function AdminPage() {
    // Fetch quotations from DB
    let allQuotations: Quotation[] = [];
    let stats = { total: 0, pending: 0, reviewed: 0, approved: 0 };

    try {
        if (db) {
            allQuotations = await db
                .select()
                .from(quotations)
                .orderBy(desc(quotations.createdAt));

            // Calculate stats
            const [statResult] = await db
                .select({
                    total: sql<number>`count(*)`,
                    pending: sql<number>`count(*) filter (where ${quotations.status} = 'Pending')`,
                    reviewed: sql<number>`count(*) filter (where ${quotations.status} = 'Reviewed')`,
                    approved: sql<number>`count(*) filter (where ${quotations.status} = 'Approved')`,
                })
                .from(quotations);

            stats = {
                total: Number(statResult.total),
                pending: Number(statResult.pending),
                reviewed: Number(statResult.reviewed),
                approved: Number(statResult.approved),
            };
        }
    } catch (error) {
        console.error("Failed to fetch quotations:", error);
        // DB not set up yet — show empty state
    }

    const statCards = [
        { label: "Total Requests", value: stats.total, color: "text-text-primary" },
        { label: "Pending", value: stats.pending, color: "text-status-pending" },
        { label: "Reviewed", value: stats.reviewed, color: "text-status-reviewed" },
        { label: "Approved", value: stats.approved, color: "text-accent-green" },
    ];

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
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                            <span className="text-gold text-sm font-bold">A</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 overflow-auto">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {statCards.map((stat) => (
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

                    {/* Empty state */}
                    {allQuotations.length === 0 ? (
                        <div className="bg-surface rounded-xl border border-white/5 p-12 text-center">
                            <svg className="w-16 h-16 mx-auto text-text-muted/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-bold text-text-secondary mb-2">No Quotation Requests Yet</h3>
                            <p className="text-text-muted text-sm">
                                When customers submit quotation requests, they&apos;ll appear here.
                            </p>
                        </div>
                    ) : (
                        <>
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
                                                    File
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allQuotations.map((q, i) => (
                                                <tr
                                                    key={q.id}
                                                    className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${i % 2 === 1 ? "bg-white/[0.01]" : ""
                                                        }`}
                                                >
                                                    <td className="px-6 py-4 text-text-muted">
                                                        {q.createdAt
                                                            ? new Date(q.createdAt).toLocaleDateString()
                                                            : "—"}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-text-primary font-medium">{q.companyName}</p>
                                                            <p className="text-text-muted text-xs">{q.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${orderTypeColors[q.orderType] || ""
                                                                }`}
                                                        >
                                                            {q.orderType}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-text-secondary max-w-[200px] truncate">
                                                        {q.product || q.customDescription || "—"}
                                                    </td>
                                                    <td className="px-6 py-4 text-text-primary font-mono">
                                                        {q.quantity.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[q.status] || ""
                                                                }`}
                                                        >
                                                            {q.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {q.fileUrl ? (
                                                            <a
                                                                href={q.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gold text-xs hover:text-gold-light"
                                                            >
                                                                {q.fileName || "View File"}
                                                            </a>
                                                        ) : (
                                                            <span className="text-text-muted text-xs">—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-4">
                                {allQuotations.map((q) => (
                                    <div
                                        key={q.id}
                                        className="bg-surface rounded-xl border border-white/5 p-5"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="text-text-primary font-semibold">{q.companyName}</p>
                                                <p className="text-text-muted text-xs mt-0.5">
                                                    {q.createdAt
                                                        ? new Date(q.createdAt).toLocaleDateString()
                                                        : "—"}{" "}
                                                    · {q.email}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${orderTypeColors[q.orderType] || ""
                                                    }`}
                                            >
                                                {q.orderType}
                                            </span>
                                        </div>
                                        <p className="text-text-secondary text-sm mb-3 truncate">
                                            {q.product || q.customDescription || "—"}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-text-secondary text-sm">
                                                    Qty:{" "}
                                                    <span className="font-mono text-text-primary">
                                                        {q.quantity.toLocaleString()}
                                                    </span>
                                                </span>
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[q.status] || ""
                                                        }`}
                                                >
                                                    {q.status}
                                                </span>
                                            </div>
                                            {q.fileUrl && (
                                                <a
                                                    href={q.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gold text-sm font-medium hover:text-gold-light"
                                                >
                                                    File →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Pagination info */}
                    {allQuotations.length > 0 && (
                        <div className="flex items-center justify-between mt-6 text-sm text-text-muted">
                            <p>Showing {allQuotations.length} of {stats.total} results</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

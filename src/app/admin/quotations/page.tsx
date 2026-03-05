"use client";

import React, { useState, useEffect } from "react";
import type { Quotation } from "@/db/schema";

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

const statusOptions = ["Pending", "Reviewed", "Approved", "Rejected"];

export default function AdminQuotationsPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch quotations — since we don't have a dedicated list endpoint yet,
        // we'll use the admin page data approach
        const fetchData = async () => {
            try {
                const res = await fetch("/api/admin/quotations");
                const { data } = await res.json();
                setQuotations(data || []);
            } catch { setQuotations([]); }
            setLoading(false);
        };
        fetchData();
    }, []);

    const updateStatus = async (id: number, status: string) => {
        await fetch(`/api/admin/quotations/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        setQuotations((prev) =>
            prev.map((q) => (q.id === id ? { ...q, status } : q))
        );
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold font-serif mb-8">Quotation Requests</h1>

            {loading ? (
                <div className="text-center py-12 text-text-muted">Loading...</div>
            ) : quotations.length === 0 ? (
                <div className="bg-surface rounded-xl border border-white/5 p-12 text-center">
                    <h3 className="text-lg font-bold text-text-secondary mb-2">No Quotation Requests</h3>
                    <p className="text-text-muted text-sm">Requests will appear here when customers submit them.</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block bg-surface rounded-xl border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left px-5 py-3 text-text-muted font-medium uppercase tracking-wider text-xs">Date</th>
                                        <th className="text-left px-5 py-3 text-text-muted font-medium uppercase tracking-wider text-xs">Company</th>
                                        <th className="text-left px-5 py-3 text-text-muted font-medium uppercase tracking-wider text-xs">Type</th>
                                        <th className="text-left px-5 py-3 text-text-muted font-medium uppercase tracking-wider text-xs">Product</th>
                                        <th className="text-left px-5 py-3 text-text-muted font-medium uppercase tracking-wider text-xs">Qty</th>
                                        <th className="text-left px-5 py-3 text-text-muted font-medium uppercase tracking-wider text-xs">Status</th>
                                        <th className="text-left px-5 py-3 text-text-muted font-medium uppercase tracking-wider text-xs">File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotations.map((q, i) => (
                                        <tr key={q.id} className={`border-b border-white/5 ${i % 2 === 1 ? "bg-white/[0.01]" : ""}`}>
                                            <td className="px-5 py-3 text-text-muted">{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "—"}</td>
                                            <td className="px-5 py-3">
                                                <p className="text-text-primary font-medium">{q.companyName}</p>
                                                <p className="text-text-muted text-xs">{q.email}</p>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${orderTypeColors[q.orderType] || ""}`}>
                                                    {q.orderType}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-text-secondary max-w-[180px] truncate">{q.product || q.customDescription || "—"}</td>
                                            <td className="px-5 py-3 text-text-primary font-mono">{q.quantity.toLocaleString()}</td>
                                            <td className="px-5 py-3">
                                                <select
                                                    value={q.status}
                                                    onChange={(e) => updateStatus(q.id, e.target.value)}
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none ${statusColors[q.status] || ""}`}
                                                >
                                                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-5 py-3">
                                                {q.fileUrl ? (
                                                    <a href={q.fileUrl} target="_blank" rel="noopener noreferrer" className="text-gold text-xs hover:text-gold-light">
                                                        View
                                                    </a>
                                                ) : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                        {quotations.map((q) => (
                            <div key={q.id} className="bg-surface rounded-xl border border-white/5 p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-text-primary font-semibold">{q.companyName}</p>
                                        <p className="text-text-muted text-xs">{q.email}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${orderTypeColors[q.orderType] || ""}`}>
                                        {q.orderType}
                                    </span>
                                </div>
                                <p className="text-text-secondary text-sm mb-2 truncate">{q.product || q.customDescription || "—"}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-text-muted text-sm">Qty: <span className="font-mono text-text-primary">{q.quantity.toLocaleString()}</span></span>
                                    <select
                                        value={q.status}
                                        onChange={(e) => updateStatus(q.id, e.target.value)}
                                        className={`px-2 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer focus:outline-none ${statusColors[q.status] || ""}`}
                                    >
                                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

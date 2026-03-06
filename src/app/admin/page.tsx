import React from "react";
import Link from "next/link";
import { db } from "@/db";
import { quotations, products, portfolioItems, teamMembers } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    let stats = {
        quotations: 0, pending: 0, products: 0, portfolio: 0, team: 0,
    };

    try {
        if (db) {
            const [[qStats], [pCount], [portCount], [tCount]] = await Promise.all([
                db.select({
                    total: sql<number>`count(*)`,
                    pending: sql<number>`count(*) filter (where ${quotations.status} = 'Pending')`,
                }).from(quotations),
                db.select({ count: sql<number>`count(*)` }).from(products),
                db.select({ count: sql<number>`count(*)` }).from(portfolioItems),
                db.select({ count: sql<number>`count(*)` }).from(teamMembers),
            ]);
            stats = {
                quotations: Number(qStats.total),
                pending: Number(qStats.pending),
                products: Number(pCount.count),
                portfolio: Number(portCount.count),
                team: Number(tCount.count),
            };
        }
    } catch {
        // DB not configured
    }

    const cards = [
        { label: "Total Quotations", value: stats.quotations, href: "/admin/quotations", color: "text-text-primary" },
        { label: "Pending Quotes", value: stats.pending, href: "/admin/quotations", color: "text-status-pending" },
        { label: "Products", value: stats.products, href: "/admin/products", color: "text-gold" },
        { label: "Portfolio Items", value: stats.portfolio, href: "/admin/portfolio", color: "text-accent-green" },
        { label: "Team Members", value: stats.team, href: "/admin/team", color: "text-accent-amber" },
    ];

    const quickLinks = [
        { label: "Add Product", href: "/admin/products", icon: "M12 4v16m8-8H4" },
        { label: "Add Portfolio", href: "/admin/portfolio", icon: "M12 4v16m8-8H4" },
        { label: "Edit Settings", href: "/admin/settings", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
        { label: "View Website", href: "/", icon: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" },
    ];

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold font-serif mb-1">Dashboard</h1>
                <p className="text-text-muted text-sm">Overview of your Seasons Street content</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {cards.map((card) => (
                    <Link key={card.label} href={card.href}
                        className="bg-surface rounded-xl p-5 border border-gray-200 hover:border-gold/20 transition-colors">
                        <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">{card.label}</p>
                        <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    </Link>
                ))}
            </div>

            {/* Quick actions */}
            <h2 className="text-lg font-bold font-serif mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {quickLinks.map((link) => (
                    <Link key={link.label} href={link.href}
                        className="bg-surface rounded-xl p-5 border border-gray-200 hover:border-gold/20 transition-colors flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-text-primary">{link.label}</span>
                    </Link>
                ))}
            </div>

            {/* DB status */}
            {!db && (
                <div className="bg-surface rounded-xl border border-amber-400/20 p-6">
                    <h3 className="text-amber-400 font-bold mb-2">⚠️ Database Not Connected</h3>
                    <p className="text-text-muted text-sm">
                        Set up Neon Postgres and Vercel Blob in your Vercel dashboard to enable full CMS functionality.
                        Content is currently using defaults.
                    </p>
                </div>
            )}
        </div>
    );
}

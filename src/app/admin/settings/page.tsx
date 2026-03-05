"use client";

import React, { useState, useEffect } from "react";
import type { SiteSetting } from "@/db/schema";
import Button from "@/components/ui/Button";

const defaultSettings = [
    { key: "hero_headline", label: "Hero Headline", section: "hero", value: "Bulk Artisanal Crafts & Sustainable Solutions" },
    { key: "hero_subtext", label: "Hero Subtext", section: "hero", value: "Premium wholesale exports from Bangladesh to the world." },
    { key: "about_paragraph_1", label: "About — Paragraph 1", section: "about", value: "Seasons Street was born from a passion for preserving Bangladesh's rich artisanal heritage while meeting the demands of a modern, sustainability-conscious global market." },
    { key: "about_paragraph_2", label: "About — Paragraph 2", section: "about", value: "Our team works directly with skilled artisans across Bangladesh, curating collections that blend centuries-old techniques with contemporary design sensibilities." },
    { key: "about_stat", label: "About — Stat Callout", section: "about", value: "First in Bangladesh to introduce paper quilling ornaments commercially." },
    { key: "featured_brand_name", label: "Featured Brand Name", section: "catalog", value: "Paper Quilling Ornaments" },
    { key: "featured_brand_desc", label: "Featured Brand Description", section: "catalog", value: "Intricately designed, lightweight, and eco-friendly jewelry. Each piece is handcrafted by skilled artisans in Bangladesh." },
    { key: "contact_email", label: "Contact Email", section: "contact", value: "info@seasonsstreet.com" },
    { key: "contact_phone", label: "Contact Phone", section: "contact", value: "+880-XXXX-XXXXXX" },
    { key: "contact_address", label: "Contact Address", section: "contact", value: "Dhaka, Bangladesh" },
    { key: "success_story_title", label: "Success Story Title", section: "portfolio", value: "Success Story: Scandinavian Retail Partnership" },
    { key: "success_story_text", label: "Success Story Text", section: "portfolio", value: "In 2025, Seasons Street successfully fulfilled a landmark order of 10,000+ handcrafted paper quilling ornaments for a major Scandinavian retail chain." },
];

const sectionLabels: Record<string, string> = {
    hero: "🏠 Hero Section",
    about: "📖 About Section",
    catalog: "🛍️ Featured Brand / Catalog",
    portfolio: "🌍 Portfolio",
    contact: "📞 Contact Information",
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/settings")
            .then((res) => res.json())
            .then(({ data }) => {
                if (cancelled) return;
                const map: Record<string, string> = {};
                (data || []).forEach((s: SiteSetting) => { map[s.key] = s.value; });
                setSettings(map);
            })
            .catch(() => { /* empty */ })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    const getValue = (key: string) => settings[key] ?? defaultSettings.find((d) => d.key === key)?.value ?? "";

    const handleSave = async () => {
        setSaving(true);
        const payload = defaultSettings.map((d) => ({
            key: d.key, label: d.label, section: d.section,
            value: settings[d.key] ?? d.value,
        }));

        await fetch("/api/admin/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ settings: payload }),
        });
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    // Group by section
    const sections = Object.keys(sectionLabels);

    return (
        <div className="p-6 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-serif">Site Settings</h1>
                <div className="flex items-center gap-3">
                    {saved && <span className="text-accent-green text-sm">✓ Saved!</span>}
                    <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save All Changes"}
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-text-muted">Loading...</div>
            ) : (
                <div className="space-y-8">
                    {sections.map((section) => {
                        const sectionSettings = defaultSettings.filter((d) => d.section === section);
                        if (sectionSettings.length === 0) return null;

                        return (
                            <div key={section} className="bg-surface rounded-xl border border-white/5 p-6">
                                <h2 className="text-lg font-bold mb-4">{sectionLabels[section]}</h2>
                                <div className="space-y-4">
                                    {sectionSettings.map((d) => (
                                        <div key={d.key}>
                                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                                {d.label}
                                            </label>
                                            {d.value.length > 100 ? (
                                                <textarea
                                                    value={getValue(d.key)}
                                                    onChange={(e) => setSettings({ ...settings, [d.key]: e.target.value })}
                                                    rows={4}
                                                    className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none text-sm"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={getValue(d.key)}
                                                    onChange={(e) => setSettings({ ...settings, [d.key]: e.target.value })}
                                                    className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 text-sm"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

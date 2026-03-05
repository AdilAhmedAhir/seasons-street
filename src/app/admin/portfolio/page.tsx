"use client";

import React, { useState, useEffect } from "react";
import type { PortfolioItem } from "@/db/schema";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/admin/ImageUpload";

const portfolioCategories = [
    { value: "past_work", label: "Past Work Orders" },
    { value: "shipment", label: "Shipment & Logistics" },
    { value: "finished_goods", label: "Finished Goods" },
];

export default function AdminPortfolioPage() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<PortfolioItem | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [form, setForm] = useState({
        title: "", description: "", category: "past_work", clientName: "", isFeatured: false,
    });

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/portfolio")
            .then((res) => res.json())
            .then(({ data }) => { if (!cancelled) setItems(data || []); })
            .catch(() => { if (!cancelled) setItems([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [refreshKey]);

    const openCreate = () => {
        setEditing(null);
        setForm({ title: "", description: "", category: "past_work", clientName: "", isFeatured: false });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const openEdit = (item: PortfolioItem) => {
        setEditing(item);
        setForm({
            title: item.title, description: item.description || "", category: item.category || "past_work",
            clientName: item.clientName || "", isFeatured: item.isFeatured,
        });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = new FormData();
        body.append("title", form.title);
        body.append("description", form.description);
        body.append("category", form.category);
        body.append("clientName", form.clientName);
        body.append("isFeatured", String(form.isFeatured));
        if (imageFile) body.append("image", imageFile);

        const url = editing ? `/api/admin/portfolio/${editing.id}` : "/api/admin/portfolio";
        await fetch(url, { method: editing ? "PUT" : "POST", body });
        setIsModalOpen(false);
        setRefreshKey((k) => k + 1);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this portfolio item?")) return;
        await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
        setRefreshKey((k) => k + 1);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-serif">Portfolio</h1>
                <Button variant="primary" size="sm" onClick={openCreate}>+ Add Item</Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-text-muted">Loading...</div>
            ) : items.length === 0 ? (
                <div className="bg-surface rounded-xl border border-white/5 p-12 text-center">
                    <h3 className="text-lg font-bold text-text-secondary mb-2">No Portfolio Items</h3>
                    <p className="text-text-muted text-sm mb-4">Showcase your work by adding portfolio items.</p>
                    <Button variant="primary" size="sm" onClick={openCreate}>+ Add Item</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-surface rounded-xl border border-white/5 overflow-hidden">
                            <div className="aspect-[4/3] bg-charcoal-dark flex items-center justify-center overflow-hidden">
                                {item.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-10 h-10 text-text-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                    </svg>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-text-primary text-sm">{item.title}</h3>
                                    {item.isFeatured && (
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold/10 text-gold">Featured</span>
                                    )}
                                </div>
                                {item.clientName && <p className="text-gold text-xs mb-1">{item.clientName}</p>}
                                <p className="text-text-muted text-xs mb-3 line-clamp-2">{item.description || "No description"}</p>
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => openEdit(item)} className="text-gold text-xs hover:text-gold-light cursor-pointer">Edit</button>
                                    <button onClick={() => handleDelete(item.id)} className="text-red-400 text-xs hover:text-red-300 cursor-pointer">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Portfolio Item" : "Add Portfolio Item"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Title *</label>
                        <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer">
                            {portfolioCategories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Client Name</label>
                        <input type="text" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                            className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                            className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                            className="w-4 h-4 accent-gold" />
                        <span className="text-sm text-text-secondary">Featured item</span>
                    </label>
                    <ImageUpload currentUrl={editing?.imageUrl} onUpload={setImageFile} label="Portfolio Image" />
                    <Button variant="primary" size="lg" className="w-full" type="submit">
                        {editing ? "Save Changes" : "Add Item"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import type { Product } from "@/db/schema";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/admin/ImageUpload";

const categories = [
    { value: "quilling", label: "Paper Quilling" },
    { value: "disposables", label: "Sustainable Disposables" },
    { value: "handicrafts", label: "Handicrafts" },
    { value: "printing", label: "Printing Solutions" },
];

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [form, setForm] = useState({
        name: "", category: "quilling", description: "", price: "", moq: "100", tags: "",
    });

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/products")
            .then((res) => res.json())
            .then(({ data }) => { if (!cancelled) setProducts(data || []); })
            .catch(() => { if (!cancelled) setProducts([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [refreshKey]);

    const openCreate = () => {
        setEditingProduct(null);
        setForm({ name: "", category: "quilling", description: "", price: "", moq: "100", tags: "" });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const openEdit = (p: Product) => {
        setEditingProduct(p);
        setForm({
            name: p.name, category: p.category, description: p.description || "",
            price: p.price || "", moq: String(p.moq), tags: p.tags || "",
        });
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = new FormData();
        body.append("name", form.name);
        body.append("category", form.category);
        body.append("description", form.description);
        body.append("price", form.price);
        body.append("moq", form.moq);
        body.append("tags", form.tags);
        if (imageFile) body.append("image", imageFile);
        if (editingProduct) body.append("isActive", "true");

        const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
        const method = editingProduct ? "PUT" : "POST";

        await fetch(url, { method, body });
        setIsModalOpen(false);
        setRefreshKey((k) => k + 1);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this product?")) return;
        await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        setRefreshKey((k) => k + 1);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-serif">Products</h1>
                <Button variant="primary" size="sm" onClick={openCreate}>+ Add Product</Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-text-muted">Loading...</div>
            ) : products.length === 0 ? (
                <div className="bg-surface rounded-xl border border-white/5 p-12 text-center">
                    <svg className="w-16 h-16 mx-auto text-text-muted/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="text-lg font-bold text-text-secondary mb-2">No Products Yet</h3>
                    <p className="text-text-muted text-sm mb-4">Add your first product to get started.</p>
                    <Button variant="primary" size="sm" onClick={openCreate}>+ Add Product</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((p) => (
                        <div key={p.id} className="bg-surface rounded-xl border border-white/5 overflow-hidden">
                            <div className="aspect-[16/10] bg-charcoal-dark flex items-center justify-center overflow-hidden">
                                {p.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-10 h-10 text-text-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-text-primary text-sm">{p.name}</h3>
                                        <span className="text-xs text-gold capitalize">{p.category}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${p.isActive ? "bg-accent-green/10 text-accent-green" : "bg-red-400/10 text-red-400"}`}>
                                        {p.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <p className="text-text-muted text-xs mb-3 line-clamp-2">{p.description || "No description"}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-text-secondary text-xs">MOQ: {p.moq}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(p)} className="text-gold text-xs hover:text-gold-light cursor-pointer">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-400 text-xs hover:text-red-300 cursor-pointer">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add Product"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Name *</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Category *</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer">
                            {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
                        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                            className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Price</label>
                            <input type="text" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Contact for pricing"
                                className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">MOQ</label>
                            <input type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })}
                                className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Tags (comma-separated)</label>
                        <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="handcrafted, eco-friendly"
                            className="w-full px-4 py-3 bg-charcoal border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50" />
                    </div>
                    <ImageUpload currentUrl={editingProduct?.imageUrl} onUpload={setImageFile} label="Product Image" />
                    <Button variant="primary" size="lg" className="w-full" type="submit">
                        {editingProduct ? "Save Changes" : "Add Product"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
}

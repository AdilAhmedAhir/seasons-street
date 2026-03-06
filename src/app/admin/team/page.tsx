"use client";

import React, { useState, useEffect } from "react";
import type { TeamMember } from "@/db/schema";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminTeamPage() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<TeamMember | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [form, setForm] = useState({ name: "", role: "", bio: "", sortOrder: "0" });

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/team")
            .then((res) => res.json())
            .then(({ data }) => { if (!cancelled) setMembers(data || []); })
            .catch(() => { if (!cancelled) setMembers([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [refreshKey]);

    const openCreate = () => {
        setEditing(null);
        setForm({ name: "", role: "", bio: "", sortOrder: "0" });
        setAvatarFile(null);
        setIsModalOpen(true);
    };

    const openEdit = (m: TeamMember) => {
        setEditing(m);
        setForm({ name: m.name, role: m.role, bio: m.bio || "", sortOrder: String(m.sortOrder) });
        setAvatarFile(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const body = new FormData();
        body.append("name", form.name);
        body.append("role", form.role);
        body.append("bio", form.bio);
        body.append("sortOrder", form.sortOrder);
        if (avatarFile) body.append("avatar", avatarFile);
        if (editing) body.append("isActive", "true");

        const url = editing ? `/api/admin/team/${editing.id}` : "/api/admin/team";
        await fetch(url, { method: editing ? "PUT" : "POST", body });
        setIsModalOpen(false);
        setRefreshKey((k) => k + 1);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Remove this team member?")) return;
        await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
        setRefreshKey((k) => k + 1);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold font-serif">Team Members</h1>
                <Button variant="primary" size="sm" onClick={openCreate}>+ Add Member</Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-text-muted">Loading...</div>
            ) : members.length === 0 ? (
                <div className="bg-surface rounded-xl border border-gray-200 p-12 text-center">
                    <h3 className="text-lg font-bold text-text-secondary mb-2">No Team Members</h3>
                    <p className="text-text-muted text-sm mb-4">Add your team to show on the website.</p>
                    <Button variant="primary" size="sm" onClick={openCreate}>+ Add Member</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((m) => (
                        <div key={m.id} className="bg-surface rounded-xl border border-gray-200 p-6 text-center">
                            <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gold/30 flex items-center justify-center overflow-hidden">
                                {m.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-gold font-serif">
                                        {m.name.split(" ").map((n) => n[0]).join("")}
                                    </span>
                                )}
                            </div>
                            <h3 className="font-semibold text-text-primary">{m.name}</h3>
                            <p className="text-gold text-sm mb-2">{m.role}</p>
                            <p className="text-text-muted text-xs line-clamp-2 mb-4">{m.bio || "No bio"}</p>
                            <div className="flex gap-2 justify-center">
                                <button onClick={() => openEdit(m)} className="text-gold text-xs hover:text-gold-light cursor-pointer">Edit</button>
                                <button onClick={() => handleDelete(m.id)} className="text-red-400 text-xs hover:text-red-300 cursor-pointer">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? "Edit Member" : "Add Member"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Name *</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 bg-charcoal border border-gray-200 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Role *</label>
                        <input type="text" required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. CEO, Founder"
                            className="w-full px-4 py-3 bg-charcoal border border-gray-200 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
                        <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4}
                            className="w-full px-4 py-3 bg-charcoal border border-gray-200 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Display Order</label>
                        <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                            className="w-full px-4 py-3 bg-charcoal border border-gray-200 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50" />
                    </div>
                    <ImageUpload currentUrl={editing?.avatarUrl} onUpload={setAvatarFile} label="Avatar Photo" />
                    <Button variant="primary" size="lg" className="w-full" type="submit">
                        {editing ? "Save Changes" : "Add Member"}
                    </Button>
                </form>
            </Modal>
        </div>
    );
}

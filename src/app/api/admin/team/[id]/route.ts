import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const { id } = await params;
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const bio = (formData.get("bio") as string) || null;
        const sortOrder = Number(formData.get("sortOrder")) || 0;
        const isActive = formData.get("isActive") === "true";
        const file = formData.get("avatar") as File | null;

        let avatarUrl: string | undefined;
        if (file && file.size > 0) {
            const blob = await put(`team/${Date.now()}-${file.name}`, file, { access: "public" });
            avatarUrl = blob.url;
        }

        const updateData: Record<string, unknown> = {
            name, role, bio, sortOrder, isActive, updatedAt: new Date(),
        };
        if (avatarUrl) updateData.avatarUrl = avatarUrl;

        const [updated] = await db.update(teamMembers)
            .set(updateData).where(eq(teamMembers.id, Number(id))).returning();

        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error("Error updating team member:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const { id } = await params;
        await db.delete(teamMembers).where(eq(teamMembers.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting team member:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

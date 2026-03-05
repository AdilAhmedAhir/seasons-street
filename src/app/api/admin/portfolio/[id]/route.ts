import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const { id } = await params;
        const formData = await request.formData();
        const title = formData.get("title") as string;
        const description = (formData.get("description") as string) || null;
        const category = (formData.get("category") as string) || null;
        const clientName = (formData.get("clientName") as string) || null;
        const isFeatured = formData.get("isFeatured") === "true";
        const file = formData.get("image") as File | null;

        let imageUrl: string | undefined;
        if (file && file.size > 0) {
            const blob = await put(`portfolio/${Date.now()}-${file.name}`, file, { access: "public" });
            imageUrl = blob.url;
        }

        const updateData: Record<string, unknown> = {
            title, description, category, clientName, isFeatured, updatedAt: new Date(),
        };
        if (imageUrl) updateData.imageUrl = imageUrl;

        const [updated] = await db.update(portfolioItems)
            .set(updateData).where(eq(portfolioItems.id, Number(id))).returning();

        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error("Error updating portfolio item:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const { id } = await params;
        await db.delete(portfolioItems).where(eq(portfolioItems.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting portfolio item:", error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

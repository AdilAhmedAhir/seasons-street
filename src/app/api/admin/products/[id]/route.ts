import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const { id } = await params;
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const description = (formData.get("description") as string) || null;
        const price = (formData.get("price") as string) || null;
        const moq = Number(formData.get("moq")) || 100;
        const tags = (formData.get("tags") as string) || null;
        const isActive = formData.get("isActive") === "true";
        const file = formData.get("image") as File | null;

        let imageUrl: string | undefined;
        if (file && file.size > 0) {
            const blob = await put(`products/${Date.now()}-${file.name}`, file, { access: "public" });
            imageUrl = blob.url;
        }

        const updateData: Record<string, unknown> = {
            name, category, description, price, moq, tags, isActive, updatedAt: new Date(),
        };
        if (imageUrl) updateData.imageUrl = imageUrl;

        const [updated] = await db.update(products)
            .set(updateData)
            .where(eq(products.id, Number(id)))
            .returning();

        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const { id } = await params;
        await db.delete(products).where(eq(products.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    if (!db) return NextResponse.json({ data: [] });
    try {
        const all = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
        return NextResponse.json({ data: all });
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        return NextResponse.json({ data: [] });
    }
}

export async function POST(request: Request) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const formData = await request.formData();
        const title = formData.get("title") as string;
        const description = (formData.get("description") as string) || null;
        const category = (formData.get("category") as string) || null;
        const clientName = (formData.get("clientName") as string) || null;
        const isFeatured = formData.get("isFeatured") === "true";
        const file = formData.get("image") as File | null;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        let imageUrl: string | null = null;
        if (file && file.size > 0) {
            const blob = await put(`portfolio/${Date.now()}-${file.name}`, file, { access: "public" });
            imageUrl = blob.url;
        }

        const [item] = await db.insert(portfolioItems).values({
            title, description, imageUrl, category, clientName, isFeatured,
        }).returning();

        return NextResponse.json({ data: item }, { status: 201 });
    } catch (error) {
        console.error("Error creating portfolio item:", error);
        return NextResponse.json({ error: "Failed to create portfolio item" }, { status: 500 });
    }
}

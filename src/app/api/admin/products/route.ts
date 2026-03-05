import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    if (!db) return NextResponse.json({ data: [] });
    try {
        const all = await db.select().from(products).orderBy(desc(products.createdAt));
        return NextResponse.json({ data: all });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ data: [] });
    }
}

export async function POST(request: Request) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const category = formData.get("category") as string;
        const description = (formData.get("description") as string) || null;
        const price = (formData.get("price") as string) || null;
        const moq = Number(formData.get("moq")) || 100;
        const tags = (formData.get("tags") as string) || null;
        const file = formData.get("image") as File | null;

        if (!name || !category) {
            return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
        }

        let imageUrl: string | null = null;
        if (file && file.size > 0) {
            const blob = await put(`products/${Date.now()}-${file.name}`, file, { access: "public" });
            imageUrl = blob.url;
        }

        const [newProduct] = await db.insert(products).values({
            name, category, description, imageUrl, price, moq, tags,
        }).returning();

        return NextResponse.json({ data: newProduct }, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}

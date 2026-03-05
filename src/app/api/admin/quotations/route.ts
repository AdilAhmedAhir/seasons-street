import { NextResponse } from "next/server";
import { db } from "@/db";
import { quotations } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    if (!db) return NextResponse.json({ data: [] });
    try {
        const all = await db.select().from(quotations).orderBy(desc(quotations.createdAt));
        return NextResponse.json({ data: all });
    } catch (error) {
        console.error("Error fetching quotations:", error);
        return NextResponse.json({ data: [] });
    }
}

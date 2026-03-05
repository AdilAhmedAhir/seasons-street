import { NextResponse } from "next/server";
import { db } from "@/db";
import { quotations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!["Pending", "Reviewed", "Approved", "Rejected"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const [updated] = await db.update(quotations)
            .set({ status, updatedAt: new Date() })
            .where(eq(quotations.id, Number(id)))
            .returning();

        return NextResponse.json({ data: updated });
    } catch (error) {
        console.error("Error updating quotation:", error);
        return NextResponse.json({ error: "Failed to update quotation" }, { status: 500 });
    }
}

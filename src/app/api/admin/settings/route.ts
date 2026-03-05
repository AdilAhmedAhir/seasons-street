import { NextResponse } from "next/server";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    if (!db) return NextResponse.json({ data: [] });
    try {
        const all = await db.select().from(siteSettings);
        return NextResponse.json({ data: all });
    } catch (error) {
        console.error("Error fetching settings:", error);
        return NextResponse.json({ data: [] });
    }
}

export async function POST(request: Request) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const body = await request.json();
        const { settings } = body as { settings: { key: string; value: string; section: string; label: string }[] };

        const results = [];
        for (const setting of settings) {
            // Upsert: check if exists, then insert or update
            const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, setting.key));

            if (existing.length > 0) {
                const [updated] = await db.update(siteSettings)
                    .set({ value: setting.value, updatedAt: new Date() })
                    .where(eq(siteSettings.key, setting.key))
                    .returning();
                results.push(updated);
            } else {
                const [created] = await db.insert(siteSettings)
                    .values(setting)
                    .returning();
                results.push(created);
            }
        }

        return NextResponse.json({ data: results });
    } catch (error) {
        console.error("Error saving settings:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}

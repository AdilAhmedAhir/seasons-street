import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { teamMembers } from "@/db/schema";


export async function GET() {
    if (!db) return NextResponse.json({ data: [] });
    try {
        const all = await db.select().from(teamMembers).orderBy(teamMembers.sortOrder);
        return NextResponse.json({ data: all });
    } catch (error) {
        console.error("Error fetching team:", error);
        return NextResponse.json({ data: [] });
    }
}

export async function POST(request: Request) {
    if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const role = formData.get("role") as string;
        const bio = (formData.get("bio") as string) || null;
        const sortOrder = Number(formData.get("sortOrder")) || 0;
        const file = formData.get("avatar") as File | null;

        if (!name || !role) {
            return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
        }

        let avatarUrl: string | null = null;
        if (file && file.size > 0) {
            const blob = await put(`team/${Date.now()}-${file.name}`, file, { access: "public" });
            avatarUrl = blob.url;
        }

        const [member] = await db.insert(teamMembers).values({
            name, role, bio, avatarUrl, sortOrder,
        }).returning();

        return NextResponse.json({ data: member }, { status: 201 });
    } catch (error) {
        console.error("Error creating team member:", error);
        return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
    }
}

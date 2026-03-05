import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { db } from "@/db";
import { quotations } from "@/db/schema";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const orderType = formData.get("orderType") as string;
        const companyName = formData.get("companyName") as string;
        const email = formData.get("email") as string;
        const phone = (formData.get("phone") as string) || null;
        const product = (formData.get("product") as string) || null;
        const customDescription =
            (formData.get("customDescription") as string) || null;
        const quantity = Number(formData.get("quantity"));
        const notes = (formData.get("notes") as string) || null;
        const file = formData.get("file") as File | null;

        // Validate required fields
        if (!companyName || !email || !orderType) {
            return NextResponse.json(
                { error: "Company name, email, and order type are required." },
                { status: 400 }
            );
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        // Validate MOQ
        const minQuantity = orderType === "standard" ? 100 : 200;
        if (!quantity || quantity < minQuantity) {
            return NextResponse.json(
                {
                    error: `Minimum order quantity for ${orderType} orders is ${minQuantity} pieces.`,
                },
                { status: 400 }
            );
        }

        // Custom order requires description
        if (orderType === "custom" && !customDescription) {
            return NextResponse.json(
                { error: "Custom design description is required for custom orders." },
                { status: 400 }
            );
        }

        // Handle file upload to Vercel Blob
        let fileUrl: string | null = null;
        let fileName: string | null = null;

        if (file && file.size > 0) {
            const blob = await put(`designs/${Date.now()}-${file.name}`, file, {
                access: "public",
            });
            fileUrl = blob.url;
            fileName = file.name;
        } else if (orderType === "custom") {
            return NextResponse.json(
                { error: "Please upload a design file for custom orders." },
                { status: 400 }
            );
        }

        // Insert into database
        if (!db) {
            return NextResponse.json(
                { error: "Database is not configured. Please set up environment variables." },
                { status: 503 }
            );
        }

        const [newQuotation] = await db
            .insert(quotations)
            .values({
                orderType,
                companyName,
                email,
                phone,
                product,
                customDescription,
                quantity,
                notes,
                fileUrl,
                fileName,
                status: "Pending",
            })
            .returning();

        return NextResponse.json({
            success: true,
            message: "Quotation request received successfully.",
            data: {
                id: newQuotation.id,
                status: newQuotation.status,
                submittedAt: newQuotation.createdAt,
            },
        });
    } catch (error) {
        console.error("Quotation submission error:", error);
        return NextResponse.json(
            { error: "Failed to submit quotation. Please try again." },
            { status: 500 }
        );
    }
}

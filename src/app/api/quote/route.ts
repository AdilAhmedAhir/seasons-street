import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate minimum quantities
        const { orderType, quantity } = body;
        const minQuantity = orderType === "standard" ? 100 : 200;

        if (!quantity || quantity < minQuantity) {
            return NextResponse.json(
                {
                    error: `Minimum order quantity for ${orderType} orders is ${minQuantity} pieces.`,
                },
                { status: 400 }
            );
        }

        // Mock: Log and return success
        console.log("Quotation Request:", body);

        return NextResponse.json({
            success: true,
            message: "Quotation request received successfully.",
            data: {
                id: `QR-${Date.now()}`,
                ...body,
                status: "Pending",
                submittedAt: new Date().toISOString(),
            },
        });
    } catch {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }
}

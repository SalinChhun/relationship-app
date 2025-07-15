import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();

        await prisma.pushSubscription.deleteMany({
            where: { userId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error removing subscription:", error);
        return NextResponse.json({ success: false, error: "Failed to remove subscription" }, { status: 500 });
    }
}

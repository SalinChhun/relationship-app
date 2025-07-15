import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { subscription, userId } = await req.json();

        if (!userId || !subscription?.endpoint) {
            return NextResponse.json({ success: false, error: "Missing data" }, { status: 400 });
        }

        await prisma.pushSubscription.upsert({
            where: { endpoint: subscription.endpoint },
            update: {
                p256dhKey: subscription.keys.p256dh,
                authKey: subscription.keys.auth,
            },
            create: {
                userId,
                endpoint: subscription.endpoint,
                p256dhKey: subscription.keys.p256dh,
                authKey: subscription.keys.auth,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error saving subscription:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

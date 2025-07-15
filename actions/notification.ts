"use server";
import webpush from "web-push";
import {prisma} from "@/lib/prisma";

// Validate environment variables
const validateEnvVars = () => {
	// Try different ways to access environment variables
	const publicKey = process.env.NEXT_PUBLIC_VAPID_KEY || process.env.VAPID_PUBLIC_KEY;
	const privateKey = process.env.VAPID_PRIVATE_KEY;

	console.log('Environment check:', {
		hasPublicKey: !!publicKey,
		hasPrivateKey: !!privateKey,
		publicKeyLength: publicKey?.length || 0,
		privateKeyLength: privateKey?.length || 0
	});

	if (!publicKey || !privateKey) {
		throw new Error(`Missing VAPID keys: ${!publicKey ? 'NEXT_PUBLIC_VAPID_KEY' : ''} ${!privateKey ? 'VAPID_PRIVATE_KEY' : ''}`);
	}

	return { publicKey, privateKey };
};

export const sendNotification = async (
	message: string,
	icon: string,
	name: string,
	userId: any
) => {
	try {
		const { publicKey, privateKey } = validateEnvVars();

		webpush.setVapidDetails("mailto:you@example.com", publicKey, privateKey);

		const subscriptions = await prisma.pushSubscription.findMany({
			where: { userId: parseInt(userId) },
		});

		console.log('subscriptions:', subscriptions);

		const results = await Promise.allSettled(
			subscriptions.map((sub: any) =>
				webpush.sendNotification(
					{
						endpoint: sub.endpoint,
						keys: {
							auth: sub.authKey,
							p256dh: sub.p256dhKey,
						},
					},
					JSON.stringify({
						message: name,
						icon,
						body: message,
					})
				)
			)
		);

		const errors = results.filter((r: any) => r.status === 'rejected');
		if (errors.length > 0) {
			console.error("Some notifications failed:", errors);
		}

		return JSON.stringify({
			success: true,
			message: "Notifications sent",
			failedCount: errors.length,
		});

	} catch (error: any) {
		return JSON.stringify({
			success: false,
			error: error.message,
		});
	}
};
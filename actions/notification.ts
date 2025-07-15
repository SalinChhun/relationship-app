"use server";
import webpush from "web-push";
import {subscriptionStore} from "@/lib/subscription-store";

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

export const storeSubscription = async (subscriptionData: string, userId: string = 'default') => {
	try {
		const subscription = JSON.parse(subscriptionData);
		subscriptionStore.store(userId, subscription);
		return JSON.stringify({ success: true });
	} catch (error: any) {
		return JSON.stringify({ success: false, error: error.message });
	}
};

export const sendNotification = async (
	message: string,
	icon: string,
	name: string,
	userId: string = 'default'
) => {
	try {
		// Validate environment variables first
		const { publicKey, privateKey } = validateEnvVars();

		console.log('Public key length:', publicKey.length);
		console.log('Private key length:', privateKey.length);
		console.log('Public key starts with B:', publicKey.startsWith('B'));
		console.log('Private key format valid:', privateKey.length === 43);

		webpush.setVapidDetails(
			"mailto:myuserid@email.com",
			publicKey,
			privateKey
		);

		const subscription: any = subscriptionStore.get(userId);

		if (!subscription) {
			return JSON.stringify({
				success: false,
				error: "No subscription found for user"
			});
		}

		const payload = JSON.stringify({
			title: name,
			body: message,
			icon: icon,
			badge: icon,
			tag: 'notification-tag',
			data: {
				url: '/'
			}
		});

		await webpush.sendNotification(
			subscription, payload
		);

		return JSON.stringify({
			success: true,
			message: "Notification sent successfully"
		});

	} catch (error: any) {
		console.error("Error sending notification:", error);
		return JSON.stringify({
			success: false,
			error: error.message || "Failed to send notification"
		});
	}
};

export const sendNotificationToAll = async (
	message: string,
	icon: string,
	name: string
) => {
	try {
		// Validate environment variables first
		const { publicKey, privateKey } = validateEnvVars();

		webpush.setVapidDetails(
			"mailto:myuserid@email.com",
			publicKey,
			privateKey
		);

		const subscriptions = subscriptionStore.getAll();

		if (subscriptions.length === 0) {
			return JSON.stringify({
				success: false,
				error: "No subscriptions found"
			});
		}

		const payload = JSON.stringify({
			title: name,
			body: message,
			icon: icon,
			badge: icon,
			tag: 'notification-tag',
			data: {
				url: '/'
			}
		});

		const results = await Promise.allSettled(
			subscriptions.map((subscription: any) =>
				webpush.sendNotification(subscription, payload)
			)
		);

		const successful = results.filter((result: any) => result.status === 'fulfilled').length;
		const failed = results.filter((result: any) => result.status === 'rejected').length;

		return JSON.stringify({
			success: true,
			message: `Notification sent to ${successful} subscribers. ${failed} failed.`,
			stats: { successful, failed, total: subscriptions.length }
		});

	} catch (error: any) {
		console.error("Error sending notifications:", error);
		return JSON.stringify({
			success: false,
			error: error.message || "Failed to send notifications"
		});
	}
};
"use client";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, BellRing } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { urlB64ToUint8Array } from "@/utils/utils";
import { storeSubscription } from "@/actions/notification";

export default function NotificationRequest() {
	const queryClient = useQueryClient();
	const [notificationPermission, setNotificationPermission] = useState<
		"granted" | "denied" | "default"
	>("default");
	const [isLoading, setIsLoading] = useState(false);
	const [hasSubscription, setHasSubscription] = useState(false);

	const showNotification = async () => {
		if (isLoading) return;

		setIsLoading(true);

		if ("Notification" in window) {
			try {
				const permission = await Notification.requestPermission();
				setNotificationPermission(permission);

				if (permission === "granted") {
					await subscribeUser();
				} else {
					toast.info("Please enable notifications in your browser settings.");
				}
			} catch (error) {
				console.error("Error requesting notification permission:", error);
				toast.error("Failed to request notification permission.");
			}
		} else {
			toast.error("This browser does not support notifications.");
		}

		setIsLoading(false);
	};

	async function subscribeUser() {
		if (!("serviceWorker" in navigator)) {
			toast.error("Service workers are not supported in this browser");
			return;
		}

		try {
			await navigator.serviceWorker.ready;

			let registration = await navigator.serviceWorker.getRegistration();

			if (!registration) {
				registration = await navigator.serviceWorker.register("/sw.js");
				await navigator.serviceWorker.ready;
			}

			await generateSubscribeEndPoint(registration);

		} catch (error: any) {
			console.error("Service worker registration error:", error);
			toast.error("Failed to register service worker: " + error.message);
		}
	}

	const generateSubscribeEndPoint = async (registration: ServiceWorkerRegistration) => {
		try {
			if (!registration.pushManager) {
				throw new Error('Push manager unavailable.');
			}

			if (!process.env.NEXT_PUBLIC_VAPID_KEY) {
				throw new Error('VAPID key not found in environment variables.');
			}

			const applicationServerKey = urlB64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_KEY
			);

			const options = {
				applicationServerKey,
				userVisibleOnly: true,
			};

			const subscription = await registration.pushManager.subscribe(options);
			console.log("Subscription successful:", subscription);

			// Store subscription on server
			const result = await storeSubscription(JSON.stringify(subscription));
			const response = JSON.parse(result);

			if (response.success) {
				setHasSubscription(true);
				toast.success("Push notifications enabled successfully!");
			} else {
				throw new Error(response.error);
			}

		} catch (error: any) {
			console.error('Detailed subscription error:', error);

			if (error.name === 'AbortError') {
				toast.error('Push service error. Try using HTTPS or test in production.');
			} else if (error.name === 'NotSupportedError') {
				toast.error('Push notifications are not supported in this browser.');
			} else if (error.name === 'NotAllowedError') {
				toast.error('Push notifications are blocked. Please enable them in browser settings.');
			} else {
				toast.error(`Subscription failed: ${error.message}`);
			}

			throw error;
		}
	};

	const removeNotification = async () => {
		try {
			const registration = await navigator.serviceWorker.getRegistration();
			if (registration) {
				const subscription = await registration.pushManager.getSubscription();
				if (subscription) {
					await subscription.unsubscribe();
				}
			}

			setHasSubscription(false);
			setNotificationPermission("denied");
			toast.success("Push notifications disabled.");

		} catch (error) {
			console.error("Error removing notification:", error);
			toast.error("Failed to disable notifications.");
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined' && 'Notification' in window) {
			setNotificationPermission(Notification.permission);
		}
	}, []);

	return (
		<div className="hover:scale-110 cursor-pointer transition-all relative">
			{isLoading && (
				<div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
					<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
				</div>
			)}

			{notificationPermission === "granted" && hasSubscription ? (
				<BellRing
					onClick={removeNotification}
					className={`${isLoading ? 'opacity-50' : ''}`}
				/>
			) : (
				<BellOff
					onClick={showNotification}
					className={`${isLoading ? 'opacity-50' : ''}`}
				/>
			)}
		</div>
	);
}
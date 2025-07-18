"use client";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, BellRing } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { urlB64ToUint8Array } from "@/utils/utils";
import {UserType} from "@/app/types/user";

interface NotificationRequestProps {
	currentUser: UserType | null;
}

export const NotificationRequest: React.FC<NotificationRequestProps> = ({
																		  currentUser
																	  }) => {
	const queryClient = useQueryClient();
	const [notificationPermission, setNotificationPermission] = useState<
		"granted" | "denied" | "default"
	>("default");
	const [isLoading, setIsLoading] = useState(false);

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

			// Wait for service worker to be ready
			const registration = await navigator.serviceWorker.ready;

            // Check if service worker is actually registered
            if (!registration) {
                toast.error("Service worker not registered");
            }

			// Small delay to ensure service worker is fully initialized
			await new Promise(resolve => setTimeout(resolve, 100));

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

			const saveSubscription = async (subscription: PushSubscription) => {
				try {
					const response = await fetch("/api/v1/notifications/subscribe", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							subscription: subscription.toJSON(),
							userId: currentUser?.id,
						}),
					});

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					toast.success("Notifications enabled successfully!");
				} catch (error) {
					console.error("Error saving subscription:", error);
					toast.error("Failed to save subscription to server.");
				}
			};

			// Check if already subscribed
			const existingSubscription = await registration.pushManager.getSubscription();
			if (existingSubscription) {
				console.log("Already subscribed:", existingSubscription);
				// Save existing subscription to backend
				await saveSubscription(existingSubscription);
				return;
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

			// Save to backend via route (since Prisma cannot run directly in client component)
			await saveSubscription(subscription);

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

			setNotificationPermission("denied");
			// Remove subscription from your database via API
			await fetch("/api/v1/notifications/unsubscribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: currentUser?.id,
				}),
			});

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

			{notificationPermission === "granted" ? (
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
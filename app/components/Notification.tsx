"use client";
// import useUser from "@/app/hook/useUser";
// import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, BellRing } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {urlB64ToUint8Array} from "@/utils/utils";

export default function NotificationRequest() {
	// const { data: user, isFetching } = useUser();
	const queryClient = useQueryClient();

	const [notificationPermission, setNotificationPermission] = useState<
		"granted" | "denied" | "default"
	>("granted");

	// Check permission status when component mounts

	const showNotification = () => {
		if ("Notification" in window) {
			Notification.requestPermission().then((permission) => {
				setNotificationPermission(permission);
				if (permission === "granted") {
					subscribeUser();
				} else {
					toast.info(
						"please go to setting and enable noitificatoin."
					);
				}
			});
		} else {
			toast.info("This browser does not support notifications.");
		}
	};

	async function subscribeUser() {
		if ("serviceWorker" in navigator) {
			try {
				// Check if service worker is already registered
				const registration = await navigator.serviceWorker.getRegistration();
				if (registration) {
					generateSubscribeEndPoint(registration);
				} else {
					// Register the service worker
					const newRegistration = await navigator.serviceWorker.register("/sw.js");
					// Subscribe to push notifications
					generateSubscribeEndPoint(newRegistration);
				}
			} catch (error) {
				toast.error(
					"Error during service worker registration or subscription:"
				);
			}
		} else {
			toast.error("Service workers are not supported in this browser");
		}
	}

	const generateSubscribeEndPoint = async (newRegistration: ServiceWorkerRegistration) => {
		try {
			console.log("Service Worker Registration:", newRegistration);

			// Check if push manager is available
			if (!newRegistration.pushManager) {
				throw new Error('Push manager unavailable.');
			}

			const applicationServerKey = urlB64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_KEY!
			);

			console.log("VAPID Key Length:", applicationServerKey.length);

			const options = {
				applicationServerKey,
				userVisibleOnly: true,
			};

			const subscription = await newRegistration.pushManager.subscribe(options);
			console.log("Subscription successful:", subscription);

			return subscription;

		} catch (error: any) {
			console.error('Detailed subscription error:', error);

			if (error.name === 'AbortError') {
				toast.error('Push service error. Please try in a production environment with HTTPS.');
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
		// remove from notification
		setNotificationPermission("denied");
		// const supabase = createSupabaseBrowser();
		//
		// const { error } = await supabase
		// 	.from("notification")
		// 	.delete()
		// 	.eq("user_id", user?.id!);

		// if (error) {
		// 	toast.error(error.message);
		// } else {
		// 	queryClient.invalidateQueries({ queryKey: ["user"] });
		// }
	};

	useEffect(() => {
		setNotificationPermission(Notification.permission);
	}, []);

	/*if (isFetching) {
		return null;
	}*/
	return (
		<div className=" hover:scale-110 cursor-pointer transition-all">
			{/*{notificationPermission === "granted" && user?.notification ? (*/}
			{notificationPermission === "granted" ? (
				<BellRing onClick={removeNotification} />
			) : (
				<BellOff onClick={showNotification} />
			)}
		</div>
	);
}

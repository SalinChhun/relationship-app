"use client";
import NotificationRequest from "@/app/components/Notification";
import { sendNotification, sendNotificationToAll } from "@/actions/notification";

export default function NotificationPage() {
    const handleSendNotification = async () => {
        console.log("Sending notification...");

        try {
            const result = await sendNotification(
                "This is a test notification",
                "/icon-192x192.png",
                "Test Notification"
            );

            const response = JSON.parse(result);
            if (response.success) {
                alert("Notification sent successfully!");
            } else {
                alert("Failed to send notification: " + response.error);
            }
        } catch (error: any) {
            console.error("Error sending notification:", error);
            alert("Error sending notification: " + error.message);
        }
    };

    const handleSendToAll = async () => {
        console.log("Sending notification to all subscribers...");

        try {
            const result = await sendNotificationToAll(
                "This is a broadcast notification",
                "/icon-192x192.png",
                "Broadcast Notification"
            );

            const response = JSON.parse(result);
            if (response.success) {
                alert(`Broadcast sent! ${response.message}`);
            } else {
                alert("Failed to send broadcast: " + response.error);
            }
        } catch (error: any) {
            console.error("Error sending broadcast:", error);
            alert("Error sending broadcast: " + error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <NotificationRequest />
            <div className="flex gap-4">
                <button
                    onClick={handleSendNotification}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Send Test Notification
                </button>
                <button
                    onClick={handleSendToAll}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Send to All Subscribers
                </button>
            </div>
        </div>
    );
}
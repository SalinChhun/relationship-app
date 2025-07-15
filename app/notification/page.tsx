"use client";
import { sendNotification } from "@/actions/notification";
import {useEffect, useState} from "react";
import type {UserType} from "@/app/types/user";
import {getCurrentUserFromLocalStorage} from "@/utils/auth";
import {NotificationRequest} from "@/app/components/Notification";

export default function NotificationPage() {

    const [currentUser, setCurrentUser] = useState<UserType | null>(null)

    // TODO: Check if user is logged in
    useEffect(() => {
        setCurrentUser(getCurrentUserFromLocalStorage())
    }, [])

    const handleSendNotification = async () => {
        console.log("Sending notification...");

        try {
            const result = await sendNotification(
                "This is a test notification",
                "/icon-192x192.png",
                "Test Notification",
                currentUser?.id
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <NotificationRequest currentUser={currentUser}/>
            <div className="flex gap-4">
                <button
                    onClick={handleSendNotification}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Send Test Notification
                </button>
            </div>
        </div>
    );
}
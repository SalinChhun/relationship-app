import NotificationRequest from "@/app/components/Notification";
import {sendNotification} from "@/actions/notification";

export default function NotificationPage() {

    const handleSendNotification = async () => {
        console.log("Sending notification...");
        alert("Sending notification...");

        try {
            const result = await sendNotification(
                "This is a test notification",
                "https://example.com/icon.png",
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


    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <NotificationRequest/>
            <button onClick={handleSendNotification} className="w-10 h-10">Click Send</button>
        </div>
    )
}
import React, {useState} from "react";
import {Home, Plus, User} from "lucide-react";
import {CreatePost} from "@/app/ui/CreatePost";
import {sendNotification} from "@/actions/notification";

interface HeaderProps {
    currentUser: any;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const NavigationBottom: React.FC<HeaderProps> = ({
                                                currentUser,
                                                activeTab,
                                                setActiveTab,
                                              }) => {

    const [isOpenCreatePost, setIsOpenCreatePost] = useState(false)

    const handleSendNotification = async () => {
        console.log("Sending notification...");
        alert("Sending notification...");

        try {
            const result = await sendNotification(
                "This is a test notification",
                currentUser?.id || "test-user",
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around items-center">
                return (
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
                    <div className="relative flex justify-between items-center">

                        {/* Left Item */}
                        <button
                            onClick={() => setActiveTab("home")}
                            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                                activeTab === "home"
                                    ? "text-rose-600 bg-rose-50"
                                    : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                        >
                            <Home className="h-6 w-6"/>
                            {/*<span className="text-xs font-medium">Home</span>*/}
                        </button>

                        {/* Create Button in Center */}
                        <button
                            onClick={() => setIsOpenCreatePost(true)}
                            className="-translate-x-1/2 w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-transform"
                        >
                            <Plus className="h-6 w-6 text-white"/>
                        </button>

                        {/*<button
                            onClick={handleSendNotification}
                            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                                activeTab === "profile"
                                    ? "text-rose-600 bg-rose-50"
                                    : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                        >
                            <User className="h-6 w-6"/>
                            <span className="text-xs font-medium">Send Notification</span>
                        </button>*/}

                        {/* Right Item */}
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                                activeTab === "profile"
                                    ? "text-rose-600 bg-rose-50"
                                    : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                            }`}
                        >
                            <User className="h-6 w-6"/>
                            {/*<span className="text-xs font-medium">Profile</span>*/}
                        </button>
                    </div>
                </nav>
                );
            </div>

            {/* Add Post Modal */}
            <CreatePost
                isOpen={isOpenCreatePost}
                onClose={() => setIsOpenCreatePost(false)}
                currentUser={currentUser}
            />

        </nav>
    )
}
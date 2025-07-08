import type React from "react";
import {Heart, UserPlus} from "lucide-react";

export const NotificationsPage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <Heart className="h-5 w-5 text-white"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-900">Someone liked your relationship post</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <UserPlus className="h-5 w-5 text-white"/>
                        </div>
                        <div>
                            <p className="text-sm text-gray-900">New person joined LoveConnect</p>
                            <p className="text-xs text-gray-500">5 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
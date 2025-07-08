import React, {useEffect, useRef, useState} from "react";
import {Heart, LogOut, Settings, User} from "lucide-react";
import {UserType} from "@/app/types/user";

interface HeaderProps {
    setActiveTab: () => void;
    currentUser: UserType | null;
}

export const Header: React.FC<HeaderProps> = ({
                                                  setActiveTab,
                                                  currentUser
                                              }) => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('currentUser');
        // Redirect to login page or refresh
        window.location.href = '/login';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                            <Heart className="h-5 w-5 text-white" fill="currentColor"/>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                            Komsan
                        </h1>
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div
                                className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {currentUser?.name.charAt(0)}
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                {/* User Info Section */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {currentUser?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">@{currentUser?.username}</p>
                                            <p className="text-xs text-gray-400">{currentUser?.age} years
                                                • {currentUser?.gender}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button
                                        onClick={() => {
                                            setActiveTab();
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <User className="h-4 w-4 text-gray-500"/>
                                        <span className="text-sm text-gray-700">View Profile</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            // Handle settings navigation
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <Settings className="h-4 w-4 text-gray-500"/>
                                        <span className="text-sm text-gray-700">Settings</span>
                                    </button>
                                </div>

                                {/* Logout */}
                                <div className="border-t border-gray-100 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-red-50 transition-colors group"
                                    >
                                        <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-500"/>
                                        <span
                                            className="text-sm text-gray-700 group-hover:text-red-600">Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
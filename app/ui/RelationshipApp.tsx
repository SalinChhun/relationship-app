"use client"
import React, {useRef} from "react"
import {useEffect, useState} from "react"
import {
    Heart,
    Plus,
    Star,
    Trash2,
    UserPlus,
    Home,
    Users,
    Bell,
    User,
    MessageCircle,
    ThumbsUp,
    Share, Settings, ChevronDown, LogOut
} from "lucide-react"
import {ProfilePage} from "@/app/ui/ProfilePage";
import {NotificationsPage} from "@/app/ui/NotificationsPage";
import {FriendsPage} from "@/app/ui/FriendsPage";
import {getCurrentUserFromLocalStorage} from "@/utils/auth";
import {CreateRelationship} from "@/app/ui/CreateRelationship";
import {Gender, RelationshipType} from "@prisma/client";
import {relationshipTypes} from "@/utils/utils";
import useRelationshipMutation from "@/lib/hooks/relationships-mutation";

// TypeScript interfaces
interface User {
    id: number
    username: string
    name: string
    age: number
    gender: Gender
    type?: string
    createdAt?: string
    updatedAt?: string
}


const SocialLoveApp: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [activeTab, setActiveTab] = useState<string>("home")
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {feeds, isLoading} = useRelationshipMutation.useFetchRelationships()
    console.log("Feeds: ", feeds);


    // Initialize app
    useEffect(() => {
        // Mock current user
        console.log('get current user ', getCurrentUserFromLocalStorage())
        setCurrentUser(getCurrentUserFromLocalStorage())
    }, [])

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

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem('currentUser');
        // Redirect to login page or refresh
        window.location.href = '/login';
    };

    const deleteRelationship = (id: number): void => {

    }

    const getRelationshipTypeData = (type: RelationshipType): any => {
        return relationshipTypes.find((t) => t.label === type) || {value: type, label: type, emoji: "💝"}
    }


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            </div>
        )
    }

    // Home Feed Component
    const HomeFeed: React.FC = () => (
        <div className="max-w-2xl mx-auto">
            {/* Post Creator */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {currentUser?.name.charAt(0)}
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-left text-gray-600 transition-colors"
                    >
                        Share your love story...
                    </button>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex-1 justify-center"
                    >
                        <Heart className="h-5 w-5 text-rose-500"/>
                        <span className="font-medium">Add Relationship</span>
                    </button>
                </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-3">
                {feeds?.data.map((relationship: any) => {
                    const relationshipData = getRelationshipTypeData(relationship.relationshipType)
                    return (
                        <div key={relationship.id}
                             className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Post Header */}
                            <div className="p-4 pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-11 h-11 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                            {relationship?.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{relationship?.user?.name}</h3>
                                            <p className="text-sm text-gray-500">2h</p>
                                        </div>
                                    </div>
                                    {relationship.userId === currentUser?.id && (
                                        <button
                                            onClick={() => deleteRelationship(relationship.id)}
                                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="px-4 pb-4">
                                <p className="text-gray-800 mb-4 leading-relaxed">
                                    {/*{relationship.userId === currentUser?.id ? "I'm " : `${relationship?.user?.name} is `}*/}
                                    {relationship?.partner?.name ? (
                                        <>
                                            {relationship?.user?.name} is now in a relationship with <span
                                            className="font-medium text-gray-900">{relationship?.partner?.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            {relationship?.user?.name} is now in a relationship {relationshipData.label}
                                        </>
                                    )}
                                </p>

                                {/* Modern Relationship Card */}
                                <div
                                    className="bg-gradient-to-r from-gray-50 to-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <div
                                        className={`flex items-center gap-4 overflow-hidden ${relationship?.partner?.name ? 'justify-between' : 'justify-center'}`}>
                                        {/* Left Person */}
                                        {relationship?.partner?.name && (
                                            <div className="flex items-center space-x-3 min-w-0">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">{relationship?.user?.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{relationship?.user?.age}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Relationship Status */}
                                        <div className="flex flex-col items-center space-y-1 shrink-0 w-20 text-center">
                                            <span className="text-2xl">{relationshipData.emoji}</span>
                                            <span
                                                className="text-xs text-gray-500 font-medium truncate">{relationshipData.label}</span>
                                        </div>

                                        {/* Right Person */}
                                        {relationship?.partner?.name && (
                                            <div className="flex items-center space-x-3 min-w-0 justify-end text-right">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm truncate">{relationship?.partner?.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{relationship?.partner?.age}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* Post Actions */}
                            <div className="border-t border-gray-100 px-4 py-3">
                                <div className="flex items-center justify-around">
                                    <button
                                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50">
                                        <ThumbsUp className="h-5 w-5"/>
                                        <span className="text-sm font-medium">Like</span>
                                    </button>
                                    <button
                                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50">
                                        <MessageCircle className="h-5 w-5"/>
                                        <span className="text-sm font-medium">Comment</span>
                                    </button>
                                    <button
                                        className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors py-2 px-3 rounded-lg hover:bg-green-50">
                                        <Share className="h-5 w-5"/>
                                        <span className="text-sm font-medium">Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <HomeFeed/>
            case "friends":
                return <FriendsPage/>
            case "notifications":
                return <NotificationsPage/>
            case "profile":
                return <ProfilePage/>
            default:
                return <HomeFeed/>
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                                <Heart className="h-5 w-5 text-white" fill="currentColor"/>
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                Sneha
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
                                                setActiveTab("profile");
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

            {/* Main Content */}
            <main className="pb-20 px-4 py-4">
                {renderContent()}
            </main>

            {/* Bottom Navigation */}
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
                                <span className="text-xs font-medium">Home</span>
                            </button>

                            {/* Create Button in Center */}
                            <button
                                onClick={
                                    () => {
                                        setActiveTab("create");
                                        setIsOpen(true)
                                    }
                                }
                                className="absolute left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                <Plus className="h-6 w-6 text-white"/>
                            </button>

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
                                <span className="text-xs font-medium">Profile</span>
                            </button>
                        </div>
                    </nav>
                    );
                </div>
            </nav>

            {/* Add Relationship Modal */}
            <CreateRelationship
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                currentUser={currentUser}
            />
        </div>
    )
}

export default SocialLoveApp
"use client"
import type React from "react"
import {useEffect, useState} from "react"
import {Heart, Plus, Star, Trash2, UserPlus, Home, Users, Bell, User, MessageCircle, ThumbsUp, Share} from "lucide-react"

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

interface UserRelationship {
    id: number
    userId: number
    partnerId: number
    relationshipType: RelationshipType
    partner: User
    createdAt?: string
    updatedAt?: string
}

interface RelationshipFormData {
    partnerId: string
    relationshipType: RelationshipType
}

interface RelationshipTypeOption {
    value: RelationshipType
    label: string
    emoji: string
}

// Enums
enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

enum RelationshipType {
    GIRLFRIEND = "GIRLFRIEND",
    BOYFRIEND = "BOYFRIEND",
    WIFE = "WIFE",
    HUSBAND = "HUSBAND",
    DHARMA_SISTER = "DHARMA_SISTER",
    DHARMA_BROTHER = "DHARMA_BROTHER",
}

const SocialLoveApp: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [activeTab, setActiveTab] = useState<string>("home")
    const [showAddForm, setShowAddForm] = useState<boolean>(false)
    const [users, setUsers] = useState<User[]>([])
    const [relationships, setRelationships] = useState<UserRelationship[]>([])
    const [allRelationships, setAllRelationships] = useState<UserRelationship[]>([])

    const [relationshipForm, setRelationshipForm] = useState<RelationshipFormData>({
        partnerId: "",
        relationshipType: RelationshipType.GIRLFRIEND,
    })

    // Mock data
    const mockUsers: User[] = [
        { id: 1, username: "john_doe", name: "John Doe", age: 25, gender: Gender.MALE },
        { id: 2, username: "jane_smith", name: "Jane Smith", age: 23, gender: Gender.FEMALE },
        { id: 3, username: "bob_wilson", name: "Bob Wilson", age: 30, gender: Gender.MALE },
        { id: 4, username: "alice_brown", name: "Alice Brown", age: 28, gender: Gender.FEMALE },
        { id: 5, username: "charlie_green", name: "Charlie Green", age: 26, gender: Gender.MALE },
        { id: 6, username: "emma_white", name: "Emma White", age: 24, gender: Gender.FEMALE },
    ]

    const mockAllRelationships: UserRelationship[] = [
        {
            id: 1,
            userId: 1,
            partnerId: 2,
            relationshipType: RelationshipType.GIRLFRIEND,
            partner: { id: 2, username: "jane_smith", name: "Jane Smith", age: 23, gender: Gender.FEMALE },
        },
        {
            id: 2,
            userId: 3,
            partnerId: 4,
            relationshipType: RelationshipType.WIFE,
            partner: { id: 4, username: "alice_brown", name: "Alice Brown", age: 28, gender: Gender.FEMALE },
        },
        {
            id: 3,
            userId: 5,
            partnerId: 6,
            relationshipType: RelationshipType.GIRLFRIEND,
            partner: { id: 6, username: "emma_white", name: "Emma White", age: 24, gender: Gender.FEMALE },
        },
    ]

    const relationshipTypes: RelationshipTypeOption[] = [
        { value: RelationshipType.GIRLFRIEND, label: "Girlfriend", emoji: "💕" },
        { value: RelationshipType.BOYFRIEND, label: "Boyfriend", emoji: "💙" },
        { value: RelationshipType.WIFE, label: "Wife", emoji: "👰" },
        { value: RelationshipType.HUSBAND, label: "Husband", emoji: "🤵" },
        { value: RelationshipType.DHARMA_SISTER, label: "Dharma Sister", emoji: "🙏" },
        { value: RelationshipType.DHARMA_BROTHER, label: "Dharma Brother", emoji: "🕉️" },
    ]

    // Initialize app
    useEffect(() => {
        // Mock current user
        const mockCurrentUser = { id: 7, username: "current_user", name: "You", age: 27, gender: Gender.MALE }
        setCurrentUser(mockCurrentUser)
        setUsers(mockUsers)
        setAllRelationships(mockAllRelationships)
        setRelationships(mockAllRelationships.filter(r => r.userId === mockCurrentUser.id))
    }, [])

    const handleAddRelationship = (): void => {
        if (!relationshipForm.partnerId || !currentUser) {
            alert("Please select a partner")
            return
        }

        const partnerId = Number.parseInt(relationshipForm.partnerId)
        const partner = users.find((u) => u.id === partnerId)
        if (!partner) {
            alert("Selected partner not found")
            return
        }

        const newRelationship: UserRelationship = {
            id: Date.now(),
            userId: currentUser.id,
            partnerId: partnerId,
            relationshipType: relationshipForm.relationshipType,
            partner: partner,
        }

        setRelationships([...relationships, newRelationship])
        setAllRelationships([...allRelationships, newRelationship])
        setRelationshipForm({
            partnerId: "",
            relationshipType: RelationshipType.GIRLFRIEND,
        })
        setShowAddForm(false)
    }

    const deleteRelationship = (id: number): void => {
        setRelationships(relationships.filter((r) => r.id !== id))
        setAllRelationships(allRelationships.filter((r) => r.id !== id))
    }

    const getRelationshipTypeData = (type: RelationshipType): RelationshipTypeOption => {
        return relationshipTypes.find((t) => t.value === type) || { value: type, label: type, emoji: "💝" }
    }

    const getRandomUser = (excludeId: number) => {
        const availableUsers = mockUsers.filter(u => u.id !== excludeId)
        return availableUsers[Math.floor(Math.random() * availableUsers.length)]
    }

    // Navigation items
    const navItems = [
        { id: "home", icon: Home, label: "Home" },
        { id: "friends", icon: Users, label: "Friends" },
        { id: "notifications", icon: Bell, label: "Notifications" },
        { id: "profile", icon: User, label: "Profile" },
    ]

    // Home Feed Component
    const HomeFeed: React.FC = () => (
        <div className="max-w-2xl mx-auto">
            {/* Post Creator */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {currentUser?.name.charAt(0)}
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-left text-gray-600 transition-colors"
                    >
                        Share your love story...
                    </button>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex-1 justify-center"
                    >
                        <Heart className="h-5 w-5 text-rose-500" />
                        <span className="font-medium">Add Relationship</span>
                    </button>
                </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-3">
                {allRelationships.map((relationship) => {
                    const relationshipData = getRelationshipTypeData(relationship.relationshipType)
                    const poster = relationship.userId === currentUser?.id ? currentUser : getRandomUser(relationship.partnerId)

                    return (
                        <div key={relationship.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Post Header */}
                            <div className="p-4 pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-11 h-11 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                            {poster.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{poster.name}</h3>
                                            <p className="text-sm text-gray-500">2h</p>
                                        </div>
                                    </div>
                                    {relationship.userId === currentUser?.id && (
                                        <button
                                            onClick={() => deleteRelationship(relationship.id)}
                                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="px-4 pb-4">
                                <p className="text-gray-800 mb-4 leading-relaxed">
                                    {relationship.userId === currentUser?.id ? "I'm " : `${poster.name} is `}
                                    now in a relationship with <span className="font-medium text-gray-900">{relationship.partner.name}</span> {relationshipData.emoji}
                                </p>

                                {/* Modern Relationship Card */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        {/* Left Person */}
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                                                {poster.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{poster.name}</p>
                                                <p className="text-sm text-gray-500">{poster.age}</p>
                                            </div>
                                        </div>

                                        {/* Relationship Status */}
                                        <div className="flex flex-col items-center space-y-1">
                                            <span className="text-2xl">{relationshipData.emoji}</span>
                                            <span className="text-xs text-gray-500 font-medium">{relationshipData.label}</span>
                                        </div>

                                        {/* Right Person */}
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="font-medium text-gray-900 text-right">{relationship.partner.name}</p>
                                                <p className="text-sm text-gray-500 text-right">{relationship.partner.age}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white font-medium">
                                                {relationship.partner.name.charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Post Actions */}
                            <div className="border-t border-gray-100 px-4 py-3">
                                <div className="flex items-center justify-around">
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50">
                                        <ThumbsUp className="h-5 w-5" />
                                        <span className="text-sm font-medium">Like</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50">
                                        <MessageCircle className="h-5 w-5" />
                                        <span className="text-sm font-medium">Comment</span>
                                    </button>
                                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors py-2 px-3 rounded-lg hover:bg-green-50">
                                        <Share className="h-5 w-5" />
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

    // Friends Component
    const FriendsPage: React.FC = () => (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Connections</h2>
                {relationships.length === 0 ? (
                    <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No connections yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {relationships.map((relationship) => {
                            const relationshipData = getRelationshipTypeData(relationship.relationshipType)
                            return (
                                <div key={relationship.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {relationship.partner.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{relationship.partner.name}</h3>
                                            <p className="text-sm text-gray-600">{relationshipData.emoji} {relationshipData.label}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Discover People</h2>
                <div className="grid grid-cols-2 gap-3">
                    {users.filter(u => !relationships.some(r => r.partnerId === u.id)).map((user) => (
                        <div key={user.id} className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                                {user.name.charAt(0)}
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">{user.name}</h3>
                            <p className="text-xs text-gray-600">{user.age} years old</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    // Notifications Component
    const NotificationsPage: React.FC = () => (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <Heart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-900">Someone liked your relationship post</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <UserPlus className="h-5 w-5 text-white" />
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

    // Profile Component
    const ProfilePage: React.FC = () => (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        {currentUser?.name.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentUser?.name}</h2>
                    <p className="text-gray-600">@{currentUser?.username}</p>
                    <p className="text-gray-600">{currentUser?.age} years old</p>
                </div>

                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Relationship Status</h3>
                    <p className="text-gray-700">
                        {relationships.length === 0 ? "Single" : `${relationships.length} Active ${relationships.length === 1 ? 'Relationship' : 'Relationships'}`}
                    </p>
                </div>

                <button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-700 transition-all">
                    Edit Profile
                </button>
            </div>
        </div>
    )

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <HomeFeed />
            case "friends":
                return <FriendsPage />
            case "notifications":
                return <NotificationsPage />
            case "profile":
                return <ProfilePage />
            default:
                return <HomeFeed />
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                                <Heart className="h-5 w-5 text-white" fill="currentColor" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                LoveConnect
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {currentUser?.name.charAt(0)}
                            </div>
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
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                                    isActive
                                        ? "text-rose-600 bg-rose-50"
                                        : "text-gray-600 hover:text-rose-600 hover:bg-rose-50"
                                }`}
                            >
                                <Icon className="h-6 w-6" />
                                <span className="text-xs font-medium">{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            </nav>

            {/* Add Relationship Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8 text-white" fill="currentColor" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Add New Relationship</h2>
                            <p className="text-gray-600 mt-2">Share your love story with everyone</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Choose Your Partner
                                </label>
                                <select
                                    value={relationshipForm.partnerId}
                                    onChange={(e) => setRelationshipForm(prev => ({ ...prev, partnerId: e.target.value }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                    required
                                >
                                    <option value="">Select someone special...</option>
                                    {users.filter(u => !relationships.some(r => r.partnerId === u.id)).map((user) => (
                                        <option key={user.id} value={user.id.toString()}>
                                            {user.name} (@{user.username})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship Type</label>
                                <select
                                    value={relationshipForm.relationshipType}
                                    onChange={(e) => setRelationshipForm(prev => ({ ...prev, relationshipType: e.target.value as RelationshipType }))}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                                >
                                    {relationshipTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.emoji} {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddRelationship}
                                    className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg"
                                >
                                    💕 Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SocialLoveApp
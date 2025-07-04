"use client"
import type React from "react"
import {useEffect, useState} from "react"
import {Heart, Plus, Star, Trash2, UserPlus} from "lucide-react"
import {getCurrentUserFromLocalStorage} from "@/utils/auth";
import {useRouter} from "next/navigation";

// TypeScript interfaces based on your API structure
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

interface UserRequest {
    username: string
    password: string
    name: string
    age: number
    gender: Gender
    type?: string
}

interface AuthFormData {
    username: string
    password: string
    confirmPassword: string
    name: string
    age: string
    gender: Gender
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

// Enums from your Prisma schema
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

const ModernLoveApp: React.FC = () => {
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [showAddForm, setShowAddForm] = useState<boolean>(false)
    const [users, setUsers] = useState<User[]>([])
    const [relationships, setRelationships] = useState<UserRelationship[]>([])

    const [relationshipForm, setRelationshipForm] = useState<RelationshipFormData>({
        partnerId: "",
        relationshipType: RelationshipType.GIRLFRIEND,
    })

    // Mock data - in real app, this would come from your API
    const mockUsers: User[] = [
        { id: 1, username: "john_doe", name: "John Doe", age: 25, gender: Gender.MALE },
        { id: 2, username: "jane_smith", name: "Jane Smith", age: 23, gender: Gender.FEMALE },
        { id: 3, username: "bob_wilson", name: "Bob Wilson", age: 30, gender: Gender.MALE },
        { id: 4, username: "alice_brown", name: "Alice Brown", age: 28, gender: Gender.FEMALE },
    ]

    const relationshipTypes: RelationshipTypeOption[] = [
        { value: RelationshipType.GIRLFRIEND, label: "Girlfriend", emoji: "💕" },
        { value: RelationshipType.BOYFRIEND, label: "Boyfriend", emoji: "💙" },
        { value: RelationshipType.WIFE, label: "Wife", emoji: "👰" },
        { value: RelationshipType.HUSBAND, label: "Husband", emoji: "🤵" },
        { value: RelationshipType.DHARMA_SISTER, label: "Dharma Sister", emoji: "🙏" },
        { value: RelationshipType.DHARMA_BROTHER, label: "Dharma Brother", emoji: "🕉️" },
    ]

    // Check for existing user on load
    useEffect(() => {
        const userData = getCurrentUserFromLocalStorage<User>();

        if (!userData) {
            router.push("/login");
            return;
        }

        try {
            setCurrentUser(userData);
            setUsers(mockUsers.filter((u) => u.id !== userData.id));
            setRelationships([
                {
                    id: 1,
                    userId: userData.id,
                    partnerId: 2,
                    relationshipType: RelationshipType.GIRLFRIEND,
                    partner: mockUsers.find((u) => u.id === 2)!,
                },
            ]);
        } catch (error) {
            console.error("Error reading user data:", error);
            localStorage.removeItem("currentUser");
            router.push("/login");
        }
    }, [router]);



    const handleAddRelationship = (): void => {
        if (!relationshipForm.partnerId) {
            alert("Please select a partner")
            return
        }

        const partnerId = Number.parseInt(relationshipForm.partnerId)
        if (isNaN(partnerId)) {
            alert("Invalid partner selection")
            return
        }

        const partner = users.find((u) => u.id === partnerId)
        if (!partner) {
            alert("Selected partner not found")
            return
        }

        const newRelationship: UserRelationship = {
            id: Date.now(),
            userId: currentUser!.id,
            partnerId: partnerId,
            relationshipType: relationshipForm.relationshipType,
            partner: partner,
        }

        setRelationships([...relationships, newRelationship])
        setRelationshipForm({
            partnerId: "",
            relationshipType: RelationshipType.GIRLFRIEND,
        })
        setShowAddForm(false)
    }

    const handleLogout = (): void => {
        localStorage.removeItem("currentUser")
        setCurrentUser(null)
        setUsers([])
        setRelationships([])
        router.push("/login")
    }

    const deleteRelationship = (id: number): void => {
        setRelationships(relationships.filter((r) => r.id !== id))
    }

    const handleRelationshipFormChange = (field: keyof RelationshipFormData, value: string): void => {
        setRelationshipForm((prev) => ({ ...prev, [field]: value }))
    }

    const getRelationshipTypeData = (type: RelationshipType): RelationshipTypeOption => {
        const relationshipType = relationshipTypes.find((t) => t.value === type)
        return relationshipType || { value: type, label: type, emoji: "💝" }
    }

    // Home Page Component
    const HomePage: React.FC = () => (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-16">
                        <div className="flex items-center">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                                <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-white" fill="currentColor" />
                            </div>
                            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                LoveConnect
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                                    {currentUser?.name.charAt(0)}
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-gray-700 hidden xs:block">
                  {currentUser?.name}
                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-xs sm:text-sm text-gray-500 hover:text-rose-600 transition-colors px-2 sm:px-3 py-1 rounded-lg hover:bg-rose-50"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
                {/* Hero Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-4">
                        Your Love Dashboard
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-lg mb-6 sm:mb-8 px-4">
                        Manage your relationships and connect with your loved ones
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg hover:from-rose-600 hover:to-pink-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center mx-auto group"
                    >
                        <Plus className="mr-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-200" />
                        <span className="hidden xs:inline">Add New Love Connection</span>
                        <span className="xs:hidden">Add Connection</span>
                    </button>
                </div>

                {/* Current Relationships */}
                <div className="mb-8 sm:mb-12">
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                            <Heart className="mr-2 sm:mr-3 h-5 w-5 sm:h-7 sm:w-7 text-rose-500" fill="currentColor" />
                            <span className="hidden xs:inline">Your Love Connections</span>
                            <span className="xs:hidden">Connections</span>
                        </h3>
                        <div className="text-xs sm:text-sm text-gray-500 bg-white/60 px-2 sm:px-3 py-1 rounded-full">
                            {relationships.length} {relationships.length === 1 ? "Connection" : "Connections"}
                        </div>
                    </div>

                    {relationships.length === 0 ? (
                        <div className="text-center py-12 sm:py-16">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-rose-400" />
                            </div>
                            <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No love connections yet</h4>
                            <p className="text-gray-500 text-sm sm:text-lg px-4">Start building meaningful relationships today!</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {relationships.map((relationship) => {
                                const relationshipData = getRelationshipTypeData(relationship.relationshipType)
                                return (
                                    <div
                                        key={relationship.id}
                                        className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-white/20 group active:scale-95 sm:hover:scale-105"
                                    >
                                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                                            <div className="flex items-center">
                                                <div className="relative">
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                                                        {relationship.partner.name.charAt(0)}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="ml-3 sm:ml-4">
                                                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">{relationship.partner.name}</h4>
                                                    <p className="text-xs sm:text-sm text-gray-600">{relationship.partner.age} years old</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteRelationship(relationship.id)}
                                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                        </div>

                                        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-rose-100">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-600 mb-1 font-medium">Relationship</p>
                                                    <p className="font-semibold text-rose-600 flex items-center text-sm sm:text-base">
                                                        <span className="mr-2 text-base sm:text-lg">{relationshipData.emoji}</span>
                                                        {relationshipData.label}
                                                    </p>
                                                </div>
                                                <div className="text-xl sm:text-2xl">
                                                    {relationship.partner.gender === Gender.FEMALE ? "👩" : "👨"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Available Users */}
                <div>
                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                            <UserPlus className="mr-2 sm:mr-3 h-5 w-5 sm:h-7 sm:w-7 text-purple-500" />
                            <span className="hidden xs:inline">Discover Love</span>
                            <span className="xs:hidden">Discover</span>
                        </h3>
                        <div className="text-xs sm:text-sm text-gray-500 bg-white/60 px-2 sm:px-3 py-1 rounded-full">
                            {users.length} Available
                        </div>
                    </div>

                    <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-white/20 group active:scale-95 sm:hover:scale-105"
                            >
                                <div className="text-center">
                                    <div className="relative inline-block mb-3 sm:mb-4">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" fill="currentColor" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-lg">{user.name}</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{user.age} years old</p>
                                    <p className="text-xs text-gray-500 mb-3 sm:mb-4">@{user.username}</p>
                                    <div className="flex justify-center">
                    <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                            user.gender === Gender.MALE ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                        }`}
                    >
                      <span className="hidden xs:inline">{user.gender === Gender.MALE ? "👨 Male" : "👩 Female"}</span>
                      <span className="xs:hidden">{user.gender === Gender.MALE ? "👨" : "👩"}</span>
                    </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Add Relationship Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-white/20 max-h-[90vh] overflow-y-auto">
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="currentColor" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                Create Love Connection
                            </h2>
                            <p className="text-gray-600 mt-2 text-sm sm:text-base">Choose someone special to connect with</p>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                                    Select Your Special Someone
                                </label>
                                <select
                                    value={relationshipForm.partnerId}
                                    onChange={(e) => handleRelationshipFormChange("partnerId", e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                                    required
                                >
                                    <option value="">Choose your partner...</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id.toString()}>
                                            {user.name} (@{user.username}) - {user.age} years old
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Relationship Type</label>
                                <select
                                    value={relationshipForm.relationshipType}
                                    onChange={(e) => handleRelationshipFormChange("relationshipType", e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                                >
                                    {relationshipTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.emoji} {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2 sm:pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="w-full sm:flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 active:scale-95 transition-all duration-200 text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddRelationship}
                                    className="w-full sm:flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 active:scale-95 transition-all duration-200 shadow-lg text-base"
                                >
                                    💕 Connect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    // Main App Render
    return <HomePage />
}

export default ModernLoveApp
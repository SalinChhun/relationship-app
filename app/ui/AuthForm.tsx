"use client";

import React, {useState} from "react";
import {Eye, EyeOff, Heart, Sparkles} from "lucide-react";
import { useRouter } from "next/navigation";
import {setCurrentUserToLocalStorage} from "@/utils/auth";


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

interface AuthFormData {
    username: string
    password: string
    confirmPassword: string
    name: string
    age: string
    gender: Gender
}

// Enums from your Prisma schema
enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export const AuthForm: React.FC = () => {

    const router = useRouter();


    const [isLogin, setIsLogin] = useState<boolean>(true)
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

    // Form states
    const [authForm, setAuthForm] = useState<AuthFormData>({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        age: "",
        gender: Gender.MALE,
    })

    const handleAuthSubmit = (): void => {
        if (!authForm.username || !authForm.password) {
            alert("Please fill in all required fields")
            return
        }

        if (!isLogin) {
            // Register validation
            if (authForm.password !== authForm.confirmPassword) {
                alert("Passwords do not match")
                return
            }
            if (!authForm.name || !authForm.age) {
                alert("Please fill all required fields")
                return
            }
            const ageNum = Number.parseInt(authForm.age)
            if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
                alert("Please enter a valid age between 18 and 100")
                return
            }
        }

        // Mock authentication - in real app, call your API
        const user: User = {
            id: Date.now(),
            username: authForm.username,
            name: authForm.name || authForm.username,
            age: Number.parseInt(authForm.age) || 25,
            gender: authForm.gender,
        }

        // Store user in localStorage (cookie simulation)
        setCurrentUserToLocalStorage(user)


        // ✅ Redirect to home page
        router.push("/home");


        // Reset form
        setAuthForm({
            username: "",
            password: "",
            confirmPassword: "",
            name: "",
            age: "",
            gender: Gender.MALE,
        })
    }

    const handleAuthFormChange = (field: keyof AuthFormData, value: string): void => {
        setAuthForm((prev) => ({ ...prev, [field]: value }))
    }

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
            {/* Floating Hearts Animation - Hidden on mobile for performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
                <div className="absolute top-1/4 left-1/4 text-rose-300 opacity-20 animate-bounce">
                    <Heart size={24}/>
                </div>
                <div className="absolute top-1/3 right-1/4 text-pink-300 opacity-30 animate-pulse">
                    <Sparkles size={20}/>
                </div>
                <div className="absolute bottom-1/4 left-1/3 text-purple-300 opacity-25 animate-bounce delay-1000">
                    <Heart size={18}/>
                </div>
            </div>

            <div
                className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-white/20">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="relative inline-block mb-4">
                        <div
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            <Heart className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="currentColor"/>
                        </div>
                        <div
                            className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white"/>
                        </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        {isLogin ? "Welcome Back, Lover" : "Find Your Soulmate"}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        {isLogin ? "Continue your love journey" : "Begin your love story today"}
                    </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            required
                            value={authForm.username}
                            onChange={(e) => handleAuthFormChange("username", e.target.value)}
                            className="w-full px-4 py-3 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={authForm.password}
                                onChange={(e) => handleAuthFormChange("password", e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent pr-12 transition-all duration-200 bg-white/50 text-base"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-400 hover:text-rose-500 transition-colors p-1"
                            >
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                            </button>
                        </div>
                    </div>

                    {!isLogin && (
                        <>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm
                                    Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={authForm.confirmPassword}
                                        onChange={(e) => handleAuthFormChange("confirmPassword", e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent pr-12 transition-all duration-200 bg-white/50 text-base"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-rose-500 transition-colors p-1"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={authForm.name}
                                    onChange={(e) => handleAuthFormChange("name", e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                                <input
                                    type="number"
                                    required
                                    min="18"
                                    max="100"
                                    value={authForm.age}
                                    onChange={(e) => handleAuthFormChange("age", e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                                    placeholder="Enter your age"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                                <select
                                    value={authForm.gender}
                                    onChange={(e) => handleAuthFormChange("gender", e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                                >
                                    <option value={Gender.MALE}>Male</option>
                                    <option value={Gender.FEMALE}>Female</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button
                        type="button"
                        onClick={handleAuthSubmit}
                        className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
                    >
                        {isLogin ? "💕 Sign In to Love" : "💖 Start Love Journey"}
                    </button>
                </div>

                <div className="mt-6 sm:mt-8 text-center">
                    <p className="text-sm sm:text-base text-gray-600">
                        {isLogin ? "New to love?" : "Already found love?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-rose-500 hover:text-rose-600 font-semibold transition-colors"
                        >
                            {isLogin ? "Join Now" : "Sign In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    )
}
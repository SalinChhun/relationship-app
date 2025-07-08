"use client";

import React, {useState} from "react";
import {Eye, EyeOff, Heart, Sparkles} from "lucide-react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod';
import {SignupFormSchema, SignupFormValues} from "@/app/validators/signup.schema";
import useAuthMutation from "@/lib/hooks/auth-mutation";

// Enums from your Prisma schema
enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

export const RegisterForm: React.FC = () => {

    const router = useRouter();
    const userMutation = useAuthMutation.useRegisterUser();

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<SignupFormValues>({
        resolver: zodResolver(SignupFormSchema),
        defaultValues: {
            username: '',
            password: '',
            name: '',
        },
    });

    const [showPassword, setShowPassword] = useState<boolean>(false)

    const onSubmit = async (data: SignupFormValues) => {
        console.log("Form submitted with data:", data);
        try {
            userMutation.mutation(data);
        } catch (error) {
            console.error("Registration failed:", error);
        }

    };

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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            Find Your Soulmate
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Begin your love story today
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                {...register("username")}
                                className="w-full px-4 py-3 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                                placeholder="Enter your username"
                            />
                            {errors?.username && (
                                <label className="block text-sm text-red-500 mb-2">{errors?.username?.message}</label>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", {required: true})}
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
                            {errors?.password && (
                                <label className="block text-sm text-red-500 mb-2">{errors?.password?.message}</label>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                {...register("name")}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                                placeholder="Enter your full name"
                            />
                            {errors?.name && (
                                <label className="block text-sm text-red-500 mb-2">{errors?.name?.message}</label>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
                            <input
                                type="number"
                                {...register("age", {valueAsNumber: true})}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                                placeholder="Enter your age"
                            />
                            {errors?.age && (
                                <label className="block text-sm text-red-500 mb-2">{errors?.age?.message}</label>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                            <select
                                {...register('gender')}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white/50 text-base"
                            >
                                <option value={Gender.MALE}>Male</option>
                                <option value={Gender.FEMALE}>Female</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="flex items-center justify-center w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl text-base"
                        >
                            {
                                userMutation.isLoading ?
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    : "💖 Start Love Journey"
                            }
                        </button>
                    </div>

                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-sm sm:text-base text-gray-600">
                            Already found love
                            <button
                                onClick={() => router.push("login")}
                                className="ml-2 text-rose-500 hover:text-rose-600 font-semibold transition-colors"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </form>

        </div>
    )
}
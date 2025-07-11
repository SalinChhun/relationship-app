"use client"
import React, {useEffect, useState} from "react"
import {ProfilePage} from "@/app/ui/ProfilePage"
import {NotificationsPage} from "@/app/ui/NotificationsPage"
import {FriendsPage} from "@/app/ui/FriendsPage"
import {getCurrentUserFromLocalStorage} from "@/utils/auth"
import {Header} from "@/app/components/Header"
import type {UserType} from "@/app/types/user"
import {NavigationBottom} from "@/app/components/NavigationBottom"
import {HomeFeed} from "@/app/ui/HomeFeed";

const SocialLoveApp: React.FC = () => {

    const [currentUser, setCurrentUser] = useState<UserType | null>(null)
    const [activeTab, setActiveTab] = useState("home")


    // TODO: Check if user is logged in
    useEffect(() => {
        setCurrentUser(getCurrentUserFromLocalStorage())
    }, [])

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <HomeFeed currentUser={currentUser}/>
            case "friends":
                return <FriendsPage/>
            case "notifications":
                return <NotificationsPage/>
            case "profile":
                return (
                    <ProfilePage
                        currentUser={currentUser}
                    />
                )
            default:
                return <HomeFeed currentUser={currentUser}/>
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                setActiveTab={() => setActiveTab("profile")}
                currentUser={currentUser}
            />
            <main className="pb-20 px-4 py-4">{renderContent()}</main>
            <NavigationBottom
                currentUser={currentUser}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
        </div>
    )
}

export default SocialLoveApp

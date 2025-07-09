"use client"
import React from "react"
import {useCallback, useEffect, useRef, useState} from "react"
import {Heart, MessageCircle, Share, ThumbsUp, Trash2} from "lucide-react"
import {ProfilePage} from "@/app/ui/ProfilePage"
import {NotificationsPage} from "@/app/ui/NotificationsPage"
import {FriendsPage} from "@/app/ui/FriendsPage"
import {getCurrentUserFromLocalStorage} from "@/utils/auth"
import type {RelationshipType} from "@prisma/client"
import {relationshipTypes} from "@/utils/utils"
import {Header} from "@/app/components/Header"
import type {UserType} from "@/app/types/user"
import {NavigationBottom} from "@/app/components/NavigationBottom"
import {ImageModal} from "@/app/components/ImageModal"
import {CreatePost} from "@/app/ui/CreatePost"
import useFeedMutation from "@/lib/hooks/feeds-mutation"

interface FeedItem {
    id: string
    type: "post" | "relationship"
    createdAt: string
    data: any
}

const SocialLoveApp: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<UserType | null>(null)
    const [activeTab, setActiveTab] = useState("home")
    const [isOpenCreateRelationShip, setIsOpenCreateRelationShip] = useState(false)
    const [isOpenCreatePost, setIsOpenCreatePost] = useState(false)
    const [feeds, setFeeds] = useState<FeedItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // const { feeds: response, isLoading: isFeedLoading } = useFeedMutation.useFetchFeeds(currentPage, 3)
    const feedsQuery = useFeedMutation.useFetchFeeds(5)

    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!bottomRef.current || feedsQuery.isFetchingNextPage || !feedsQuery.hasNextPage) return;

        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                feedsQuery.fetchNextPage();
            }
        });

        observer.observe(bottomRef.current);

        return () => {
            if (bottomRef.current) {
                observer.unobserve(bottomRef.current);
            }
        };
    }, [feedsQuery.isFetchingNextPage, feedsQuery.hasNextPage]);


    useEffect(() => {
        setCurrentUser(getCurrentUserFromLocalStorage())
    }, [])

    const getRelationshipTypeData = (type: RelationshipType): any => {
        return relationshipTypes.find((t) => t.label === type) || {value: type, label: type, emoji: "💝"}
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return "Just now"
        if (diffInHours < 24) return `${diffInHours}h`
        const diffInDays = Math.floor(diffInHours / 24)
        if (diffInDays < 7) return `${diffInDays}d`
        return date.toLocaleDateString()
    }

    // if (isInitialLoading) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
    //         </div>
    //     )
    // }

    const PostItem: React.FC<{ post: any; createdAt: string }> =  React.memo(({post, createdAt}) => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-11 h-11 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {post?.user?.name?.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900">{post?.user?.name}</h3>
                            <p className="text-sm text-gray-500">{formatTimeAgo(createdAt)}</p>
                        </div>
                    </div>
                    {post.user?.id === currentUser?.id && (
                        <button
                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                            <Trash2 size={16}/>
                        </button>
                    )}
                </div>
            </div>
            <div className="px-4 pb-4">
                <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                {post.images && post.images.length > 0 && (
                    <div
                        className={`grid gap-2 mb-4 ${post.images.length === 1 ? "grid-cols-1" : post.images.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
                        {post.images.slice(0, 4).map((image: any, index: number) => (
                            <div
                                key={image.id}
                                className="relative group cursor-pointer overflow-hidden rounded-xl"
                                onClick={() => {
                                    setIsImageModalOpen(true)
                                    setCurrentImageIndex(index)
                                }}
                            >
                                <img
                                    src={image.imageUrl || "/placeholder.svg?height=200&width=300"}
                                    alt={image.caption || "Post image"}
                                    className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {index === 3 && post.images.length > 4 && (
                                    <div
                                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                                        <span className="text-white font-semibold text-lg">
                                          +{post.images.length - 4}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {isImageModalOpen && (
                    <ImageModal
                        images={post.images.map((img: any) => img.imageUrl)}
                        initialIndex={currentImageIndex}
                        onClose={() => setIsImageModalOpen(false)}
                    />
                )}
            </div>
            <div className="border-t border-gray-100 px-4 py-3">
                <div className="flex items-center justify-around">
                    <button
                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors py-2 px-3 rounded-lg hover:bg-rose-50">
                        <ThumbsUp className="h-5 w-5"/>
                        <span className="text-sm font-medium">Like</span>
                        {post.reactionsCount > 0 && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{post.reactionsCount}</span>
                        )}
                    </button>
                    <button
                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors py-2 px-3 rounded-lg hover:bg-blue-50">
                        <MessageCircle className="h-5 w-5"/>
                        <span className="text-sm font-medium">Comment</span>
                        {post.commentsCount > 0 && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{post.commentsCount}</span>
                        )}
                    </button>
                    <button
                        className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors py-2 px-3 rounded-lg hover:bg-green-50">
                        <Share className="h-5 w-5"/>
                        <span className="text-sm font-medium">Share</span>
                    </button>
                </div>
            </div>
        </div>
    ))

    const RelationshipItem: React.FC<{ relationship: any; createdAt: string }> =  React.memo(({relationship, createdAt}) => {
        const relationshipData = getRelationshipTypeData(relationship.relationshipType)
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-11 h-11 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                {relationship?.user?.name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{relationship?.user?.name}</h3>
                                <p className="text-sm text-gray-500">{formatTimeAgo(createdAt)}</p>
                            </div>
                        </div>
                        {relationship.user?.id === currentUser?.id && (
                            <button
                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors">
                                <Trash2 size={16}/>
                            </button>
                        )}
                    </div>
                </div>
                <div className="px-4 pb-4">
                    <p className="text-gray-800 mb-4 leading-relaxed">
                        {relationship?.partner?.name ? (
                            <>
                                {relationship?.user?.name} is now in a relationship with{" "}
                                <span className="font-medium text-gray-900">{relationship?.partner?.name}</span>
                            </>
                        ) : (
                            <>
                                {relationship?.user?.name} is now {relationshipData.label}
                            </>
                        )}
                    </p>
                    <div className="bg-gradient-to-r from-gray-50 to-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div
                            className={`flex items-center gap-4 overflow-hidden ${relationship?.partner?.name ? "justify-between" : "justify-center"}`}>
                            {relationship?.partner?.name && (
                                <div className="flex items-center space-x-3 min-w-0">
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 text-sm truncate">{relationship?.user?.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{relationship?.user?.age}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col items-center space-y-1 shrink-0 w-20 text-center">
                                <span className="text-2xl">{relationshipData.emoji}</span>
                                <span
                                    className="text-xs text-gray-500 font-medium truncate">{relationshipData.label}</span>
                            </div>
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
    })

    const HomeFeed: React.FC = React.memo(() => (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {currentUser?.name.charAt(0)}
                    </div>
                    <button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-left text-gray-600 transition-colors">
                        Share your love story...
                    </button>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <button
                        className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex-1 justify-center">
                        <Heart className="h-5 w-5 text-rose-500"/>
                        <span className="font-medium">Add Relationship</span>
                    </button>
                </div>
            </div>
            <div className="space-y-3">
                {feedsQuery.items.map((feedItem) => (
                    <div key={`${feedItem.value.type}-${feedItem.value.id}`}>
                        {feedItem.value.type === "post" ? (
                            <PostItem post={feedItem.value.data} createdAt={feedItem.value.createdAt}/>
                        ) : (
                            <RelationshipItem relationship={feedItem.value.data} createdAt={feedItem.value.createdAt}/>
                        )}
                    </div>
                ))}

                {feedsQuery.isFetchingNextPage && (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}

                <div ref={bottomRef}></div>

                {!feedsQuery.hasNextPage && feedsQuery.items.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                        <p>You've reached the end of your feed</p>
                    </div>
                )}

                {feedsQuery.items.length === 0 && !feedsQuery.isLoading && (
                    <div className="text-center py-8">
                        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4"/>
                        <p className="text-gray-500">No posts yet. Start sharing your love story!</p>
                    </div>
                )}
            </div>

        </div>
    ))

    const renderContent = () => {
        switch (activeTab) {
            case "home":
                return <HomeFeed/>
            case "friends":
                return <FriendsPage/>
            case "notifications":
                return <NotificationsPage/>
            case "profile":
                return (
                    <ProfilePage
                        isOpenCreateRelationship={isOpenCreateRelationShip}
                        setIsOpenCreateRelationShip={() => setIsOpenCreateRelationShip(true)}
                        onCloseCreateRelationShip={() => setIsOpenCreateRelationShip(false)}
                        currentUser={currentUser}
                    />
                )
            default:
                return <HomeFeed/>
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header setActiveTab={() => setActiveTab("profile")} currentUser={currentUser}/>
            <main className="pb-20 px-4 py-4">{renderContent()}</main>
            <NavigationBottom activeTab={activeTab} setActiveTab={setActiveTab}
                              setIsOpenCreatePost={() => setIsOpenCreatePost(true)}/>
            <CreatePost isOpen={isOpenCreatePost} onClose={() => setIsOpenCreatePost(false)} currentUser={currentUser}/>
        </div>
    )
}

export default SocialLoveApp

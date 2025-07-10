import React, {useState} from "react";
import {formatTimeAgo} from "@/utils/utils";
import {MessageCircle, Share, ThumbsUp, Trash2} from "lucide-react";
import {ImageModal} from "@/app/components/ImageModal";

export const PostItem: React.FC<{
    currentUser: any
    post: any
    createdAt: any
}> = ({ currentUser, post, createdAt }) => {

    const [isImageModalOpen, setIsImageModalOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [currentPost, setCurrentPost] = useState<any>(null)

    return (
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
            <div className="px-4 pb-1">
                <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                {post.images && post.images.length > 0 && (
                    <div
                        className={`grid gap-2 mb-4 ${post.images.length === 1 ? "grid-cols-1" : post.images.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
                        {post.images.slice(0, 4).map((image: any, index: number) => (
                            <div
                                key={image.id}
                                className="relative group cursor-pointer overflow-hidden rounded-xl"
                                onClick={() => {
                                    setCurrentPost(post)
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
                        images={currentPost?.images?.map((img: any) => img.imageUrl)}
                        initialIndex={currentImageIndex}
                        onClose={() => {
                            setIsImageModalOpen(false)
                            setCurrentPost(null)
                        }}
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
    )

}
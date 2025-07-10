import {formatTimeAgo, relationshipTypes} from "@/utils/utils";
import {MessageCircle, Share, ThumbsUp, Trash2} from "lucide-react";
import React from "react";
import type {RelationshipType} from "@prisma/client";

export const RelationshipItem: React.FC<{
    currentUser: any
    relationship: any
    createdAt: any
}> = ({ currentUser, relationship, createdAt }) => {


    const getRelationshipTypeData = (type: RelationshipType): any => {
        return relationshipTypes.find((t) => t.label === type) || {value: type, label: type, emoji: "💝"}
    }

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
}
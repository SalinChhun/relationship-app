import React, {useEffect, useRef, useState} from "react";
import {Heart} from "lucide-react";
import {PostItem} from "@/app/ui/PostItem";
import {RelationshipItem} from "@/app/ui/RelationshipItem";
import useFeedMutation from "@/lib/hooks/feeds-mutation";
import {CreateRelationship} from "@/app/ui/CreateRelationship";

export const HomeFeed: React.FC<{
    currentUser: any
}> = ({ currentUser }) => {

    const [isOpenCreateRelationship, setIsOpenCreateRelationship] = useState(false)

    const feedsQuery = useFeedMutation.useFetchFeeds(5)

    // TODO: Implement infinite scroll for feeds
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

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex items-center space-x-3 mb-3">
                    <div
                        className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {currentUser?.name.charAt(0)}
                    </div>
                    <button
                        onClick={() => setIsOpenCreateRelationship(true)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-left text-gray-600 transition-colors">
                        Share your love story...
                    </button>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <button
                        onClick={() => setIsOpenCreateRelationship(true)}
                        className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors flex-1 justify-center">
                        <Heart className="h-5 w-5 text-rose-500"/>
                        <span className="font-medium">Add Relationship</span>
                    </button>
                </div>
            </div>
            {
                feedsQuery.isLoading && feedsQuery.items.length === 0 && (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    </div>
                )
            }
            <div className="space-y-3">
                {feedsQuery.items.map((feedItem: any) => (
                    <div key={`${feedItem.value.type}-${feedItem.value.id}`}>
                        {feedItem.value.type === "post" ? (
                            <PostItem currentUser={currentUser} post={feedItem.value.data} createdAt={feedItem.value.createdAt}/>
                        ) : (
                            <RelationshipItem currentUser={currentUser} relationship={feedItem.value.data} createdAt={feedItem.value.createdAt}/>
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

            {/* Add Relationship Modal */}
            <CreateRelationship
                isOpen={isOpenCreateRelationship}
                onClose={() => setIsOpenCreateRelationship(false)}
                currentUser={currentUser}
            />

        </div>
    )
}
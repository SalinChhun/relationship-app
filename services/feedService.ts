import { prisma } from "@/lib/prisma";
import { extractRelationshipType } from "@/utils/utils";

export interface FeedItem {
    id: string;
    type: 'post' | 'relationship';
    createdAt: Date;
    data: PostFeedData | RelationshipFeedData;
}

export interface PostFeedData {
    id: number;
    user: {
        id: number;
        name: string;
        image: string | null;
        age: number;
        gender: string;
    };
    content: string;
    images: PostImageFeedData[];
    createdAt: Date;
    updatedAt: Date;
    commentsCount: number;
    reactionsCount: number;
    userReaction: string | null;
    comments: CommentFeedData[];
    reactions: ReactionSummary[];
}

export interface PostImageFeedData {
    id: number;
    imageUrl: string;
    caption: string | null;
    order: number;
}

export interface CommentFeedData {
    id: number;
    user: {
        id: number;
        name: string;
        image: string | null;
    };
    content: string;
    createdAt: Date;
    reactionsCount: number;
    userReaction: string | null;
}

export interface RelationshipFeedData {
    id: number;
    user: {
        id: number;
        name: string;
        age: number;
        gender: string;
        image: string | null;
    };
    partner: {
        id: number | null;
        name: string | null;
        age: number | null;
        gender: string | null;
        image: string | null;
    };
    relationshipType: string;
    createdAt: Date;
}

export interface ReactionSummary {
    type: string;
    count: number;
}

export interface FeedResponse {
    items: FeedItem[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export class FeedService {
    async getFeed(page: number = 1, limit: number = 10, userId?: number): Promise<FeedResponse> {
        const skip = (page - 1) * limit;

        // Get posts
        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        age: true,
                        gender: true,
                    },
                },
                images: {
                    orderBy: {
                        order: 'asc',
                    },
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                        reactions: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 3,
                },
                reactions: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Get relationships
        const relationships = await prisma.userRelationship.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        age: true,
                        gender: true,
                        image: true,
                    },
                },
                partner: {
                    select: {
                        id: true,
                        name: true,
                        age: true,
                        gender: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Transform posts to feed items
        const postFeedItems: FeedItem[] = posts.map(post => ({
            id: `post-${post.id}`,
            type: 'post',
            createdAt: post.createdAt,
            data: this.transformPostToFeedData(post, userId),
        }));

        // Transform relationships to feed items
        const relationshipFeedItems: FeedItem[] = relationships.map(relationship => ({
            id: `relationship-${relationship.id}`,
            type: 'relationship',
            createdAt: relationship.createdAt,
            data: this.transformRelationshipToFeedData(relationship),
        }));

        // Combine and sort by createdAt
        const allFeedItems = [...postFeedItems, ...relationshipFeedItems]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        // Apply pagination
        const totalItems = allFeedItems.length;
        const totalPages = Math.ceil(totalItems / limit);
        const paginatedItems = allFeedItems.slice(skip, skip + limit);

        return {
            items: paginatedItems,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    }

    private transformPostToFeedData(post: any, currentUserId?: number): PostFeedData {
        const reactionsSummary = this.getReactionsSummary(post.reactions);
        const userReaction = post.reactions.find((r: any) => r.userId === currentUserId)?.type || null;

        return {
            id: post.id,
            user: {
                id: post.user.id,
                name: post.user.name,
                image: post.user.image,
                age: post.user.age,
                gender: post.user.gender,
            },
            content: post.content,
            images: post.images?.map((img: any) => ({
                id: img.id,
                imageUrl: img.imageUrl,
                caption: img.caption,
                order: img.order,
            })) || [],
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            commentsCount: post.comments.length,
            reactionsCount: post.reactions.length,
            userReaction,
            comments: post.comments.map((comment: any) => this.transformCommentToFeedData(comment, currentUserId)),
            reactions: reactionsSummary,
        };
    }

    private transformCommentToFeedData(comment: any, currentUserId?: number): CommentFeedData {
        const userReaction = comment.reactions.find((r: any) => r.userId === currentUserId)?.type || null;

        return {
            id: comment.id,
            user: {
                id: comment.user.id,
                name: comment.user.name,
                image: comment.user.image,
            },
            content: comment.content,
            createdAt: comment.createdAt,
            reactionsCount: comment.reactions.length,
            userReaction,
        };
    }

    private transformRelationshipToFeedData(relationship: any): RelationshipFeedData {
        return {
            id: relationship.id,
            user: {
                id: relationship.user.id,
                name: relationship.user.name,
                age: relationship.user.age,
                gender: relationship.user.gender,
                image: relationship.user.image,
            },
            partner: {
                id: relationship.partner?.id ?? null,
                name: relationship.partner?.name ?? null,
                age: relationship.partner?.age ?? null,
                gender: relationship.partner?.gender ?? null,
                image: relationship.partner?.image ?? null,
            },
            relationshipType: extractRelationshipType(relationship.relationshipType),
            createdAt: relationship.createdAt,
        };
    }

    private getReactionsSummary(reactions: any[]): ReactionSummary[] {
        const summary: { [key: string]: number } = {};

        reactions.forEach(reaction => {
            summary[reaction.type] = (summary[reaction.type] || 0) + 1;
        });

        return Object.entries(summary).map(([type, count]) => ({
            type,
            count,
        }));
    }
}
import { prisma } from "@/lib/prisma";
import { ReactionType } from "@prisma/client";

export interface CreatePostRequest {
    userId: number;
    content: string;
    images?: PostImageData[];
}

export interface PostImageData {
    imageUrl: string;
    caption?: string;
    order?: number;
}

export interface PostImageResponse {
    id: number;
    imageUrl: string;
    caption: string | null;
    order: number;
}

export interface CreateCommentRequest {
    postId: number;
    userId: number;
    content: string;
}

export interface CreateReactionRequest {
    userId: number;
    postId?: number;
    commentId?: number;
    type: ReactionType;
}

export interface PostResponse {
    id: number;
    user: {
        id: number;
        name: string;
        image: string | null;
        age: number;
        gender: string;
    };
    content: string;
    images: PostImageResponse[];
    createdAt: Date;
    updatedAt: Date;
    commentsCount: number;
    reactionsCount: number;
    userReaction: ReactionType | null;
    comments: CommentResponse[];
    reactions: ReactionSummary[];
}

export interface CommentResponse {
    id: number;
    user: {
        id: number;
        name: string;
        image: string | null;
    };
    content: string;
    createdAt: Date;
    reactionsCount: number;
    userReaction: ReactionType | null;
}

export interface ReactionSummary {
    type: ReactionType;
    count: number;
}

export class PostService {
    async createPost(data: CreatePostRequest): Promise<PostResponse> {
        const post = await prisma.post.create({
            data: {
                userId: data.userId,
                content: data.content,
                images: {
                    create: data.images?.map((img, index) => ({
                        imageUrl: img.imageUrl,
                        caption: img.caption,
                        order: img.order ?? index,
                    })) || [],
                },
            },
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
                },
                reactions: true,
            },
        });

        return this.transformPostResponse(post, data.userId);
    }

    async createComment(data: CreateCommentRequest): Promise<CommentResponse> {
        const comment = await prisma.comment.create({
            data: {
                postId: data.postId,
                userId: data.userId,
                content: data.content,
            },
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
        });

        return this.transformCommentResponse(comment, data.userId);
    }

    async createReaction(data: CreateReactionRequest): Promise<{ success: boolean }> {
        const existingReaction = await prisma.reaction.findFirst({
            where: {
                userId: data.userId,
                postId: data.postId,
                commentId: data.commentId,
            },
        });

        if (existingReaction) {
            if (existingReaction.type === data.type) {
                // Remove reaction if same type
                await prisma.reaction.delete({
                    where: { id: existingReaction.id },
                });
            } else {
                // Update reaction type
                await prisma.reaction.update({
                    where: { id: existingReaction.id },
                    data: { type: data.type },
                });
            }
        } else {
            // Create new reaction
            await prisma.reaction.create({
                data: {
                    userId: data.userId,
                    postId: data.postId,
                    commentId: data.commentId,
                    type: data.type,
                },
            });
        }

        return { success: true };
    }

    async getPosts(page: number = 1, limit: number = 10, userId?: number): Promise<PostResponse[]> {
        const skip = (page - 1) * limit;

        const posts = await prisma.post.findMany({
            skip,
            take: limit,
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
                    take: 3, // Show only first 3 comments
                },
                reactions: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return posts.map(post => this.transformPostResponse(post, userId));
    }

    private transformPostResponse(post: any, currentUserId?: number): PostResponse {
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
            comments: post.comments.map((comment: any) => this.transformCommentResponse(comment, currentUserId)),
            reactions: reactionsSummary,
        };
    }

    private transformCommentResponse(comment: any, currentUserId?: number): CommentResponse {
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

    private getReactionsSummary(reactions: any[]): ReactionSummary[] {
        const summary: { [key: string]: number } = {};

        reactions.forEach(reaction => {
            summary[reaction.type] = (summary[reaction.type] || 0) + 1;
        });

        return Object.entries(summary).map(([type, count]) => ({
            type: type as ReactionType,
            count,
        }));
    }
}
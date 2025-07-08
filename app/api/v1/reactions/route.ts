import { NextRequest } from 'next/server';
import { ReactionType } from '@prisma/client';
import {PostService} from "@/services/postService";

const postService = new PostService();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, postId, commentId, type } = body;

        if (!userId || !type || (!postId && !commentId)) {
            return Response.json(
                { success: false, error: 'userId, type, and either postId or commentId are required' },
                { status: 400 }
            );
        }

        if (!Object.values(ReactionType).includes(type)) {
            return Response.json(
                { success: false, error: 'Invalid reaction type' },
                { status: 400 }
            );
        }

        const result = await postService.createReaction({ userId, postId, commentId, type });

        return Response.json(
            { success: true, data: result },
            { status: 200 }
        );
    } catch (error) {
        console.error('API Error:', error);
        return Response.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
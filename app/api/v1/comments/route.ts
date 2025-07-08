import { NextRequest } from 'next/server';
import {PostService} from "@/services/postService";

const postService = new PostService();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { postId, userId, content } = body;

        if (!postId || !userId || !content) {
            return Response.json(
                { success: false, error: 'postId, userId, and content are required' },
                { status: 400 }
            );
        }

        const comment = await postService.createComment({ postId, userId, content });

        return Response.json(
            { success: true, data: comment },
            { status: 201 }
        );
    } catch (error) {
        console.error('API Error:', error);
        return Response.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
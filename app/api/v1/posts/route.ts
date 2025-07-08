import { NextRequest } from 'next/server';
import {PostService} from "@/services/postService";

const postService = new PostService();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('pageNumber') || '1');
        const limit = parseInt(searchParams.get('pageSize') || '10');
        const userId = searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined;

        const posts = await postService.getPosts(page, limit, userId);

        return Response.json(
            { success: true, data: posts },
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, content, images } = body;

        if (!userId || !content) {
            return Response.json(
                { success: false, error: 'userId and content are required' },
                { status: 400 }
            );
        }

        // Validate images array if provided
        if (images && !Array.isArray(images)) {
            return Response.json(
                { success: false, error: 'images must be an array' },
                { status: 400 }
            );
        }

        // Validate each image object
        if (images && images.length > 0) {
            for (const img of images) {
                if (!img.imageUrl || typeof img.imageUrl !== 'string') {
                    return Response.json(
                        { success: false, error: 'Each image must have a valid imageUrl' },
                        { status: 400 }
                    );
                }
            }
        }

        const post = await postService.createPost({ userId, content, images });

        return Response.json(
            { success: true, data: post },
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
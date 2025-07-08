import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedParams = await params;
        const postId = parseInt(resolvedParams.id);
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('pageNumber') || '1');
        const limit = parseInt(searchParams.get('pageSize') || '10');
        const userId = searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined;

        const skip = (page - 1) * limit;

        const comments = await prisma.comment.findMany({
            where: { postId },
            skip,
            take: limit,
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
        });

        const totalComments = await prisma.comment.count({
            where: { postId },
        });

        const transformedComments = comments.map(comment => ({
            id: comment.id,
            user: {
                id: comment.user.id,
                name: comment.user.name,
                image: comment.user.image,
            },
            content: comment.content,
            createdAt: comment.createdAt,
            reactionsCount: comment.reactions.length,
            userReaction: comment.reactions.find(r => r.userId === userId)?.type || null,
        }));

        const totalPages = Math.ceil(totalComments / limit);

        return Response.json(
            {
                success: true,
                data: {
                    comments: transformedComments,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalItems: totalComments,
                        hasNext: page < totalPages,
                        hasPrev: page > 1,
                    },
                },
            },
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
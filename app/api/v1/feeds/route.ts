import { NextRequest } from 'next/server';
import {FeedService} from "@/services/feedService";

const feedService = new FeedService();

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('pageNumber') || '1');
        const limit = parseInt(searchParams.get('pageSize') || '10');
        const userId = searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined;

        const feed = await feedService.getFeed(page, limit, userId);

        return Response.json(
            { success: true, data: feed },
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
import { NextRequest } from 'next/server';
import { UserService } from '@/services/userService';
import { UserRequest, BusinessException } from '@/types';

const userService = new UserService();

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.userId);
        const payload: UserRequest = await request.json();

        // Basic validation
/*        if (!payload.name || !payload.age || !payload.gender) {
            return Response.json(
                { success: false, error: 'Name, age, and gender are required' },
                { status: 400 }
            );
        }*/

        await userService.updateUser(userId, payload);

        return Response.json(
            { success: true, message: 'User updated successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('API Error:', error);

        if (error instanceof BusinessException) {
            return Response.json(
                { success: false, error: error.message },
                { status: error.statusCode }
            );
        }

        return Response.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
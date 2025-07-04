import { NextRequest } from 'next/server';
import { UserService } from '@/services/userService';
import { UserRequest, BusinessException } from '@/types';

const userService = new UserService();

export async function POST(request: NextRequest) {
    try {
        const payload: UserRequest = await request.json();

        // Basic validation
        if (!payload.name) {
            return Response.json(
                { success: false, error: 'Name is required' },
                { status: 400 }
            );
        }

        if (!payload.username || payload.username.trim() === '') {
            return Response.json(
                { success: false, error: 'Username is required' },
                { status: 400 }
            );
        }

        if (!payload.password || payload.password.trim() === '') {
            return Response.json(
                { success: false, error: 'Password is required' },
                { status: 400 }
            );
        }

        const createdUser = await userService.createUser(payload);

        return Response.json(
            {
                success: true,
                message: 'User created successfully',
                data: {
                    id: createdUser.id,
                    username: createdUser.username,
                    name: createdUser.name,
                    age: createdUser.age,
                    gender: createdUser.gender,
                },
            },
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

export async function GET() {
    try {
        const users = await userService.getAllUsers();

        return Response.json(
            { success: true, data: users },
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
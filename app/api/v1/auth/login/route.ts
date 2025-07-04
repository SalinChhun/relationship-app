import { NextRequest } from 'next/server';
import { authService } from '@/services/authService';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        const user = await authService.login(username, password);

        return Response.json(
            { success: true, message: 'Login successful', data: user },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Login error:', error);
        return Response.json(
            { success: false, error: error.message ?? 'Internal server error' },
            { status: error.statusCode ?? 500 }
        );
    }
}

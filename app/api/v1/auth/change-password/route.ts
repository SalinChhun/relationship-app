import { NextRequest } from 'next/server';
import { authService } from '@/services/authService';

export async function POST(request: NextRequest) {
    try {
        const { username, oldPassword, newPassword } = await request.json();
        await authService.changePassword(username, oldPassword, newPassword);

        return Response.json(
            { success: true, message: 'Password updated successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Change password error:', error);
        return Response.json(
            { success: false, error: error.message ?? 'Internal server error' },
            { status: error.statusCode ?? 500 }
        );
    }
}

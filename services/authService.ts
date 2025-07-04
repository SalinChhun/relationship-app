import { prisma } from '@/lib/prisma';
import {BusinessException} from "@/types"; // Adjust path to your Prisma client

export class AuthService {
    /**
     * Login by verifying username and password.
     */
    async login(username: string, password: string) {
        if (!username || !password) {
            throw new BusinessException(400, 'Username and password are required');
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user || user.password !== password) {
            throw new BusinessException(401, 'Invalid username or password');
        }

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Change password after verifying old password.
     */
    async changePassword(username: string, oldPassword: string, newPassword: string) {
        if (!username || !oldPassword || !newPassword) {
            throw new BusinessException(400, 'Username, old password, and new password are required');
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user || user.password !== oldPassword) {
            throw new BusinessException(401, 'Invalid username or old password');
        }

        await prisma.user.update({
            where: { username },
            data: { password: newPassword },
        });
    }
}

export const authService = new AuthService();

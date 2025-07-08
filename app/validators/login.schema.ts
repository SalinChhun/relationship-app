import { z } from 'zod';

export const LoginFormSchema = z.object({
    username: z
        .string()
        .nonempty('Username is required.')
        .min(3, { message: 'Username must be at least 3 characters long.' })
        .max(20, { message: 'Username must not exceed 20 characters.' })
        .regex(/^[a-zA-Z0-9@]+$/, { message: 'Username can only contain letters, numbers, and @.' })
        .trim(),
    password: z
        .string()
        .nonempty('Password is required.')
        .trim()
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;
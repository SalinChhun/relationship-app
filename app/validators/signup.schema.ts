import { z } from 'zod';

export const SignupFormSchema = z.object({
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
        .trim(),
    name: z
        .string()
        .max(50, { message: 'Name must not exceed 50 characters.' })
        .trim(),
    age: z
        .number().optional(),
    gender: z
        .enum(['MALE', 'FEMALE', 'OTHER'], {
            message: 'Gender must be one of MALE, FEMALE, or OTHER.'
        }),
});

export type SignupFormValues = z.infer<typeof SignupFormSchema>;
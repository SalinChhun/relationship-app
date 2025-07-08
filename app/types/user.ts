import {Gender} from "@prisma/client";

export interface UserType {
    id: number;
    username: string;
    name: string;
    age: number;
    gender: Gender;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
}

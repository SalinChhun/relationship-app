// types/index.ts
import {RelationshipType} from "@prisma/client";

export interface UserRequest {
    username: string;
    password: string;
    type: string;
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE';
    jobIds?: number[];
    partnerRequests?: PartnerRequest[];
}

export interface PartnerRequest {
    id: number;
    relationshipType: RelationshipType;
}

export interface UserResponse {
    id: number;
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE';
    jobs: JobResponse[];
    relationships: PartnerResponse[];
}

export interface JobResponse {
    id: number;
    title: string;
}

export interface PartnerResponse {
    id: number;
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE';
    relationshipType: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export class BusinessException extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = 'BusinessException';
    }
}
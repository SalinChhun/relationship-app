import {prisma} from '@/lib/prisma';
import {BusinessException, UserRequest, UserResponse} from '@/types';
import {Gender, User} from "@prisma/client";
import {extractRelationshipType} from "@/utils/utils";

export class UserService {

    async createUser(payload: UserRequest): Promise<User> {
        // Check if person already exists to avoid duplicates
/*        if (await this.isPersonExists(payload.name, payload.age, payload.gender)) {
            throw new BusinessException(400, 'User with the same name and age already exists');
        }*/

        // ✅ Check if username already exists
        const existingUserByUsername = await prisma.user.findUnique({
            where: { username: payload.username },
        });

        if (existingUserByUsername) {
            throw new BusinessException(400, `Username '${payload.username}' is already taken`);
        }

        return prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    username: payload.username,
                    password: payload.password,
                    type: payload.type,
                    name: payload.name,
                    age: payload.age,
                    gender: payload.gender,
                },
            });

            // Create job associations if provided
            if (payload.jobIds && payload.jobIds.length > 0) {
                // Validate that all jobs exist
                const jobs = await tx.job.findMany({
                    where: {
                        id: {
                            in: payload.jobIds,
                        },
                    },
                });

                if (jobs.length !== payload.jobIds.length) {
                    const foundJobIds = jobs.map(job => job.id);
                    const notFoundJobIds = payload.jobIds.filter((id: any) => !foundJobIds.includes(id));
                    throw new BusinessException(404, `Jobs not found with IDs: ${notFoundJobIds}`);
                }

                // Create UserJob associations
                await tx.userJob.createMany({
                    data: payload.jobIds.map((jobId: any) => ({
                        userId: user.id,
                        jobId,
                    })),
                });
            }

            // Create user relationships if any
            if (payload.partnerRequests && payload.partnerRequests.length > 0) {
                await this.createUserRelationships(tx, payload, user.id);
            }

            return user;
        });
    }

    async getAllUsers(): Promise<UserResponse[]> {
        const users = await prisma.user.findMany({
            include: {
                userJobs: {
                    include: {
                        job: true,
                    },
                },
                userRelationships: {
                    include: {
                        partner: true,
                    },
                },
            },
        });

        return users.map(user => ({
            id: user.id,
            name: user.name,
            age: user.age,
            gender: user.gender,
            jobs: user.userJobs.map(userJob => ({
                id: userJob.job.id,
                title: userJob.job.title,
            })),
            relationships: user.userRelationships.map(relationship => {
                if (!relationship.partner) {
                    // No partner, only show relationship type
                    return {
                        id: null,
                        name: null,
                        age: null,
                        gender: null,
                        relationshipType: extractRelationshipType(relationship.relationshipType),
                    };
                }

                // Partner exists
                return {
                    id: relationship.partner.id,
                    name: relationship.partner.name,
                    age: relationship.partner.age,
                    gender: relationship.partner.gender,
                    relationshipType: extractRelationshipType(relationship.relationshipType),
                };
            }),
        }));
    }


    async getUsersByIds(userIds: number[]): Promise<any[]> {
        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: userIds,
                },
            },
        });

        // Check if all requested users were found
        if (users.length !== userIds.length) {
            const foundUserIds = users.map(user => user.id);
            const notFoundUserIds = userIds.filter(id => !foundUserIds.includes(id));
            throw new BusinessException(404, `Users not found with IDs: ${notFoundUserIds}`);
        }

        return users;
    }

    async updateUser(id: number, payload: UserRequest): Promise<void> {
        const result = await prisma.$transaction(async (tx) => {
            // Check if user exists
            const existingUser = await tx.user.findUnique({
                where: { id },
            });

            if (!existingUser) {
                throw new BusinessException(404, `User not found with ID: ${id}`);
            }

            // Update user basic info
            await tx.user.update({
                where: { id },
                data: {
                    type: payload.type,
                    name: payload.name,
                    age: payload.age,
                    gender: payload.gender,
                },
            });

            // Update jobs if provided
            if (payload.jobIds && payload.jobIds.length > 0) {
                // Validate that all jobs exist
                const jobs = await tx.job.findMany({
                    where: {
                        id: {
                            in: payload.jobIds,
                        },
                    },
                });

                if (jobs.length !== payload.jobIds.length) {
                    const foundJobIds = jobs.map(job => job.id);
                    const notFoundJobIds = payload.jobIds.filter((jobId:any) => !foundJobIds.includes(jobId));
                    throw new BusinessException(404, `Jobs not found with IDs: ${notFoundJobIds}`);
                }

                // Remove existing job associations
                await tx.userJob.deleteMany({
                    where: { userId: id },
                });

                // Create new job associations
                await tx.userJob.createMany({
                    data: payload.jobIds.map((jobId:any) => ({
                        userId: id,
                        jobId,
                    })),
                });
            }

            // Update relationships if provided
            if (payload.partnerRequests && payload.partnerRequests.length > 0) {
                // Remove existing relationships
                await tx.userRelationship.deleteMany({
                    where: { userId: id },
                });

                // Create new relationships
                await this.createUserRelationships(tx, payload, id);
            }
        });
    }

    private async isPersonExists(name: string, age: number, gender: Gender): Promise<boolean> {
        const user = await prisma.user.findFirst({
            where: {
                name,
                age,
                gender
            },
        });
        return !!user;
    }

    private async createUserRelationships(tx: any, payload: UserRequest, userId: number): Promise<void> {
        if (!payload.partnerRequests || payload.partnerRequests.length === 0) {
            return;
        }

        const partnerIds = payload.partnerRequests
            .filter((req: any) => req.id !== undefined && req.id !== null)
            .map((req: any) => req.id);
        if (partnerIds.length > 0) {
            // Validate that user is not trying to create relationship with themselves
            this.validateSelfRelationship(userId, partnerIds);

            // Validate that all partners exist
            const partners = await tx.user.findMany({
                where: {
                    id: {
                        in: partnerIds,
                    },
                },
            });

            if (partners.length !== partnerIds.length) {
                const foundPartnerIds = partners.map((partner: any) => partner.id);
                const notFoundPartnerIds = partnerIds.filter((id: any) => !foundPartnerIds.includes(id));
                throw new BusinessException(404, `Partners not found with IDs: ${notFoundPartnerIds}`);
            }
        }

        // Create relationships
        await tx.userRelationship.createMany({
            data: payload.partnerRequests.map((partnerRequest: any) => ({
                userId,
                partnerId: partnerRequest.id ?? null,
                relationshipType: partnerRequest.relationshipType,
            })),
        });
    }

    private validateSelfRelationship(userId: number, partnerIds: number[]): void {
        const hasSelfRelationship = partnerIds.some(partnerId => partnerId === userId);

        if (hasSelfRelationship) {
            throw new BusinessException(400, 'User cannot create a relationship with themselves');
        }
    }

}
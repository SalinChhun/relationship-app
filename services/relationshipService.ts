import {prisma} from "@/lib/prisma";
import {extractRelationshipType} from "@/utils/utils";

interface RelationshipResponse {
    id: number;
    user: {
        id: number;
        name: string;
        age: number;
        gender: string;
    };
    partner: {
        id: number | null;
        name: string | null;
        age: number | null;
        gender: string | null;
    };
    relationshipType: string;
    createdAt: Date;
}


export class RelationshipService {
    async getAllRelationships(): Promise<RelationshipResponse[]> {
        const relationships = await prisma.userRelationship.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        age: true,
                        gender: true,
                    },
                },
                partner: {
                    select: {
                        id: true,
                        name: true,
                        age: true,
                        gender: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return relationships.map(relationship => ({
            id: relationship.id,
            user: {
                id: relationship.user.id,
                name: relationship.user.name,
                age: relationship.user.age,
                gender: relationship.user.gender,
            },
            partner: {
                id: relationship.partner?.id ?? null,
                name: relationship.partner?.name ?? null,
                age: relationship.partner?.age ?? null,
                gender: relationship.partner?.gender ?? null,
            },
            relationshipType: extractRelationshipType(relationship.relationshipType),
            createdAt: relationship.createdAt,
        }));
    }
}

import {RelationshipType} from "@prisma/client";

export interface RelationshipRequest {
    userId: any;
    partnerRequests: PartnerRequest[];
}

export interface PartnerRequest {
    id: number | null;
    relationshipType: RelationshipType;
}
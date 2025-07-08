import {http} from "@/utils/http";
import {RelationshipRequest} from "@/app/types/relationship";

const ServiceId = {
    RELATIONSHIP: '/api/v1/feeds',
}

const createRelationship = (requestBody: RelationshipRequest) => {
    return http.put(`/api/v1/users/${requestBody.userId}`,requestBody);
}

const getRelationships = async (): Promise<any> => {
    const result = await http.get(ServiceId.RELATIONSHIP);
    return result.data
}

export const relationshipService = {
    createRelationship,
    getRelationships,
}
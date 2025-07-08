import {RelationshipType} from "@prisma/client";

interface RelationshipTypeOption {
    value: RelationshipType;
    label: string;
    emoji: string;
}

export const relationshipTypes: RelationshipTypeOption[] = [
    { value: RelationshipType.SINGLE, label: "Single", emoji: "💔" },
    { value: RelationshipType.ENGAGED, label: "Engaged", emoji: "💍" },
    { value: RelationshipType.MARRIED, label: "Married", emoji: "💑" },
    { value: RelationshipType.IN_RELATIONSHIP, label: "In a Relationship", emoji: "💙" },
    { value: RelationshipType.SITUATIONSHIP, label: "Situationship", emoji: "💞" },
    { value: RelationshipType.GIRLFRIEND, label: "Girlfriend", emoji: "💕" },
    { value: RelationshipType.BOYFRIEND, label: "Boyfriend", emoji: "💙" },
    { value: RelationshipType.WIFE, label: "Wife", emoji: "👰" },
    { value: RelationshipType.HUSBAND, label: "Husband", emoji: "🤵" },
    { value: RelationshipType.DHARMA_SISTER, label: "Dharma Sister", emoji: "🙏" },
    { value: RelationshipType.DHARMA_BROTHER, label: "Dharma Brother", emoji: "🕉️" },
];

export const extractRelationshipType = (relationshipType: RelationshipType): string => {
    switch (relationshipType) {
        case RelationshipType.SINGLE:
            return 'Single';
        case RelationshipType.ENGAGED:
            return 'Engaged';
        case RelationshipType.MARRIED:
            return 'Married';
        case RelationshipType.IN_RELATIONSHIP:
            return 'In a Relationship';
        case RelationshipType.SITUATIONSHIP:
            return 'Situationship';
        case RelationshipType.GIRLFRIEND:
            return 'Girlfriend';
        case RelationshipType.BOYFRIEND:
            return 'Boyfriend';
        case RelationshipType.WIFE:
            return 'Wife';
        case RelationshipType.HUSBAND:
            return 'Husband';
        case RelationshipType.DHARMA_SISTER:
            return 'Dharma Sister';
        case RelationshipType.DHARMA_BROTHER:
            return 'Dharma Brother';
        default:
            return relationshipType;
    }
}
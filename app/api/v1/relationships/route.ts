import {BusinessException} from "@/types";
import {RelationshipService} from "@/services/relationshipService";

const relationshipService = new RelationshipService();
export async function GET() {
    try {
        const relationships = await relationshipService.getAllRelationships();

        return Response.json(
            { success: true, data: relationships },
            { status: 200 }
        );
    } catch (error) {
        console.error('API Error:', error);

        if (error instanceof BusinessException) {
            return Response.json(
                { success: false, error: error.message },
                { status: error.statusCode }
            );
        }

        return Response.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
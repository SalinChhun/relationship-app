import {http} from "@/utils/http";
import {RelationshipRequest} from "@/app/types/relationship";

const ServiceId = {
    FEED: '/api/v1/feeds',
}

const getFeeds = async (params: {
    search?: string;
    pageParam?: number;
    pageSize?: number;
}): Promise<any> => {
    const result = await http.get(`${ServiceId.FEED}`,{
        params: {
            pageNumber: params.pageParam,
            pageSize: params.pageSize || 10,
        }
    });

    return result.data
}

export const feedService = {
    getFeeds,
}
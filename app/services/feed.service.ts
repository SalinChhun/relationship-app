import {http} from "@/utils/http";
import {RelationshipRequest} from "@/app/types/relationship";

const ServiceId = {
    FEED: '/api/v1/feeds',
}

const getFeeds = async (pageNumber: any, pageSize: any): Promise<any> => {
    const result = await http.get(`${ServiceId.FEED}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return result.data
}

export const feedService = {
    getFeeds,
}
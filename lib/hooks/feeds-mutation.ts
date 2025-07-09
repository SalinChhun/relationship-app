import {feedService} from "@/app/services/feed.service";
import {useInfiniteScroll} from "@/lib/hooks/useInfiniteScroll";

const useFetchFeeds = (pageSize: number = 5) => {
    const feedsQuery = useInfiniteScroll({
        queryKey: ["feeds"],
        queryFn: ({ pageParam }) =>
            feedService.getFeeds({ pageParam, pageSize }) // Pass pageSize here
    });

    return {
        ...feedsQuery,
    }
}


export const useFeedMutation = {
    useFetchFeeds
}

export default useFeedMutation;
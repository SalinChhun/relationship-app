import {useQuery} from "@tanstack/react-query";
import {feedService} from "@/app/services/feed.service";

const useFetchFeeds = (pageNumber: number, pageSize: number = 3) =>{

    const {data,  isLoading, isError} = useQuery({
        queryKey: ["feeds", pageNumber, pageSize],
        queryFn: () => feedService.getFeeds(pageNumber, pageSize),
    });

    return {
        isLoading,
        isError,
        feeds: data,
    }
}



export const useFeedMutation = {
    useFetchFeeds
}

export default useFeedMutation;
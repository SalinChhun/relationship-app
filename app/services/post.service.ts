import {http} from "@/utils/http";

const ServiceId = {
    POSTS: '/api/v1/posts',
}

const createPost = (requestBody: any) => {
    return http.post(ServiceId.POSTS,requestBody);
}


export const postService = {
    createPost,
}
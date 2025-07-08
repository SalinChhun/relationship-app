import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {postService} from "@/app/services/post.service";

const useCreatePost = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: any) => postService.createPost(data),
        onError: (error: any) => {
            console.log(error)
            toast.error(error?.message)
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({queryKey: ['feeds']});
            toast.success('Create post successfully')
        }
    })

    return {
        mutation: mutation.mutate,
        isSuccess: mutation.isSuccess,
        isLoading: mutation.isPending,
    }

}

export const usePostMutation = {
    useCreatePost,
}

export default usePostMutation;
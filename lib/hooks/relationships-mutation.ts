import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {relationshipService} from "@/app/services/relationship.service";
import toast from "react-hot-toast";

const useCreateRelationship = () => {

    // const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: any) => relationshipService.createRelationship(data),
        onError: (error: any) => {
            console.log(error)
            toast.error(error?.message)
        },
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({queryKey: ['relationships']});
            toast.success('Create Relationship successfully')
        }
    })

    return {
        mutation: mutation.mutate,
        isSuccess: mutation.isSuccess,
        isLoading: mutation.isPending,
    }

}

const useFetchRelationships = () =>{

    const {data,  isLoading, isError} = useQuery({
        queryKey: ["relationships"],
        queryFn: () => relationshipService.getRelationships()
    });

    return {
        isLoading,
        isError,
        relationships: data,
    }
}



export const useRelationshipMutation = {
    useCreateRelationship,
    useFetchRelationships
}

export default useRelationshipMutation;
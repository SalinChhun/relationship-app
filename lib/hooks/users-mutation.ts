import {useQuery} from "@tanstack/react-query";
import {usersService} from "@/app/services/users.service";

const useFetchUsers = () =>{

    const {data,  isLoading, isError} = useQuery({
        queryKey: ["users"],
        queryFn: () => usersService.getUsers()
    });

    return {
        isLoading,
        isError,
        users: data,
    }
}

export const useUsersMutation = {
    useFetchUsers
}

export default useUsersMutation;
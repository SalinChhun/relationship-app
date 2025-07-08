import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {authService} from "@/app/services/auth.service";
import {useRouter} from "next/navigation";
import {setCurrentUserToLocalStorage} from "@/utils/auth";

const useRegisterUser = () => {

    const router = useRouter();
    // const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: any) => authService.registerUser(data),
        onError: (error: any) => {
            console.log(error)
            toast.error(error?.message)
        },
        onSuccess: (data: any) => {
            // queryClient.invalidateQueries({queryKey: ['users']});
            setCurrentUserToLocalStorage(data?.data?.data);
            router.push("/home");
            toast.success('Create user successfully')
        }
    })

    return {
        mutation: mutation.mutate,
        isSuccess: mutation.isSuccess,
        isLoading: mutation.isPending,
    }

}

const useLogin = () => {

    const router = useRouter();
    // const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: any) => authService.login(data),
        onError: (error: any) => {
            console.log(error)
            toast.error(error?.message)
        },
        onSuccess: (data: any) => {
            // queryClient.invalidateQueries({queryKey: ['users']});
            setCurrentUserToLocalStorage(data?.data?.data);
            router.push("/home");
            toast.success('Login successfully')
        }
    })

    return {
        mutation: mutation.mutate,
        isSuccess: mutation.isSuccess,
        isLoading: mutation.isPending,
    }

}

export const useAuthMutation = {
    useRegisterUser,
    useLogin,
}

export default useAuthMutation;
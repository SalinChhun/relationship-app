import {http} from "@/utils/http";

const ServiceId = {
    USERS: '/api/v1/users',
}

const getUsers = async (): Promise<any> => {
    const result = await http.get(ServiceId.USERS);
    return result.data
}

export const usersService = {
    getUsers,
}
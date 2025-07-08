import {http} from "@/utils/http";

const ServiceId = {
    USERS: '/api/v1/users',
}

const registerUser = (requestBody: any) => {
    return http.post(ServiceId.USERS,requestBody);
}

const login = (requestBody: any) => {
    return http.post('/api/v1/auth/login',requestBody);
}

export const authService = {
    registerUser,
    login,
}
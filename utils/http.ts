import axios from "axios";

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const response = error?.response;
        const data = response?.data;

        if (!response) {
            return Promise.reject(error);
        } else if (response.status >= 400) {
            // Check multiple possible error message locations
            const errorMessage =
                data?.error ||              // Your server format: {"success":false,"error":"message"}
                data?.message ||            // Common format: {"message":"error message"}
                data?.status?.message ||    // Nested format
                response.statusText ||      // HTTP status text fallback
                'An error occurred';        // Final fallback

            return Promise.reject({
                message: errorMessage,
                status: response.status,
                originalError: error // Keep original error for debugging
            });
        }
    },
);
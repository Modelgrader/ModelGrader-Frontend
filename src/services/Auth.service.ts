import apiClient from "./index";
import { AuthServiceAPI } from "@/types/apis/Auth.api";
import { AccountModel } from "@/types/models/Account.model";
import { AuthenticationResultResponse } from "@/types/models/Auth.model";

export const AuthService: AuthServiceAPI = {
    login: async (request) => {
        const response = await apiClient.post<AccountModel>('/api/login', request);
        return response;
    },

    logout: async (request) => {
        const response = await apiClient.post<AccountModel>('/api/logout', request);
        return response;
    },

    authorize: async (request) => {
        const response = await apiClient.put<AuthenticationResultResponse>('/api/token', request);
        return response;
    },

    refreshToken: async (refreshToken: string) => {
        const response = await apiClient.post<{ access_token: string }>('/api/auth/token/refresh', { refresh_token: refreshToken });
        return response;
    }
}
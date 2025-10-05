import apiClient from "./index";
import { AccountServiceAPI } from "@/types/apis/Account.api";
import { AccountModel } from "@/types/models/Account.model";

export const AccountService: AccountServiceAPI = {
    create: async (request) => {
        const response = await apiClient.post<AccountModel>('/api/accounts', request);
        return response;
    },

    getAll: async (query) => {
        const response = await apiClient.get<{accounts: AccountModel[]}>('/api/accounts', {params: query});
        return response;
    },

    get: async (id) => {
        const response = await apiClient.get<AccountModel>(`/api/accounts/${id}`);
        return response;
    }
}
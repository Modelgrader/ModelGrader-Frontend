import apiClient from "./index";
import { GroupSerivceAPI } from "@/types/apis/Group.api";

export const GroupService: GroupSerivceAPI = {
    get: async (groupId:string,query?:any) => {
        const response = await apiClient.get(`/api/groups/${groupId}`,{
            params: query
        })

        return response;
    },

    getAllAsCreator: async (accountId:string,query?:any) => {
        const response = await apiClient.get(`/api/accounts/${accountId}/groups`,{
            params: query,
        })

        return response;
    },

    create: async (accountId,request) => {
        const response = await apiClient.post(`/api/accounts/${accountId}/groups`,request)

        return response;
    },

    update: async (groupId,request) => {
        const response = await apiClient.put(`/api/groups/${groupId}`,request)

        return response;
    },

    delete: async (groupId) => {
        const response = await apiClient.delete(`/api/groups/${groupId}`)

        return response;
    },

    updateMembers: async (groupId,accountIds) => {
        const response = await apiClient.put(`/api/groups/${groupId}/members/update`,{
            account_ids: accountIds
        })

        return response;
    },

    addMembers: async (groupId,accountIds) => {
        const response = await apiClient.put(`/api/groups/${groupId}/members/add`,{
            account_ids: accountIds
        })

        return response;
    }
}
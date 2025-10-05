import apiClient from "./index";
import { GetAllTopicsByAccountResponse, TopicSerivceAPI } from "../types/apis/Topic.api";
import { TopicModel, TopicPopulateTopicCollectionPopulateCollectionPopulateCollectionProblemsPopulateProblemAndCollectionGroupPermissionsPopulateGroupAndTopicGroupPermissionPopulateGroupModel } from "../types/models/Topic.model";

export const TopicService: TopicSerivceAPI = {
    create: async (accountId, request) => {
        const response = await apiClient.post<TopicModel>(`/api/accounts/${accountId}/topics`, request);
        return response;
    },

    get: async (accountId,topicId) => {
        const response = await apiClient.get<TopicPopulateTopicCollectionPopulateCollectionPopulateCollectionProblemsPopulateProblemAndCollectionGroupPermissionsPopulateGroupAndTopicGroupPermissionPopulateGroupModel>(`/api/accounts/${accountId}/topics/${topicId}`);
        return response;
    },

    getAllAccessibleByAccount: async (accountId) => {
        const response = await apiClient.get<GetAllTopicsByAccountResponse>(`/api/accounts/${accountId}/access/topics`);
        return response;
    },

    update: async (topicId,accountId, request) => {
        const response = await apiClient.put<TopicModel>(`/api/accounts/${accountId}/topics/${topicId}`, request);
        return response;
    },

    delete: async (topicId,accountId) => {
        const response = await apiClient.delete<null>(`/api/accounts/${accountId}/topics/${topicId}`);
        return response;
    },

    getAllAsCreator: async (accountId) => {
        const response = await apiClient.get<GetAllTopicsByAccountResponse>(`/api/accounts/${accountId}/topics`);
        return response;
    },

    updateCollections: async (topicId, collectionIds) => {
        const response = await apiClient.put<TopicModel>(`/api/topics/${topicId}/collections/update`, {
            collection_ids: collectionIds
        });
        return response;
    },

    getPublicByAccount: async (accountId,topicId) => {
        const response = await apiClient.get<TopicModel>(`/api/topics/${topicId}?account_id=${accountId}`);
        return response;
    },

    updateGroupPermissions: async (topicId,accountId, groups) => {
        const response = await apiClient.put<TopicModel>(`/api/accounts/${accountId}/topics/${topicId}/groups`, {
            groups: groups
        });
        return response;
    }
}
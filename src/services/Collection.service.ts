import apiClient from "./index";
import { CollectionServiceAPI, GetCollectionByAccountResponse } from "@/types/apis/Collection.api";
import { CollectionModel, CollectionPopulateCollectionProblemsPopulateProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupAndCollectionGroupPermissionsPopulateGroupModel } from "@/types/models/Collection.model";

export const CollectionService: CollectionServiceAPI = {
    create: (accountId,request) => {
        return apiClient.post<CollectionModel>(`/api/accounts/${accountId}/collections`,request);
    },

    get: (collectionId,accountId) => {
        return apiClient.get<CollectionPopulateCollectionProblemsPopulateProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupAndCollectionGroupPermissionsPopulateGroupModel>(`/api/accounts/${accountId}/collections/${collectionId}`);
    },

    getAllAsCreator: (accountId) => {
        return apiClient.get<GetCollectionByAccountResponse>(`/api/accounts/${accountId}/collections`);
    },

    update: (collectionId,accountId,request) => {
        return apiClient.put<CollectionModel>(`/api/accounts/${accountId}/collections/${collectionId}`,request);
    },

    delete: (collectionId,accountId) => {
        return apiClient.delete<null>(`/api/accounts/${accountId}/collections/${collectionId}`);
    },

    addProblem: (collectionId,problemIds) => {
        return apiClient.put<CollectionModel>(`/api/collections/${collectionId}/problems/add`,{problemIds});
    },

    removeProblem: (collectionId,problemIds) => {
        return apiClient.put(`/api/collections/${collectionId}/problems/remove`,{data:{problemIds}});
    },

    updateProblem: (collectionId,problemIds) => {
        return apiClient.put<CollectionModel>(`/api/collections/${collectionId}/problems/update`,{problem_ids: problemIds});
    },

    updateGroupPermissions: (collectionId,accountId,groups) => {
        return apiClient.put<CollectionModel>(`/api/accounts/${accountId}/collections/${collectionId}/groups`,{groups});
    }
    
}
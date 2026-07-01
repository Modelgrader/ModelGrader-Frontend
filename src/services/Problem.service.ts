import apiClient from "./index";
import { GetAllProblemsByAccountResponse, GetAllProblemsResponse, ProblemServiceAPI, ValidateProgramResponse } from "@/types/apis/Problem.api";
import { ProblemModel, ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel, ProblemPopulateCreatorSecureModel } from "@/types/models/Problem.model";

export const ProblemService: ProblemServiceAPI = {
    create: async (accountId,request) => {
        return apiClient.post<ProblemModel>(`/api/accounts/${accountId}/problems`, request);
    },

    getAll: async (query) => {
        return apiClient.get<GetAllProblemsResponse>(`/api/problems`,{params:query});
    },

    getAllAsCreator: async (accountId,query) => {
        return apiClient.get<GetAllProblemsByAccountResponse>(`/api/accounts/${accountId}/problems`,{params:query});
    },

    get: async (accountId,problemId) => {
        return apiClient.get<ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel>(`/api/accounts/${accountId}/problems/${problemId}`);
    },

    update: async (problemId,accountId,request) => {
        return apiClient.put<ProblemModel>(`/api/accounts/${accountId}/problems/${problemId}`, request);
    },

    delete: async (problemId,accountId) => {
        return apiClient.delete<null>(`/api/accounts/${accountId}/problems/${problemId}`);
    },

    // deleteMultiple: async (problemIds) => {
    //     return apiClient.delete<null>(`/api/problems/`, {problem: problemIds});
    // },

    updateGroupPermissions: async (problemId, accountId,groups) => {
        return apiClient.put<ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel>(`/api/accounts/${accountId}/problems/${problemId}/groups`, {groups});
    },

    validateProgram: async (request) => {
        return apiClient.post<ValidateProgramResponse>(`/api/problems/validate`, request);
    },

    getPublic: async (problemId) => {
        return apiClient.get<ProblemPopulateCreatorSecureModel>(`/api/problems/${problemId}`);
    },

    getPdfUrl: async (problemId: string) => {
        return apiClient.get<{ url: string }>(`/api/problems/${problemId}/pdf/url`);
    },

    uploadPdf: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.post<{ key: string }>(`/api/upload/pdf`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
}
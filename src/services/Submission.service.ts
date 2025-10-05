import apiClient from "./index";
import { GetAllSubmissionsResponse, GetSubmissionsByCretorProblemResponse, SubmissionServiceAPI } from "@/types/apis/Submission.api";
import { GetSubmissionByAccountProblemResponse, SubmissionPopulateSubmissionTestcasesSecureModel } from "@/types/models/Submission.model";

export const SubmissionService: SubmissionServiceAPI = {
    submit: async (accountId, problemId, request) => {
        const response = await apiClient.post<SubmissionPopulateSubmissionTestcasesSecureModel>(`/api/problems/${problemId}/accounts/${accountId}/submissions`,request);
        return response;
    },

    topicSubmit: async (accountId,topicId, problemId, request) => {
        const response = await apiClient.post<SubmissionPopulateSubmissionTestcasesSecureModel>(`/api/accounts/${accountId}/topics/${topicId}/problems/${problemId}/submissions`,request);
        return response;
    },

    getByCreatorProblem: async (accountId, problemId, options) => {
        const response = await apiClient.get<GetSubmissionsByCretorProblemResponse>(`/api/accounts/${accountId}/problems/${problemId}/submissions`, {
            params: options
        });
        return response;
    },

    getByAccountProblem: async (accountId, problemId) => {
        const response = await apiClient.get<GetSubmissionByAccountProblemResponse>(`/api/problems/${problemId}/accounts/${accountId}/submissions`);
        return response;
    },

    getByAccountProblemInTopic: async (accountId, problemId, topicId) => {
        const response = await apiClient.get<GetSubmissionByAccountProblemResponse>(`/api/accounts/${accountId}/topics/${topicId}/problems/${problemId}/submissions`);
        return response;
    },

    getAll: async (query) => {
        const response = await apiClient.get<GetAllSubmissionsResponse>(`/api/submissions`,{params:query});
        return response;
    }
}
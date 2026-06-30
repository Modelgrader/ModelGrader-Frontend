import { testcaseParse } from "@/utilities/TestcaseFormat";
import { CreateProblemRequest, ProblemGroupPermissionCreateRequest } from "../apis/Problem.api";
import { CreateProblemRequestForm } from "../forms/CreateProblemRequestForm";

export const transformCreateProblemRequestForm2CreateProblemRequest = (
	createRequest: CreateProblemRequestForm
): {
	request: CreateProblemRequest
	groups: ProblemGroupPermissionCreateRequest[]
} => {

	const request = {
		title: createRequest.title,
		language: createRequest.language,
		description: createRequest.description.mode === "markdown"
			? createRequest.description.content
			: JSON.stringify(createRequest.description.content),
		description_mode: createRequest.description.mode,
		solution: createRequest.solution,
		testcases: testcaseParse(
			createRequest.testcases,
			createRequest.testcase_delimeter
		),
		time_limit: createRequest.time_limit,
		allowed_languages: createRequest.allowedLanguage.filter((language) => language !== "").join(","),
	}

	const groups = createRequest.groupPermissions.map((groupPermission) => ({
		group_id: groupPermission.groupId,
		permission_manage_problems: groupPermission.manageProblems,
		permission_view_problems: groupPermission.viewProblems,
	}))

	return {request, groups};
};
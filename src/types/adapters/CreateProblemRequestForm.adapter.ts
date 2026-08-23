import { testcaseParse } from "@/utilities/TestcaseFormat";
import { CreateProblemRequest, ProblemGroupPermissionCreateRequest } from "../apis/Problem.api";
import { CreateProblemRequestForm } from "../forms/CreateProblemRequestForm";

export const transformCreateProblemRequestForm2CreateProblemRequest = (
	createRequest: CreateProblemRequestForm
): {
	request: CreateProblemRequest
	groups: ProblemGroupPermissionCreateRequest[]
} => {

	const { mode, markdown, plate, pdf } = createRequest.description;

	const descriptionValue = (() => {
		if (mode === "markdown") return markdown;
		if (mode === "plate") return JSON.stringify(plate);
		return pdf ?? "";
	})();

	const testcases = testcaseParse(
		createRequest.testcases,
		createRequest.testcase_delimeter
	);

	const request = {
		title: createRequest.title,
		language: createRequest.language,
		description: descriptionValue,
		view_mode: mode,
		pdf_url: mode === "pdf" ? pdf : null,
		solution: createRequest.solution,
		testcases,
		// Drop stale indexes left behind after testcases were removed from the editor.
		shown_testcases: (createRequest.shown_testcases ?? []).filter(
			(index) => index < testcases.length
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
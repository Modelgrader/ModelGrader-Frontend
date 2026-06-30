import { PlateEditorValueType } from "../PlateEditorValueType";
import { GroupModel } from "../models/Group.model";
import { TestcaseModel } from "../models/Problem.model";
import { ProblemPermissionRequestForm } from "./CreateGroupRequestForm";

export type ProblemGroupPermissionRequestForm = {
	groupId: string;
	group: GroupModel
} & ProblemPermissionRequestForm

export type DescriptionMode = "markdown" | "plate";

export type ProblemDescription =
	| { mode: "markdown"; content: string }
	| { mode: "plate"; content: PlateEditorValueType };

export type CreateProblemRequestForm = {
	title: string;
	description: ProblemDescription;
	language: string;
	solution: string;
	testcases: string;
	testcase_delimeter: string;
	time_limit: number;
	validated_testcases?: TestcaseModel[];
	groupPermissions: ProblemGroupPermissionRequestForm[];
	allowedLanguage: string[];
};
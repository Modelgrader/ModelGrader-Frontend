import { PlateEditorValueType } from "../PlateEditorValueType";
import { GroupModel } from "../models/Group.model";
import { TestcaseModel } from "../models/Problem.model";
import { ProblemPermissionRequestForm } from "./CreateGroupRequestForm";

export type ProblemGroupPermissionRequestForm = {
	groupId: string;
	group: GroupModel
} & ProblemPermissionRequestForm

export type DescriptionMode = "markdown" | "plate" | "pdf";

export type ProblemDescription = {
	mode: DescriptionMode;
	markdown: string;
	plate: PlateEditorValueType;
	pdf: string | null;           // S3 key (sent to backend)
	pdfPreviewUrl: string | null; // presigned URL (display only, never sent to backend)
};

export type CreateProblemRequestForm = {
	title: string;
	description: ProblemDescription;
	language: string;
	solution: string;
	testcases: string;
	testcase_delimeter: string;
	/** 0-based indexes of the testcases the creator chose to reveal to solvers. */
	shown_testcases: number[];
	time_limit: number;
	validated_testcases?: TestcaseModel[];
	groupPermissions: ProblemGroupPermissionRequestForm[];
	allowedLanguage: string[];
};
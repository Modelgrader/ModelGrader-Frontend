import { ProblemGroupPermissionPopulateGroupModel } from "../apis/Problem.api"
import { AccountModel, AccountSecureModel } from "./Account.model"
import { ProblemGroupPermissionModel } from "./Group.model"
import { SubmissionModel, SubmissionPopulateSubmissionTestcasesSecureModel } from "./Submission.model"

export type TestcaseModel = {
    testcase_id: string
    input: string
    output: string | null
    problem: number
    runtime_status: string
}

export type ProblemModel = {
    problem_id: string
    language: string
    title: string
    description: string | null
    view_mode: "markdown" | "plate" | "pdf"
    pdf_url: string | null
    pdf_presigned_url?: string | null
    solution: string
    time_limit: number
    is_active: boolean
    is_private: boolean
    submission_regex: string
    creator: AccountModel
    testcases: TestcaseModel[]
    created_date: string;
    updated_date: string;
    allowed_languages: string
    difficulty: number;
    best_submission?: SubmissionModel
    group_permissions: ProblemGroupPermissionModel[]
}

export type ProblemSecureModel = {
    problem_id: string
    language: string
    title: string
    description: string
    view_mode: "markdown" | "plate" | "pdf"
    pdf_url: string | null
    pdf_presigned_url?: string | null
    time_limit: string
    created_date: string
    updated_date: string
    allowed_languages: string
    creator: string
    difficulty: number;
}

export type ProblemPopulateCreatorSecureModel = ProblemSecureModel & {
    creator: AccountSecureModel
}

export type ProblemPoplulateCreatorModel = ProblemModel & {
    creator: AccountSecureModel
}

export type ProblemPopulateAccountSecureModel = {
    problem_id: string
    title: string
    description: string | null
    creator: AccountSecureModel
}


export type ProblemPopulateAccountAndSubmissionPopulateSubmissionTestcasesSecureModel = ProblemPoplulateCreatorModel & {
    best_submission: SubmissionPopulateSubmissionTestcasesSecureModel | null
}

export type ProblemPopulateTestcases = ProblemModel & {
    creator: AccountSecureModel
    testcases: TestcaseModel[]
}

export type ProblemHashedTable = {
    [id:string]: ProblemModel | ProblemPopulateTestcases | ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel
}

export type ProblemHealth = {
    has_source_code: boolean
    testcase_count: number
    no_runtime_error: boolean
}

export type ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel =
	ProblemModel & {
		creator: AccountModel;
		testcases: TestcaseModel[];
		group_permissions: ProblemGroupPermissionPopulateGroupModel[];
	};
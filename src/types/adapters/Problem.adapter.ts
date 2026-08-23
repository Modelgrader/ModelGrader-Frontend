import { handleDeprecatedDescription } from "@/utilities/HandleDeprecatedDescription";
import { CreateProblemRequestForm, ProblemDescription } from "../forms/CreateProblemRequestForm";
import { ProblemHashedTable, ProblemModel, ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel, ProblemPopulateTestcases } from "../models/Problem.model";

export function transformProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel2CreateProblemRequestForm(problem: ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel): CreateProblemRequestForm {
    const rawDescription = String(problem.description ?? "");
    const viewMode = problem.view_mode ?? "plate";

    const baseDescription: ProblemDescription = {
        mode: viewMode,
        markdown: "",
        plate: [],
        pdf: problem.pdf_url ?? null,
        pdfPreviewUrl: problem.pdf_presigned_url ?? null,
    };

    if (viewMode === "markdown") {
        baseDescription.markdown = rawDescription;
    } else if (viewMode === "plate") {
        try {
            baseDescription.plate = JSON.parse(handleDeprecatedDescription(rawDescription));
        } catch {
            baseDescription.plate = [];
        }
    }

    return {
        title: problem.title,
        description: baseDescription,
        language: problem.language,
        solution: problem.solution,
        testcases: problem.testcases.map(testcase => testcase.input).join(":::\n"),
        testcase_delimeter: ":::",
        shown_testcases: problem.testcases.reduce<number[]>((indexes, testcase, index) => {
            if (testcase.is_shown) indexes.push(index);
            return indexes;
        }, []),
        time_limit: problem.time_limit,
        groupPermissions: problem.group_permissions.map((permission) => ({
            groupId: permission.group.group_id,
            group: permission.group,
            manageProblems: permission.permission_manage_problems,
            viewProblems: permission.permission_view_problems
        })),
        allowedLanguage: problem.allowed_languages.split(",")
    }
}

export function transformProblemModel2ProblemHashedTable(problems: ProblemModel[] | ProblemPopulateTestcases[]): ProblemHashedTable {
    let result:ProblemHashedTable = {}
    for (const problem of problems) {
        result[problem.problem_id] = problem
    }
    return result
}
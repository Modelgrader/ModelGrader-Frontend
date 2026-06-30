import { handleDeprecatedDescription } from "@/utilities/HandleDeprecatedDescription";
import { CreateProblemRequestForm, ProblemDescription } from "../forms/CreateProblemRequestForm";
import { ProblemHashedTable, ProblemModel, ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel, ProblemPopulateTestcases } from "../models/Problem.model";

export function transformProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel2CreateProblemRequestForm(problem: ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel): CreateProblemRequestForm {
    const rawDescription = String(problem.description);
    const parsedDescription: ProblemDescription = (() => {
        try {
            const parsed = JSON.parse(rawDescription);
            if (parsed && typeof parsed === "object" && "mode" in parsed) {
                return parsed as ProblemDescription;
            }
            return { mode: "plate", content: JSON.parse(handleDeprecatedDescription(rawDescription)) };
        } catch {
            return { mode: "markdown", content: rawDescription };
        }
    })();

    return {
        title: problem.title,
        description: parsedDescription,
        language: problem.language,
        solution: problem.solution,
        testcases: problem.testcases.map(testcase => testcase.input).join(":::\n"),
        testcase_delimeter: ":::",
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
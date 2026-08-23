import { Editor as MonacoEditor } from "@monaco-editor/react";
import React from "react";
import { ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel } from "@/types/models/Problem.model";
import { SubmissionPopulateSubmissionTestcaseAndAccountModel } from "@/types/models/Submission.model";
import TestcaseValidationAccordian from "../TestcaseValidationAccordion";
import { Dialog, DialogContent, DialogTrigger } from "@/components/shadcn/Dialog";
import { ScrollArea } from "@/components/shadcn/ScrollArea";
import { Separator } from "@/components/shadcn/Seperator";
import { MONACO_EDITOR_OPTIONS } from "@/lib/fonts"

const ProblemSubmissionSourceCodeAndRuntimeResultDialog = ({
	submission,
	children,
	problem,
}: {
	submission: SubmissionPopulateSubmissionTestcaseAndAccountModel;
	children?: React.ReactNode;
	problem: ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel;
}) => {
	const [sourceCode, setSourceCode] = React.useState<string>(
		submission.submission_code
	);

	return (
		<Dialog>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent className="max-w-[96%]">
				<div className="flex">
					<div className="w-1/2">
						<MonacoEditor
							theme="vs-dark"
							// height="35vh"
							value={sourceCode}
							onChange={() =>
								setSourceCode(submission.submission_code)
							}
							language={submission.language}
							options={MONACO_EDITOR_OPTIONS}
						/>
					</div>

					<div className="mx-3">
						<Separator orientation="vertical" />
					</div>

					<div className="w-1/2">
						<ScrollArea className=" h-[60vh] pr-5">
							<TestcaseValidationAccordian
								problem={problem}
								runtimeResults={submission.runtime_output.map(
									(output, index) => ({
										...output,
										input: problem.testcases[index]?.input,
									})
								)}
							/>
						</ScrollArea>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default ProblemSubmissionSourceCodeAndRuntimeResultDialog;

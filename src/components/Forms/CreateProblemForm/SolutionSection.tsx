import { Editor as MonacoEditor } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProgrammingLanguageOptions } from "../../../constants/ProgrammingLanguage";
import { ProblemService } from "@/services/Problem.service";
import { ValidateProgramResponse } from "@/types/apis/Problem.api";
import { CreateProblemRequestForm } from "@/types/forms/CreateProblemRequestForm";
import { testcaseParse } from "@/utilities/TestcaseFormat";
import TestcaseValidationAccordion from "../../TestcaseValidationAccordion";
import { Button } from "@/components/shadcn/Button";
import { Combobox } from "@/components/shadcn/Combobox";
import { Input } from "@/components/shadcn/Input";
import { Label } from "@/components/shadcn/Label";
import { Separator } from "@/components/shadcn/Seperator";
import { MONACO_EDITOR_OPTIONS } from "@/lib/fonts"

const SolutionSection = ({
	createRequest,
	setCreateRequest,
}: {
	createRequest: CreateProblemRequestForm;
	setCreateRequest: React.Dispatch<React.SetStateAction<CreateProblemRequestForm>>;
}) => {
	const [loading, setLoading] = useState(false);
	const [displayResult, setDisplayResult] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState<string>(createRequest.language ?? "");
	const [validationResult, setValidationResult] = useState<ValidateProgramResponse>();

	useEffect(() => {
		if (createRequest.language) setSelectedLanguage(createRequest.language);
	}, [createRequest.language]);

	const handleValidation = () => {
		if (!selectedLanguage) return;
		setLoading(true);
		ProblemService.validateProgram({
			source_code: createRequest.solution.replace(/\r\n/g, "\n"),
			testcases: testcaseParse(createRequest.testcases, createRequest.testcase_delimeter),
			time_limited: createRequest.time_limit,
			language: selectedLanguage,
		}).then((response) => {
			setValidationResult(response.data);
			setDisplayResult(true);
			setLoading(false);
		});
	};

	return (
		<div className="flex h-full gap-0 min-h-0">
			<div className="w-1/2 flex flex-col gap-3 overflow-y-auto pr-3">
				<div className="flex items-center justify-between">
					<Label className="text-base font-semibold">Solution</Label>
					<Combobox
						label="Select Language"
						options={ProgrammingLanguageOptions}
						onSelect={(value) => setCreateRequest({ ...createRequest, language: value })}
						value={selectedLanguage}
						setValue={setSelectedLanguage}
					/>
				</div>
				<div className="border rounded-lg overflow-hidden">
					<MonacoEditor
						theme="vs-dark"
						height="35vh"
						value={createRequest.solution}
						onChange={(e) => setCreateRequest({ ...createRequest, solution: String(e) })}
						language={createRequest.language}
						options={{ ...MONACO_EDITOR_OPTIONS, minimap: { enabled: false } }}
					/>
				</div>

				<div className="flex items-center justify-between">
					<Label className="text-base font-semibold">Testcases</Label>
					<div className="flex items-center gap-2">
						<Label className="text-sm text-muted-foreground">Delimiter</Label>
						<Input
							className="w-24"
							value={createRequest.testcase_delimeter}
							onChange={(e) => setCreateRequest({ ...createRequest, testcase_delimeter: e.target.value })}
						/>
					</div>
				</div>
				<div className="border rounded-lg overflow-hidden">
					<MonacoEditor
						value={createRequest.testcases}
						onChange={(e) => setCreateRequest({ ...createRequest, testcases: String(e) })}
						theme="vs-dark"
						height="30vh"
						defaultLanguage="plaintext"
						options={{ ...MONACO_EDITOR_OPTIONS, minimap: { enabled: false }, lineNumbers: "off" }}
					/>
				</div>
			</div>

			<Separator orientation="vertical" className="mx-3" />

			<div className="w-1/2 flex flex-col min-h-0">
				<Label className="text-base font-semibold mb-3">Validation Results</Label>
				<div className="flex-1 overflow-y-auto pr-1">
					{((displayResult && validationResult) || createRequest.validated_testcases) && (
						<TestcaseValidationAccordion
							problem={{ ...createRequest, testcases: [] }}
							runtimeResults={
								validationResult?.runtime_results
									? validationResult.runtime_results
									: createRequest.validated_testcases
							}
						/>
					)}
					{!displayResult && !createRequest.validated_testcases && (
						<div className="flex items-center justify-center h-40 text-sm text-muted-foreground border rounded-lg border-dashed">
							Run validation to see results
						</div>
					)}
				</div>
				<div className="flex justify-end pt-3">
					<Button disabled={loading || !selectedLanguage} onClick={handleValidation} className="px-10">
						{loading ? (
							<>
								<Loader2 className="animate-spin mr-2" size={16} />
								Validating...
							</>
						) : (
							"Run Validation"
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SolutionSection;

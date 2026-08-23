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

const Scoring = ({
	createRequest,
	setCreateRequest,
}: {
	createRequest: CreateProblemRequestForm;
	setCreateRequest: React.Dispatch<
		React.SetStateAction<CreateProblemRequestForm>
	>;
}) => {
	const [loading, setLoading] = useState(false);
	const [displayResult, setDisplayResult] = useState(false);

	const [selectedLanguage, setSelectedLanguage] = useState<string>("");

	const [validationResult, setValidationResult] =
		useState<ValidateProgramResponse>();

	const handleValidation = () => {
		setLoading(true);

		if (!selectedLanguage) {
			return;
		}

		ProblemService.validateProgram({
			source_code: createRequest.solution.replace(/\r\n/g, "\n"),
			testcases: testcaseParse(
				createRequest.testcases,
				createRequest.testcase_delimeter
			),
			time_limited: createRequest.time_limit,
			language: selectedLanguage,
		}).then((response) => {
			console.log(response.data);
			setValidationResult(response.data);
			setDisplayResult(true);
			setLoading(false);
		});
	};

	useEffect(() => {
		if (createRequest.language) {
			setSelectedLanguage(createRequest.language);
		}
	}, [createRequest]);

	return (
		<div className="flex h-[80vh]">
			<div className="w-1/2  overflow-y-scroll">
				<div className="flex justify-between mb-1">
					<div>
						<Label>Source Code</Label>
					</div>
					<div>
						<Combobox
							label="Select Language"
							options={ProgrammingLanguageOptions}
							onSelect={(value) =>
								setCreateRequest({
									...createRequest,
									language: value,
								})
							}
							// initialValue={selectedLanguage}
							value={selectedLanguage}
							setValue={setSelectedLanguage}
						/>
					</div>
				</div>
				<MonacoEditor
					theme="vs-dark"
					height="35vh"
					value={createRequest.solution}
					onChange={(e) =>
						setCreateRequest({
							...createRequest,
							solution: String(e),
						})
					}
					language={createRequest.language}
					options={MONACO_EDITOR_OPTIONS}
				/>

				<div className="my-1 flex justify-between items-center">
					<Label className="">Testcase</Label>
					<div className="flex w-1/2 items-center">
						<Label className="mr-3">
							Delimeter (For seperate each testcase)
						</Label>
						<Input
							className="w-1/2"
							value={createRequest.testcase_delimeter}
							onChange={(e) =>
								setCreateRequest({
									...createRequest,
									testcase_delimeter: e.target.value,
								})
							}
						/>
					</div>
				</div>
				<MonacoEditor
					value={createRequest.testcases}
					onChange={(e) =>
						setCreateRequest({
							...createRequest,
							testcases: String(e),
						})
					}
					theme="vs-dark"
					height="35vh"
					defaultLanguage="python"
					options={MONACO_EDITOR_OPTIONS}
				/>
			</div>
			<div className="">
				<Separator className="mx-2" orientation="vertical" />
			</div>

			<div className="w-1/2 grid content-between">
				<div className="pr-5 overflow-y-scroll h-[70vh]">
					{((displayResult && validationResult) ||
						createRequest.validated_testcases) && (
						<TestcaseValidationAccordion
							problem={{
								...createRequest,
								testcases: [],
							}}
							runtimeResults={
								validationResult?.runtime_results
									? validationResult.runtime_results
									: createRequest.validated_testcases
							}
						/>
					)}
				</div>
				<div className="flex justify-end">
					<Button
						disabled={loading}
						onClick={handleValidation}
						className="px-10"
					>
						{loading ? (
							<>
								<Loader2 className="animate-spin mr-2" />
								Validating
							</>
						) : (
							<>Validate</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Scoring;

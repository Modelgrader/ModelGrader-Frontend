import { Editor as MonacoEditor } from "@monaco-editor/react";
import { Loader2, Code, TestTube, Play, CheckCircle, AlertCircle } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

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

	const isMobile = useIsMobile();
	const hasValidation = (displayResult && validationResult) || createRequest.validated_testcases;

	return (
		<div className="space-y-6">
			{/* Solution Code Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Code className="w-5 h-5 text-primary" />
						Reference Solution
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<Label className="text-sm font-medium">
								Provide a working solution to validate against test cases
							</Label>
							<div className="flex-shrink-0">
								<Combobox
									label="Select Language"
									options={ProgrammingLanguageOptions}
									onSelect={(value) =>
										setCreateRequest({
											...createRequest,
											language: value,
										})
									}
									value={selectedLanguage}
									setValue={setSelectedLanguage}
								/>
							</div>
						</div>

						<div className="rounded-lg border overflow-hidden">
							<MonacoEditor
								theme="vs-dark"
								height={isMobile ? "300px" : "400px"}
								value={createRequest.solution}
								onChange={(e) =>
									setCreateRequest({
										...createRequest,
										solution: String(e),
									})
								}
								language={createRequest.language}
								options={{
									minimap: { enabled: !isMobile },
									fontSize: 14,
									lineNumbers: "on",
									roundedSelection: false,
									scrollBeyondLastLine: false,
									automaticLayout: true,
								}}
							/>
						</div>

						{createRequest.solution.trim() && (
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<CheckCircle className="w-4 h-4 text-green-500" />
								<span>Solution code ready for validation</span>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Test Cases Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TestTube className="w-5 h-5 text-primary" />
						Test Cases
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<Label className="text-sm font-medium">
								Define input/output test cases to validate solutions
							</Label>
							<div className="flex items-center gap-2">
								<Label className="text-sm">Delimiter:</Label>
								<Input
									className="w-24"
									value={createRequest.testcase_delimeter}
									onChange={(e) =>
										setCreateRequest({
											...createRequest,
											testcase_delimeter: e.target.value,
										})
									}
									placeholder="---"
								/>
							</div>
						</div>

						<div className="rounded-lg border overflow-hidden">
							<MonacoEditor
								theme="vs-dark"
								height={isMobile ? "300px" : "400px"}
								value={createRequest.testcases}
								onChange={(e) =>
									setCreateRequest({
										...createRequest,
										testcases: String(e),
									})
								}
								defaultLanguage="plaintext"
								options={{
									minimap: { enabled: !isMobile },
									fontSize: 14,
									lineNumbers: "on",
									wordWrap: "on",
									automaticLayout: true,
								}}
							/>
						</div>

						<div className="flex items-center justify-between">
							<div className="text-sm text-muted-foreground">
								Format: Input on first line, expected output on second line
							</div>
							{createRequest.testcases.trim() && (
								<Badge variant="outline" className="flex items-center gap-1">
									<TestTube className="w-3 h-3" />
									{createRequest.testcases.split(createRequest.testcase_delimeter).length} test cases
								</Badge>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Validation Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Play className="w-5 h-5 text-primary" />
						Solution Validation
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{!hasValidation ? (
							<div className="text-center py-8">
								<AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
								<p className="text-muted-foreground mb-4">
									Run validation to test your solution against the test cases
								</p>
								<Button
									disabled={loading || !selectedLanguage || !createRequest.solution.trim()}
									onClick={handleValidation}
									size="lg"
									className="gap-2"
								>
									{loading ? (
										<>
											<Loader2 className="animate-spin w-4 h-4" />
											Validating Solution...
										</>
									) : (
										<>
											<Play className="w-4 h-4" />
											Validate Solution
										</>
									)}
								</Button>
							</div>
						) : (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h3 className="font-medium">Validation Results</h3>
									<Button
										disabled={loading}
										onClick={handleValidation}
										variant="outline"
										size="sm"
										className="gap-2"
									>
										{loading ? (
											<Loader2 className="animate-spin w-4 h-4" />
										) : (
											<Play className="w-4 h-4" />
										)}
										Re-validate
									</Button>
								</div>

								<div className="max-h-[500px] overflow-y-auto">
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
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Scoring;

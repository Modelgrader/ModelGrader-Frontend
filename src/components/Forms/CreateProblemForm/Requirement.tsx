import React, { ReactNode, useEffect } from "react";
import { Clock, Code2, CheckSquare } from "lucide-react";
import { ProgrammingLanguageOptions } from "../../../constants/ProgrammingLanguage";
import { CreateProblemRequestForm } from "@/types/forms/CreateProblemRequestForm";
import { Checkbox } from "@/components/shadcn/Checkbox";
import { Input } from "@/components/shadcn/Input";
import { Label } from "@/components/shadcn/Label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AllowedLanguageCheckbox = ({
	children,
	checked = false,
	onClick = () => {},
}: {
	children: ReactNode;
	checked?: boolean;
	onClick?: () => void;
}) => {
	return (
		<div 
			className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
				checked ? 'bg-primary/5 border-primary' : 'border-border'
			}`}
			onClick={onClick}
		>
			<Checkbox checked={checked} />
			<span className={`text-sm font-medium ${checked ? 'text-primary' : 'text-foreground'}`}>
				{children}
			</span>
		</div>
	);
};

const Requirement = ({
	createRequest,
	setCreateRequest,
}: {
	createRequest: CreateProblemRequestForm;
	setCreateRequest: React.Dispatch<
		React.SetStateAction<CreateProblemRequestForm>
	>;
}) => {
	const hasSelectedAllLanguage = () => {
		return (
			createRequest.allowedLanguage.filter((lang) => lang !== "")
				.length === ProgrammingLanguageOptions.length
		);
	};

	const handleAllOption = () => {
		if (hasSelectedAllLanguage()) {
			setCreateRequest({
				...createRequest,
				allowedLanguage: [],
			});
		} else {
			setCreateRequest({
				...createRequest,
				allowedLanguage: ProgrammingLanguageOptions.map(
					(proLang) => proLang.value
				),
			});
		}
	};

	const handleOnClick = (language: string) => {
		if (createRequest.allowedLanguage.includes(language)) {
			setCreateRequest({
				...createRequest,
				allowedLanguage: createRequest.allowedLanguage.filter(
					(lang) => lang !== language
				),
			});
		} else {
			setCreateRequest({
				...createRequest,
				allowedLanguage: [...createRequest.allowedLanguage, language],
			});
		}
	};

	useEffect(() => {
		console.log(createRequest);
	}, [createRequest]);

	return (
		<div className="space-y-6">
			{/* Time Limit Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Clock className="w-5 h-5 text-primary" />
						Execution Time Limit
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<Label htmlFor="time-limit" className="text-sm font-medium">
							Maximum execution time allowed (seconds)
						</Label>
						<div className="flex items-center gap-3">
							<Input
								id="time-limit"
								type="number"
								min="1"
								max="60"
								value={createRequest.time_limit}
								onChange={(e) =>
									setCreateRequest({
										...createRequest,
										time_limit: Number(e.target.value),
									})
								}
								className="w-32"
							/>
							<span className="text-sm text-muted-foreground">seconds</span>
						</div>
						<p className="text-xs text-muted-foreground">
							Recommended: 1-10 seconds for most problems
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Programming Languages Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Code2 className="w-5 h-5 text-primary" />
						Allowed Programming Languages
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Label className="text-sm font-medium">
								Select which languages students can use
							</Label>
							<Badge variant="outline" className="flex items-center gap-1">
								<CheckSquare className="w-3 h-3" />
								{createRequest.allowedLanguage.filter(lang => lang !== "").length} selected
							</Badge>
						</div>

						{/* Select All Option */}
						<div className="border-b pb-4">
							<AllowedLanguageCheckbox
								checked={hasSelectedAllLanguage()}
								onClick={handleAllOption}
							>
								<span className="font-semibold">All Languages</span>
							</AllowedLanguageCheckbox>
						</div>

						{/* Individual Language Options */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
							{ProgrammingLanguageOptions.map((proLang, index) => (
								<AllowedLanguageCheckbox
									key={index}
									checked={createRequest.allowedLanguage.includes(proLang.value)}
									onClick={() => handleOnClick(proLang.value)}
								>
									{proLang.label}
								</AllowedLanguageCheckbox>
							))}
						</div>

						{createRequest.allowedLanguage.length === 0 && (
							<div className="text-center py-4 text-muted-foreground">
								<Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
								<p className="text-sm">No languages selected</p>
								<p className="text-xs">Students won't be able to submit solutions</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Requirement;

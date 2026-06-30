import React from "react";
import { ProgrammingLanguageOptions } from "../../../constants/ProgrammingLanguage";
import { CreateProblemRequestForm } from "@/types/forms/CreateProblemRequestForm";
import { Checkbox } from "@/components/shadcn/Checkbox";
import { Input } from "@/components/shadcn/Input";
import { Label } from "@/components/shadcn/Label";
import { Separator } from "@/components/shadcn/Seperator";

const RequirementSection = ({
	createRequest,
	setCreateRequest,
}: {
	createRequest: CreateProblemRequestForm;
	setCreateRequest: React.Dispatch<React.SetStateAction<CreateProblemRequestForm>>;
}) => {
	const hasSelectedAll = () =>
		createRequest.allowedLanguage.filter((l) => l !== "").length === ProgrammingLanguageOptions.length;

	const handleToggleAll = () => {
		setCreateRequest({
			...createRequest,
			allowedLanguage: hasSelectedAll() ? [] : ProgrammingLanguageOptions.map((l) => l.value),
		});
	};

	const handleToggleLanguage = (language: string) => {
		setCreateRequest({
			...createRequest,
			allowedLanguage: createRequest.allowedLanguage.includes(language)
				? createRequest.allowedLanguage.filter((l) => l !== language)
				: [...createRequest.allowedLanguage, language],
		});
	};

	return (
		<div className="flex flex-col gap-6 max-w-lg">
			<div className="flex flex-col gap-2">
				<Label className="text-base font-semibold">Time Limit</Label>
				<div className="flex items-center gap-2">
					<Input
						type="number"
						className="w-32"
						value={createRequest.time_limit}
						onChange={(e) => setCreateRequest({ ...createRequest, time_limit: Number(e.target.value) })}
					/>
					<span className="text-sm text-muted-foreground">seconds</span>
				</div>
			</div>

			<Separator />

			<div className="flex flex-col gap-3">
				<Label className="text-base font-semibold">Allowed Languages</Label>
				<div className="flex items-center gap-2">
					<Checkbox checked={hasSelectedAll()} onClick={handleToggleAll} id="lang-all" />
					<label htmlFor="lang-all" className="text-sm cursor-pointer select-none">
						Select All
					</label>
				</div>
				<div className="grid grid-cols-2 gap-y-2 gap-x-6">
					{ProgrammingLanguageOptions.map((lang) => (
						<div key={lang.value} className="flex items-center gap-2">
							<Checkbox
								id={`lang-${lang.value}`}
								checked={createRequest.allowedLanguage.includes(lang.value)}
								onClick={() => handleToggleLanguage(lang.value)}
							/>
							<label htmlFor={`lang-${lang.value}`} className="text-sm cursor-pointer select-none">
								{lang.label}
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RequirementSection;

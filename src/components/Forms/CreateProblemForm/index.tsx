import { ArrowLeft, FileText, Code2, Settings2, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateProblemRequestForm } from "@/types/forms/CreateProblemRequestForm";
import { TestcaseModel } from "@/types/models/Problem.model";
import { Input } from "@/components/shadcn/Input";
import { Separator } from "@/components/shadcn/Seperator";
import { cn } from "@/lib/utils";
import FormSaveButton from "../FormSaveButton";
import DescriptionSection from "./DescriptionSection";
import SolutionSection from "./SolutionSection";
import RequirementSection from "./RequirementSection";
import PermissionsSection from "./PermissionsSection";

type SectionId = "description" | "solution" | "requirement" | "permissions";

const NavItems: { id: SectionId; label: string; icon: React.ReactNode }[] = [
	{ id: "description", label: "Description", icon: <FileText size={16} /> },
	{ id: "solution", label: "Solution & Testcases", icon: <Code2 size={16} /> },
	{ id: "requirement", label: "Requirement", icon: <Settings2 size={16} /> },
	{ id: "permissions", label: "Permissions", icon: <Users size={16} /> },
];

export type OnProblemSaveCallback = (
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	createRequest: CreateProblemRequestForm
) => void;

const CreateProblemForm = ({
	createRequestInitialValue,
	onProblemSave,
	validatedTestcases = [],
}: {
	createRequestInitialValue: CreateProblemRequestForm;
	onProblemSave: OnProblemSaveCallback;
	validatedTestcases?: TestcaseModel[];
}) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [activeSection, setActiveSection] = useState<SectionId>("description");
	const [createRequest, setCreateRequest] = useState<CreateProblemRequestForm>(createRequestInitialValue);

	useEffect(() => {
		if (validatedTestcases.length !== 0) {
			setCreateRequest((prev) => ({ ...prev, validated_testcases: validatedTestcases }));
		}
	}, [validatedTestcases]);

	const handleSave = () => onProblemSave(setLoading, createRequest);

	return (
		<div className="flex h-full overflow-hidden">
			{/* Sidebar */}
			<aside className="w-56 flex-shrink-0 border-r flex flex-col bg-muted/30">
				{/* Back + Title */}
				<div className="p-4 flex flex-col gap-3">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
					>
						<ArrowLeft size={16} />
						Back
					</button>
					<Input
						value={createRequest.title}
						onChange={(e) => setCreateRequest({ ...createRequest, title: e.target.value })}
						placeholder="Problem title..."
						className="text-sm font-medium"
					/>
				</div>

				<Separator />

				{/* Nav */}
				<nav className="flex-1 p-2 flex flex-col gap-1">
					{NavItems.map((item) => (
						<button
							key={item.id}
							onClick={() => setActiveSection(item.id)}
							className={cn(
								"flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-left w-full",
								activeSection === item.id
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							)}
						>
							{item.icon}
							{item.label}
						</button>
					))}
				</nav>

				<Separator />

				{/* Save */}
				<div className="p-3">
					<FormSaveButton disabled={loading} onClick={handleSave} />
				</div>
			</aside>

			{/* Content Panel */}
			<main className="flex-1 flex flex-col overflow-hidden">
				<div className="px-6 py-4 border-b flex items-center gap-2">
					{NavItems.find((n) => n.id === activeSection)?.icon}
					<h2 className="font-semibold text-base">
						{NavItems.find((n) => n.id === activeSection)?.label}
					</h2>
				</div>

				<div className="flex-1 overflow-auto p-6">
					{activeSection === "description" && (
						<div className="h-full flex flex-col">
							<DescriptionSection
								createRequest={createRequest}
								setCreateRequest={setCreateRequest}
							/>
						</div>
					)}
					{activeSection === "solution" && (
						<div className="h-full">
							<SolutionSection
								createRequest={createRequest}
								setCreateRequest={setCreateRequest}
							/>
						</div>
					)}
					{activeSection === "requirement" && (
						<RequirementSection
							createRequest={createRequest}
							setCreateRequest={setCreateRequest}
						/>
					)}
					{activeSection === "permissions" && (
						<PermissionsSection
							createRequest={createRequest}
							setCreateRequest={setCreateRequest}
						/>
					)}
				</div>
			</main>
		</div>
	);
};

export default CreateProblemForm;

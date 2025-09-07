import { ArrowLeft, FileText, Settings, Code, Users, Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CreateProblemRequestForm } from "@/types/forms/CreateProblemRequestForm";
import { TestcaseModel } from "@/types/models/Problem.model";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/Tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import FormSaveButton from "../FormSaveButton";
import GeneralDetail from "./GeneralDetail";
import ManageGroups from "./ManageGroups";
import Requirement from "./Requirement";
import Scoring from "./Scoring";

const TabList = [
	{
		value: "general",
		label: "General Detail",
		icon: FileText,
		description: "Basic problem information"
	},
	{
		value: "scoring",
		label: "Scoring",
		icon: Code,
		description: "Solution and test cases"
	},
	{
		value: "requirement",
		label: "Requirements",
		icon: Settings,
		description: "Language and time limits"
	},
	{
		value: "groups",
		label: "Permissions",
		icon: Users,
		description: "Group access control"
	},
];

export type OnProblemSaveCallback = (
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	// problemid: string,
	// setProblemId: React.Dispatch<React.SetStateAction<number>>,
	createRequest: CreateProblemRequestForm
) => void;

/**
 * Modern Create Problem Form with Responsive Design
 * 
 * Features:
 * - Mobile-first responsive layout
 * - Enhanced tab navigation with icons
 * - Progress indicators and visual feedback
 * - Modern card-based content organization
 * - Accessible form controls
 */
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
	const isMobile = useIsMobile();

	const [loading, setLoading] = useState(false);
	const [currentForm, setCurrentForm] = useSearchParams();
	const [createRequest, setCreateRequest] = useState<CreateProblemRequestForm>(createRequestInitialValue);

	const currentSection = currentForm.get("section") || "general";
	const currentTab = TabList.find(tab => tab.value === currentSection) || TabList[0];

	const handleSave = () => {
		onProblemSave(setLoading, createRequest);
	};

	const getRequiredFieldsStatus = () => {
		const requirements = [
			{
				id: 'title',
				label: 'Problem Title',
				completed: createRequest.title.trim().length > 0,
				description: 'A clear title for your problem'
			},
			{
				id: 'solution',
				label: 'Source Code',
				completed: createRequest.solution.trim().length > 0,
				description: 'Working solution code'
			},
			{
				id: 'testcases',
				label: 'Test Cases',
				completed: createRequest.testcases.trim().length > 0,
				description: 'Input/output test cases'
			}
		];
		
		const completedCount = requirements.filter(req => req.completed).length;
		const isReady = completedCount === requirements.length;
		
		return { requirements, completedCount, total: requirements.length, isReady };
	};

	const fieldStatus = getRequiredFieldsStatus();

	useEffect(() => {
		if (validatedTestcases.length !== 0) {
			setCreateRequest(prev => ({
				...prev,
				validated_testcases: validatedTestcases,
			}));
		}
	}, [validatedTestcases]);

	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
			{/* Header Section */}
			<div className="mb-6 sm:mb-8">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-3">
							<button
								onClick={() => navigate(-1)}
								className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition-colors"
								aria-label="Go back"
							>
								<ArrowLeft size={24} className="text-muted-foreground" />
							</button>
							<div className="min-w-0 flex-1">
								<h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight line-clamp-2">
									{createRequest.title || "Create New Problem"}
								</h1>
								<div className="flex items-center gap-3 mt-2">
									<Badge 
										variant={fieldStatus.isReady ? "default" : "secondary"} 
										className="flex items-center gap-1"
									>
										{fieldStatus.isReady ? (
											<Check className="w-3 h-3" />
										) : (
											<X className="w-3 h-3" />
										)}
										{fieldStatus.completedCount}/{fieldStatus.total} required fields
									</Badge>
									{fieldStatus.isReady && (
										<span className="text-sm text-green-600 font-medium">
											Ready to publish
										</span>
									)}
								</div>
							</div>
						</div>
						
						{/* Required Fields Counter */}
						{!fieldStatus.isReady && (
							<div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-dashed">
								<span className="text-sm text-muted-foreground">
									Complete all required fields to publish your problem
								</span>
								<Badge variant="secondary" className="flex items-center gap-1">
									<X className="w-3 h-3" />
									{fieldStatus.completedCount}/{fieldStatus.total} required
								</Badge>
							</div>
						)}
					</div>

					{/* Desktop Save Button */}
					{!isMobile && (
						<div className="flex-shrink-0 flex flex-col gap-2">
							<FormSaveButton
								disabled={loading}
								onClick={handleSave}
							/>
							<span className="text-xs text-muted-foreground text-center">
								{fieldStatus.isReady ? 'Publish Problem' : 'Save Progress'}
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Navigation & Content */}
			<div className="grid gap-4 lg:gap-6">
				{/* Tab Navigation */}
				<Card className="p-1">
					<Tabs value={currentSection} className="w-full">
					<TabsList className="grid w-full grid-cols-4 gap-1">
							{TabList.map((tab) => {
								const Icon = tab.icon;
								return (
									<TabsTrigger
										key={tab.value}
										value={tab.value}
										onClick={() => setCurrentForm({section: tab.value})}
										// Make text green on selected
										className="flex flex-row gap-1 py-2 h-auto data-[state=active]:text-green-600"
									>
											
										<Icon className="w-4 h-4" />
										<span className="text-xs font-medium">{tab.label}</span>
									</TabsTrigger>
								);
							})}
						</TabsList>
					</Tabs>
				</Card>

				{/* Current Section Header */}
				<Card className="p-4">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-primary/10">
							<currentTab.icon className="w-5 h-5 text-primary" />
						</div>
						<div>
							<h2 className="text-xl font-semibold">{currentTab.label}</h2>
							<p className="text-sm text-muted-foreground">{currentTab.description}</p>
						</div>
					</div>
				</Card>

				{/* Form Content */}
				<Card>
					<CardContent className="p-6 sm:p-8">
						{(!currentSection || currentSection === "general") && (
							<GeneralDetail
								createRequest={createRequest}
								setCreateRequest={setCreateRequest}
							/>
						)}
						{currentSection === "scoring" && (
							<Scoring
								createRequest={createRequest}
								setCreateRequest={setCreateRequest}
							/>
						)}
						{currentSection === "requirement" && (
							<Requirement
								createRequest={createRequest}
								setCreateRequest={setCreateRequest}
							/>
						)}
						{currentSection === "groups" && (
							<ManageGroups
								createRequest={createRequest}
								setCreateRequest={setCreateRequest}
							/>
						)}
					</CardContent>
				</Card>

				{/* Mobile Save Button */}
				{isMobile && (
					<div className="sticky bottom-4 z-10">
						<div className="w-full space-y-2">
							<FormSaveButton
								disabled={loading}
								onClick={handleSave}
							/>
							<p className="text-xs text-muted-foreground text-center">
								{fieldStatus.isReady ? 'Publish Problem' : 'Save Progress'}
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CreateProblemForm;

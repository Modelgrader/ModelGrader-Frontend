import { Editor as MonacoEditor } from "@monaco-editor/react";
import React from "react";
import { CreateProblemRequestForm, DescriptionMode } from "@/types/forms/CreateProblemRequestForm";
import { PlateEditorValueType } from "@/types/PlateEditorValueType";
import DetailPlateEditor from "../../DetailPlateEditor";
import { Label } from "@/components/shadcn/Label";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/Tabs";
import ReactMarkdown from "react-markdown";

const DescriptionSection = ({
	createRequest,
	setCreateRequest,
}: {
	createRequest: CreateProblemRequestForm;
	setCreateRequest: React.Dispatch<React.SetStateAction<CreateProblemRequestForm>>;
}) => {
	const currentMode: DescriptionMode = createRequest.description.mode;

	const handleModeChange = (mode: DescriptionMode) => {
		if (mode === currentMode) return;
		if (mode === "markdown") {
			setCreateRequest({ ...createRequest, description: { mode: "markdown", content: "" } });
		} else {
			setCreateRequest({ ...createRequest, description: { mode: "plate", content: [] as PlateEditorValueType } });
		}
	};

	const handlePlateChange = (value: PlateEditorValueType) => {
		setCreateRequest({ ...createRequest, description: { mode: "plate", content: value } });
	};

	const handleMarkdownChange = (value: string | undefined) => {
		setCreateRequest({ ...createRequest, description: { mode: "markdown", content: value ?? "" } });
	};

	return (
		<div className="flex flex-col h-full gap-3">
			<div className="flex items-center justify-between">
				<Label className="text-base font-semibold">Description</Label>
				<Tabs value={currentMode} onValueChange={(v) => handleModeChange(v as DescriptionMode)}>
					<TabsList>
						<TabsTrigger value="markdown">Markdown</TabsTrigger>
						<TabsTrigger value="plate">Rich Text (Plate.js)</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{currentMode === "markdown" ? (
				<div className="flex flex-1 gap-0 border rounded-lg overflow-hidden min-h-0">
					<div className="w-1/2 border-r">
						<MonacoEditor
							theme="vs-dark"
							height="100%"
							defaultLanguage="markdown"
							value={createRequest.description.content as string}
							onChange={handleMarkdownChange}
							options={{ minimap: { enabled: false }, wordWrap: "on", lineNumbers: "off" }}
						/>
					</div>
					<div className="w-1/2 p-4 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
						<ReactMarkdown>{createRequest.description.content as string}</ReactMarkdown>
					</div>
				</div>
			) : (
				<div className="flex-1 border rounded-lg overflow-hidden bg-background shadow min-h-0">
					<DetailPlateEditor
						value={createRequest.description.content as PlateEditorValueType}
						onChange={handlePlateChange}
					/>
				</div>
			)}
		</div>
	);
};

export default DescriptionSection;

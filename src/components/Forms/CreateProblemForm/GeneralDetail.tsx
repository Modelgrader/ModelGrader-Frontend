import React, { useEffect } from 'react';
import { FileText, Edit3 } from 'lucide-react';
import { PlateEditorValueType } from '@/types/PlateEditorValueType';
import { CreateProblemRequestForm } from '@/types/forms/CreateProblemRequestForm';
import DetailPlateEditor from '../../DetailPlateEditor';
import { Input } from '@/components/shadcn/Input';
import { Label } from '@/components/shadcn/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GeneralDetail = ({
	createRequest,
	setCreateRequest,
}: {
	createRequest: CreateProblemRequestForm;
	setCreateRequest: React.Dispatch<React.SetStateAction<CreateProblemRequestForm>>;
}) => {
	const handleEditorChange = (value: PlateEditorValueType) => {
		setCreateRequest({ ...createRequest, description: value });
	};

	useEffect(() => {
		console.log("General Detail", createRequest);
	}, [createRequest]);

	return (
		<div className="space-y-6">
			{/* Problem Title Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="w-5 h-5 text-primary" />
						Problem Title
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Label htmlFor="problem-title" className="text-sm font-medium">
							Enter a clear and descriptive title for your problem
						</Label>
						<Input
							id="problem-title"
							value={createRequest.title}
							onChange={(e) =>
								setCreateRequest({
									...createRequest,
									title: e.target.value,
								})
							}
							type="text"
							placeholder="e.g., Two Sum Algorithm"
							className="text-lg font-medium"
						/>
						<p className="text-xs text-muted-foreground">
							{createRequest.title.length}/100 characters
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Problem Description Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Edit3 className="w-5 h-5 text-primary" />
						Problem Instructions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<Label className="text-sm font-medium">
							Provide a detailed description of the problem, including:
						</Label>
						<ul className="text-xs text-muted-foreground space-y-1 ml-4">
							<li>• Problem statement and context</li>
							<li>• Input and output specifications</li>
							<li>• Examples with explanations</li>
							<li>• Constraints and edge cases</li>
						</ul>
						
						<div className="rounded-lg border bg-background shadow-sm min-h-[300px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all">
							<DetailPlateEditor
								value={createRequest.description}
								onChange={handleEditorChange}
							/>
						</div>
						
						<div className="flex justify-between items-center text-xs text-muted-foreground">
							<span>Use the toolbar above to format your content</span>
							<span>Auto-saved</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default GeneralDetail;
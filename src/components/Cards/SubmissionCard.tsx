import { FileSpreadsheet, LibraryBig, StepForward, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SubmissionPopulateSubmissionTestcaseAndProblemSecureModel } from "@/types/models/Submission.model";
import { readableDateFormat } from "@/utilities/ReadableDateFormat";
import TestcasesGradingIndicator from "../TestcasesGradingIndicator";
import { Button } from "@/components/shadcn/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SubmissionCard = ({
	submission,
}: {
	submission: SubmissionPopulateSubmissionTestcaseAndProblemSecureModel;
}) => {
	const navigate = useNavigate();

	const handleNavigateProblem = () => {
		if (submission.topic) {
			navigate(`/courses/${submission.topic.topic_id}/problems/${submission.problem.problem_id}`);
		} else {
			navigate(`/problems/${submission.problem.problem_id}`);
		}
	};

	// Calculate submission status
	const getSubmissionStatus = () => {
		if (!submission.runtime_output || submission.runtime_output.length === 0) {
			return { status: 'pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
		}

		const passed = submission.runtime_output.filter(tc => tc.is_passed).length;
		const total = submission.runtime_output.length;
		const percentage = (passed / total) * 100;

		if (percentage === 100) {
			return { status: 'passed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
		} else if (percentage >= 50) {
			return { status: 'partial', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' };
		} else {
			return { status: 'failed', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'passed':
				return <CheckCircle className="w-4 h-4" />;
			case 'failed':
			case 'partial':
				return <XCircle className="w-4 h-4" />;
			default:
				return <Clock className="w-4 h-4" />;
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'passed':
				return 'Completed';
			case 'partial':
				return 'Partial';
			case 'failed':
				return 'Failed';
			default:
				return 'Pending';
		}
	};

	const submissionStatus = getSubmissionStatus();
	const passed = submission.runtime_output?.filter(tc => tc.is_passed).length || 0;
	const total = submission.runtime_output?.length || 0;

	return (
		<Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20">
			<CardHeader className="pb-3">
				<div className="flex items-start gap-3">
					<div className="flex-shrink-0">
						<div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
							<FileSpreadsheet 
								size={24} 
								className="text-blue-600 dark:text-blue-400" 
							/>
						</div>
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
							{submission.problem.title}
						</h3>
						{submission.topic && (
							<div className="flex items-center text-sm text-muted-foreground mt-1">
								<LibraryBig size={16} className="mr-1 text-purple-500" />
								<span className="line-clamp-1">{submission.topic.name}</span>
							</div>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex-1 py-3">
				<div className="space-y-4">
					{/* Submission Status */}
					<div className="flex items-center justify-between">
						<Badge className={`${submissionStatus.color} border-0`}>
							{getStatusIcon(submissionStatus.status)}
							<span className="ml-1">{getStatusText(submissionStatus.status)}</span>
						</Badge>
						{total > 0 && (
							<span className="text-sm text-muted-foreground">
								{passed}/{total}
							</span>
						)}
					</div>

					{/* Test Cases Indicator */}
					{submission.runtime_output && submission.runtime_output.length > 0 && (
						<div className="space-y-2">
							<p className="text-sm font-medium text-muted-foreground">Test Results</p>
							<TestcasesGradingIndicator
								sizeX={1.5}
								sizeY={2}
								submissionTestcases={submission.runtime_output}
								testcaseGradingResultClassName="rounded-[20%]"
							/>
						</div>
					)}

					{/* Submission Date */}
					<div className="flex items-center text-sm text-muted-foreground">
						<Calendar className="w-4 h-4 mr-2" />
						<span>{readableDateFormat(submission.date)}</span>
					</div>
				</div>
			</CardContent>

			<CardFooter className="pt-3">
				<Button 
					onClick={handleNavigateProblem}
					className="w-full"
					size="sm"
					variant={submissionStatus.status === 'passed' ? 'outline' : 'default'}
				>
					<StepForward className="mr-2 h-4 w-4" />
					{submissionStatus.status === 'passed' ? 'Review Solution' : 'Continue Working'}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default SubmissionCard;

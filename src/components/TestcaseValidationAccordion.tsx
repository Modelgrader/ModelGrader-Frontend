import { Eye, EyeOff, FileDown } from "lucide-react";
import { RuntimeResult } from "@/types/apis/Problem.api";
import { TestcaseModel } from "@/types/models/Problem.model";
import { convertToSnakeCase } from "@/utilities/String";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "./shadcn/Accordion";
import { Badge } from "./shadcn/Badge";
import { Label } from "./shadcn/Label";
import { Switch } from "./shadcn/Switch";
import RuntimeOutputTextarea from "./Textareas/RuntimeOutputTextarea";

const minimizer = (text: string | null): string => {
	const LIMIT = 250;

	if (!text) return "";

	if (text.length > LIMIT) {
		return text.slice(0, LIMIT) + ` ... (${text.length - LIMIT} more)`;
	}
	return text;
};

const DownloadMiniButton = ({
	...args
}: {
	className?: string;
	onClick?: React.MouseEventHandler<HTMLParagraphElement>;
}) => {
	return (
		<p
			className="flex items-center cursor-pointer hover:text-green-500"
			{...args}
		>
			<FileDown size={16} className="mr-1" /> Download
		</p>
	);
};

const TestcaseValidationInstance = ({
	problem,
	value,
	inputValue,
	outputValue,
	expectedOutputValue,
	status,
	index,
	isShown,
	onToggleShown,
}: {
	problem: {
		title: string;
	};
	value: string;
	inputValue: string;
	outputValue: string | null;
	expectedOutputValue: string | null;
	status: string;
	index: number;
	isShown?: boolean;
	onToggleShown?: (index: number, shown: boolean) => void;
}) => {
	// const [inputValue, setInputValue] = useState("1 2 3");
	// const [outputValue, setOutputValue] = useState("Hello World!");

	// useEffect(() => {
	// 	console.log(inputValue, outputValue, status);
	// }, [outputValue]);

	const downloadTextfile = (type: string, text: string | null) => {
		if (!text) return;

		const element = document.createElement("a");
		const file = new Blob([text], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = `${convertToSnakeCase(problem.title)}_${type}_${
			index + 1
		}.txt`;
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	};

	return (
		<AccordionItem value={value}>
			<div className="flex items-center gap-3">
				<div className="flex-1 min-w-0">
					<AccordionTrigger>
						Testcase #{value}
						{status === "OK" ? (
							<Badge className="bg-green-500">OK</Badge>
						) : status === "ERROR" ? (
							<Badge className="bg-gray-500">ERROR</Badge>
						) : status === "TIMEOUT" ? (
							<Badge className="bg-yellow-400">TIMEOUT</Badge>
						) : (
							<Badge className="bg-red-400">FAILED</Badge>
						)}
					</AccordionTrigger>
				</div>
				{onToggleShown && (
					<div className="flex items-center gap-2 shrink-0 pl-3">
						<Label
							htmlFor={`testcase-shown-${index}`}
							className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer"
						>
							{isShown ? (
								<Eye size={14} className="text-green-500" />
							) : (
								<EyeOff size={14} />
							)}
							Show
						</Label>
						<Switch
							id={`testcase-shown-${index}`}
							checked={Boolean(isShown)}
							onCheckedChange={(checked) =>
								onToggleShown(index, checked)
							}
						/>
					</div>
				)}
			</div>
			<AccordionContent>
				<div className="ml-2">
					<div className="gap-5 px-1 flex">
						<div className="w-1/2">
							<div className="flex justify-between">
								<Label>Input</Label>
								<DownloadMiniButton
									onClick={() =>
										downloadTextfile("input", inputValue)
									}
								/>
							</div>
							<RuntimeOutputTextarea
								className="mt-1 font-mono cursor-pointer"
								// value={inputValue}
								value={minimizer(inputValue)}
								onClick={() =>
									navigator.clipboard.writeText(
										inputValue ?? ""
									)
								}
							/>
						</div>
						<div className="w-1/2"></div>
					</div>
					<div className="flex gap-5 mt-3">
						<div className="w-1/2">
							<div className="flex justify-between">
								<Label>Output</Label>
								<DownloadMiniButton
									onClick={() =>
										downloadTextfile("output", outputValue)
									}
								/>
							</div>
							<RuntimeOutputTextarea
								className="mt-1 font-mono cursor-pointer"
								value={minimizer(outputValue)}
								compareValue={minimizer(expectedOutputValue)}
								onClick={() =>
									navigator.clipboard.writeText(
										outputValue ?? ""
									)
								}
							/>
						</div>
						{expectedOutputValue && (
							<div className="w-1/2">
								<div className="flex justify-between">
									<Label>Expected Output</Label>
									<DownloadMiniButton
										onClick={() =>
											downloadTextfile(
												"expected_output",
												expectedOutputValue
											)
										}
									/>
								</div>
								<RuntimeOutputTextarea
									className="mt-1 font-mono cursor-pointer"
									// value={minimizer(outputValue)}
									value={minimizer(expectedOutputValue)}
									compareValue={minimizer(outputValue)}
									onClick={() =>
										navigator.clipboard.writeText(
											expectedOutputValue ?? ""
										)
									}
								/>
							</div>
						)}
					</div>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};

const TestcaseValidationAccordian = ({
	problem,
	runtimeResults = [],
	shownIndexes,
	onToggleShown,
}: {
	problem: {
		title: string;
		testcases: TestcaseModel[];
	};
	runtimeResults?: RuntimeResult[] | TestcaseModel[];
	/** Pass together with `onToggleShown` to render the per-testcase visibility switch. */
	shownIndexes?: number[];
	onToggleShown?: (index: number, shown: boolean) => void;
}) => {
	return (
		<Accordion type="multiple">
			{runtimeResults?.map((result, index) => (
				<TestcaseValidationInstance
					index={index}
					problem={problem}
					key={index}
					value={String(index + 1)}
					inputValue={result.input}
					outputValue={result.output}
					expectedOutputValue={
						problem.testcases[index]
							? problem.testcases[index].output
							: null
					}
					status={
						result.runtime_status ? result.runtime_status : "OK"
					}
					isShown={shownIndexes?.includes(index)}
					onToggleShown={onToggleShown}
				/>
			))}
		</Accordion>
	);
};

export default TestcaseValidationAccordian;

import { Check, Clipboard, FileDown, ListChecks } from "lucide-react";
import { useState } from "react";
import { ShownTestcaseModel } from "@/types/models/Problem.model";
import { convertToSnakeCase } from "@/utilities/String";
import { Card } from "./shadcn/Card";

const downloadTextFile = (filename: string, text: string) => {
	const element = document.createElement("a");
	const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
	element.href = url;
	element.download = filename;
	document.body.appendChild(element); // Required for this to work in FireFox
	element.click();
	document.body.removeChild(element);
	URL.revokeObjectURL(url);
};

const IconAction = ({
	onClick,
	children,
	title,
}: {
	onClick: () => void;
	children: React.ReactNode;
	title: string;
}) => (
	<button
		type="button"
		title={title}
		onClick={onClick}
		className="flex items-center gap-1 text-xs text-muted-foreground hover:text-green-600 transition-colors"
	>
		{children}
	</button>
);

const TestcaseIOBlock = ({
	label,
	value,
	filename,
}: {
	label: string;
	value: string;
	filename: string;
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex-1 min-w-0">
			<div className="flex items-center justify-between mb-1">
				<span className="text-sm font-semibold">{label}</span>
				<div className="flex items-center gap-3">
					<IconAction onClick={handleCopy} title={`Copy ${label}`}>
						{copied ? (
							<>
								<Check size={14} className="text-green-600" />
								Copied
							</>
						) : (
							<>
								<Clipboard size={14} />
								Copy
							</>
						)}
					</IconAction>
					<IconAction
						onClick={() => downloadTextFile(filename, value)}
						title={`Download ${label} as .txt`}
					>
						<FileDown size={14} />
						.txt
					</IconAction>
				</div>
			</div>
			<Card className="px-3 py-2 min-h-[64px] max-h-56 overflow-auto">
				<pre className="font-mono text-sm whitespace-pre-wrap break-words">
					{value}
				</pre>
			</Card>
		</div>
	);
};

const SampleTestcasesSection = ({
	problemTitle,
	testcases,
}: {
	problemTitle: string;
	testcases: ShownTestcaseModel[];
}) => {
	if (!testcases || testcases.length === 0) return null;

	const filePrefix = convertToSnakeCase(problemTitle || "problem");

	return (
		<div className="mt-6">
			<div className="flex items-center gap-2 mb-3">
				<ListChecks size={18} className="text-green-600" />
				<h3 className="text-lg font-bold">Sample Testcases</h3>
				<span className="text-sm text-muted-foreground">
					({testcases.length})
				</span>
			</div>

			<div className="flex flex-col gap-4">
				{testcases.map((testcase, index) => (
					<div
						key={testcase.testcase_id}
						className="border rounded-lg p-3"
					>
						<div className="text-sm font-semibold text-muted-foreground mb-2">
							Testcase #{index + 1}
						</div>
						<div className="flex flex-col md:flex-row gap-4">
							<TestcaseIOBlock
								label="Input"
								value={testcase.input ?? ""}
								filename={`${filePrefix}_input_${index + 1}.txt`}
							/>
							<TestcaseIOBlock
								label="Output"
								value={testcase.output ?? ""}
								filename={`${filePrefix}_output_${index + 1}.txt`}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SampleTestcasesSection;

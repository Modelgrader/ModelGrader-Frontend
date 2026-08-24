import { CheckCircle2, FileSpreadsheet, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@/components/ui/command";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarCollection, flattenSidebarProblems } from "@/utilities/CourseSidebar";

const ProblemQuickJump = ({
	courseId,
	collections,
}: {
	courseId: string;
	collections: SidebarCollection[];
}) => {
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				setIsOpen((open) => !open);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const problems = flattenSidebarProblems(collections);

	const goToProblem = (problemId: string) => {
		setIsOpen(false);
		navigate(`/courses/${courseId}/problems/${problemId}`);
	};

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						tooltip="ค้นหาโจทย์ (Ctrl+K)"
						onClick={() => setIsOpen(true)}
					>
						<Search />
						<span className="truncate text-muted-foreground">ค้นหาโจทย์</span>
						<CommandShortcut className="ml-auto group-data-[collapsible=icon]:hidden">
							⌘K
						</CommandShortcut>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>

			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<CommandInput placeholder="พิมพ์ชื่อโจทย์เพื่อค้นหา..." />
				<CommandList>
					<CommandEmpty>ไม่พบโจทย์ที่ค้นหา</CommandEmpty>
					{collections.map((collection) => {
						const collectionProblems = problems.filter(
							(problem) => problem.collectionId === collection.collectionId
						);
						if (collectionProblems.length === 0) return null;

						return (
							<CommandGroup
								key={collection.collectionId}
								heading={collection.name}
							>
								{collectionProblems.map((problem) => (
									<CommandItem
										key={problem.problemId}
										value={`${problem.title} ${collection.name}`}
										onSelect={() => goToProblem(problem.problemId)}
										className="gap-2"
									>
										{problem.isPassed ? (
											<CheckCircle2 className="size-4 shrink-0 text-green-600" />
										) : (
											<FileSpreadsheet className="size-4 shrink-0 text-blue-400" />
										)}
										<span className="truncate">{problem.title}</span>
									</CommandItem>
								))}
							</CommandGroup>
						);
					})}
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default ProblemQuickJump;

import { ChevronRight, CheckCircle2, Folder, FolderOpen } from "lucide-react";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { SidebarCollection, SidebarProblem } from "@/utilities/CourseSidebar";

const difficultyDotClass = (level: number) => {
	if (level === 1) return "bg-green-500";
	if (level === 2) return "bg-yellow-500";
	if (level === 3) return "bg-red-500";
	return "";
};

// Rendered as <i> rather than <span> on purpose: SidebarMenuButton truncates its
// last <span> child, and that has to stay the title.
const DifficultyDot = ({ level }: { level: number }) => {
	const dotClass = difficultyDotClass(level);
	if (!dotClass) return null;
	return (
		<i
			className={cn("ml-auto size-1.5 shrink-0 rounded-full", dotClass)}
			aria-hidden
		/>
	);
};

const ProblemStatusIcon = ({ isPassed }: { isPassed: boolean }) =>
	isPassed ? (
		<CheckCircle2 className="text-green-600" />
	) : (
		<i
			className="size-1.5 shrink-0 rounded-full border border-muted-foreground/50"
			aria-hidden
		/>
	);

const CollectionMenuItem = ({
	courseId,
	collection,
	isExpanded,
	activeProblemId,
	onExpandedChange,
}: {
	courseId: string;
	collection: SidebarCollection;
	isExpanded: boolean;
	activeProblemId?: string;
	onExpandedChange: (collectionId: string, isExpanded: boolean) => void;
}) => {
	const { state, isMobile } = useSidebar();
	const isIconMode = state === "collapsed" && !isMobile;

	const problemHref = (problem: SidebarProblem) =>
		`/courses/${courseId}/problems/${problem.problemId}`;

	// Scrolls the current problem into view the moment its row mounts, so deep
	// links into a long course don't land on an off-screen selection.
	const scrollActiveIntoView = useCallback((node: HTMLElement | null) => {
		node?.scrollIntoView({ block: "nearest" });
	}, []);

	const isFullySolved =
		collection.problems.length > 0 &&
		collection.solvedCount === collection.problems.length;

	const collectionLabel = (
		<>
			{isExpanded && !isIconMode ? (
				<FolderOpen className="text-amber-500" />
			) : (
				<Folder className="text-amber-500" />
			)}
			<span className="truncate font-medium">{collection.name}</span>
		</>
	);

	// Collapsed rail: the sub-menu is hidden by the sidebar's own CSS, so expose
	// the problems through a dropdown instead of leaving a dead icon.
	if (isIconMode) {
		return (
			<SidebarMenuItem>
				<DropdownMenu>
					{/* No `tooltip` here on purpose: it would wrap the button in a
					    Tooltip root, and DropdownMenuTrigger's Slot would then clone
					    that root instead of the real button. The dropdown already
					    names the collection. */}
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							aria-label={collection.name}
							title={collection.name}
						>
							{collectionLabel}
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="right" align="start" className="w-64">
						<DropdownMenuLabel className="flex items-center justify-between gap-2">
							<span className="truncate">{collection.name}</span>
							<span className="shrink-0 text-xs font-normal tabular-nums text-muted-foreground">
								{collection.solvedCount}/{collection.problems.length}
							</span>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						{collection.problems.length === 0 ? (
							<DropdownMenuItem disabled>ยังไม่มีโจทย์</DropdownMenuItem>
						) : (
							collection.problems.map((problem) => (
								<DropdownMenuItem key={problem.problemId} asChild>
									<Link
										to={problemHref(problem)}
										className="flex items-center gap-2"
									>
										<ProblemStatusIcon isPassed={problem.isPassed} />
										<span className="truncate">{problem.title}</span>
										<DifficultyDot level={problem.difficulty} />
									</Link>
								</DropdownMenuItem>
							))
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		);
	}

	return (
		<Collapsible
			asChild
			open={isExpanded}
			onOpenChange={(open) => onExpandedChange(collection.collectionId, open)}
			className="group/collapsible"
		>
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton tooltip={collection.name}>
						{collectionLabel}
						<i
							className={cn(
								"ml-auto shrink-0 px-1 text-xs not-italic tabular-nums",
								isFullySolved ? "text-green-600" : "text-muted-foreground"
							)}
						>
							{collection.solvedCount}/{collection.problems.length}
						</i>
						<ChevronRight className="shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuButton>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<SidebarMenuSub>
						{collection.problems.length === 0 ? (
							<span className="px-2 py-1 text-xs italic text-muted-foreground">
								ยังไม่มีโจทย์ในกลุ่มนี้
							</span>
						) : (
							collection.problems.map((problem) => {
								const isActive = problem.problemId === activeProblemId;
								return (
									<SidebarMenuSubItem key={problem.problemId}>
										<SidebarMenuSubButton asChild isActive={isActive} size="sm">
											<Link
												to={problemHref(problem)}
												ref={isActive ? scrollActiveIntoView : undefined}
												title={problem.title}
											>
												<ProblemStatusIcon isPassed={problem.isPassed} />
												<span className="truncate">{problem.title}</span>
												<DifficultyDot level={problem.difficulty} />
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								);
							})
						)}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	);
};

export default CollectionMenuItem;

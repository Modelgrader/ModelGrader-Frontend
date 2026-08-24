import { ArrowLeft, LayoutDashboard, PanelLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSkeleton,
	SidebarRail,
	SidebarSeparator,
	useSidebar,
} from "@/components/ui/sidebar";
import { TopicModel } from "@/types/models/Topic.model";
import {
	findCollectionIdOfProblem,
	getCourseProgress,
	readExpandedCollections,
	toSidebarCollections,
	writeExpandedCollections,
} from "@/utilities/CourseSidebar";
import CollectionMenuItem from "./CollectionMenuItem";
import CourseSwitcher from "./CourseSwitcher";
import ProblemQuickJump from "./ProblemQuickJump";

const CourseSidebar = ({ course }: { course?: TopicModel }) => {
	const { courseId, problemId } = useParams();
	const { toggleSidebar } = useSidebar();

	const collections = useMemo(() => toSidebarCollections(course), [course]);
	const progress = useMemo(() => getCourseProgress(collections), [collections]);

	const [expandedCollectionIds, setExpandedCollectionIds] = useState<string[]>(
		() => readExpandedCollections(courseId)
	);

	// Re-read on course change so each course keeps its own expanded set.
	useEffect(() => {
		setExpandedCollectionIds(readExpandedCollections(courseId));
	}, [courseId]);

	// Whichever collection owns the problem being viewed is always opened, so a
	// deep link never lands on a collapsed tree.
	useEffect(() => {
		const activeCollectionId = findCollectionIdOfProblem(
			collections,
			problemId
		);
		if (!activeCollectionId) return;
		setExpandedCollectionIds((current) =>
			current.includes(activeCollectionId)
				? current
				: [...current, activeCollectionId]
		);
	}, [collections, problemId]);

	useEffect(() => {
		writeExpandedCollections(courseId, expandedCollectionIds);
	}, [courseId, expandedCollectionIds]);

	const handleExpandedChange = (collectionId: string, isExpanded: boolean) => {
		setExpandedCollectionIds((current) =>
			isExpanded
				? [...current, collectionId]
				: current.filter((id) => id !== collectionId)
		);
	};

	const isLoading = !course;
	const progressPercentage = progress.total
		? Math.round((progress.solved / progress.total) * 100)
		: 0;

	return (
		<Sidebar
			collapsible="icon"
			className="top-10 h-[calc(100svh-2.5rem)]"
			data-testid="course-sidebar"
		>
			<SidebarHeader>
				<CourseSwitcher
					course={course}
					subtitle={
						progress.total > 0
							? `ทำได้ ${progress.solved}/${progress.total} ข้อ`
							: undefined
					}
				/>
				{progress.total > 0 && (
					<div
						className="mx-2 h-1 overflow-hidden rounded-full bg-sidebar-border group-data-[collapsible=icon]:hidden"
						role="progressbar"
						aria-valuenow={progressPercentage}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-label="ความคืบหน้าของคอร์ส"
					>
						<div
							className="h-full rounded-full bg-green-600 transition-all duration-300"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				)}
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup className="py-1">
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									tooltip="ภาพรวมคอร์ส"
									isActive={Boolean(courseId) && !problemId}
								>
									<Link to={`/courses/${courseId}`}>
										<LayoutDashboard />
										<span className="truncate">ภาพรวมคอร์ส</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
						{courseId && collections.length > 0 && (
							<ProblemQuickJump
								courseId={courseId}
								collections={collections}
							/>
						)}
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupLabel>Collections</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{isLoading ? (
								Array.from({ length: 4 }).map((_, index) => (
									<SidebarMenuItem key={index}>
										<SidebarMenuSkeleton showIcon />
									</SidebarMenuItem>
								))
							) : collections.length === 0 ? (
								<span className="px-2 py-1 text-xs italic text-muted-foreground group-data-[collapsible=icon]:hidden">
									คอร์สนี้ยังไม่มี collection
								</span>
							) : (
								collections.map((collection) => (
									<CollectionMenuItem
										key={collection.collectionId}
										courseId={String(courseId)}
										collection={collection}
										isExpanded={expandedCollectionIds.includes(
											collection.collectionId
										)}
										activeProblemId={problemId}
										onExpandedChange={handleExpandedChange}
									/>
								))
							)}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild tooltip="กลับไปคอร์สของฉัน">
							<Link to="/my/courses">
								<ArrowLeft />
								<span className="truncate">คอร์สของฉัน</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip="ย่อ/ขยายแถบข้าง (Ctrl+B)"
							onClick={toggleSidebar}
						>
							<PanelLeft />
							<span className="truncate">ย่อแถบข้าง</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
};

export default CourseSidebar;

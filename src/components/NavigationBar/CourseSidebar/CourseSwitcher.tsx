import { Check, ChevronsUpDown, LibraryBig } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { TopicService } from "@/services/Topic.service";
import { TopicModel } from "@/types/models/Topic.model";

const CourseSwitcher = ({
	course,
	subtitle,
}: {
	course?: TopicModel;
	subtitle?: string;
}) => {
	const navigate = useNavigate();
	const accountId = String(localStorage.getItem("account_id"));
	const { isMobile } = useSidebar();

	const [isOpen, setIsOpen] = useState(false);
	const [courses, setCourses] = useState<TopicModel[]>([]);

	// Only fetch the switchable courses once the user actually opens the menu —
	// most visits never touch it.
	useEffect(() => {
		if (!isOpen || courses.length > 0) return;
		TopicService.getAllAccessibleByAccount(accountId).then((response) => {
			setCourses(response.data.topics ?? []);
		});
	}, [isOpen, courses.length, accountId]);

	const switchCourse = (courseId: string) => {
		setIsOpen(false);
		if (courseId !== course?.topic_id) navigate(`/courses/${courseId}`);
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Popover open={isOpen} onOpenChange={setIsOpen}>
					{/* `title` rather than SidebarMenuButton's `tooltip`: the tooltip
					    variant wraps the button in a Tooltip root, which PopoverTrigger's
					    Slot would clone instead of the button itself. */}
					<PopoverTrigger asChild>
						<SidebarMenuButton
							size="lg"
							title={course?.name ?? "Course"}
							className="data-[state=open]:bg-sidebar-accent"
						>
							<div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-green-600 text-white">
								{course?.image_url ? (
									<img
										src={course.image_url}
										alt={course.name}
										className="size-full object-cover"
									/>
								) : (
									<LibraryBig className="size-4" />
								)}
							</div>
							<div className="grid flex-1 text-left leading-tight">
								<span className="truncate font-semibold">
									{course?.name ?? "เลือกคอร์ส"}
								</span>
								{subtitle && (
									<span className="truncate text-xs text-muted-foreground">
										{subtitle}
									</span>
								)}
							</div>
							<ChevronsUpDown className="ml-auto opacity-50" />
						</SidebarMenuButton>
					</PopoverTrigger>

					<PopoverContent
						className="w-[--radix-popover-trigger-width] min-w-64 p-0"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<Command>
							<CommandInput placeholder="ค้นหาคอร์ส..." />
							<CommandList>
								<CommandEmpty>ไม่พบคอร์ส</CommandEmpty>
								<CommandGroup heading="คอร์สของฉัน">
									{courses.map((accessibleCourse) => (
										<CommandItem
											key={accessibleCourse.topic_id}
											value={`${accessibleCourse.name} ${accessibleCourse.topic_id}`}
											onSelect={() => switchCourse(accessibleCourse.topic_id)}
											className="gap-2"
										>
											<LibraryBig className="size-4 shrink-0 text-green-600" />
											<span className="truncate">{accessibleCourse.name}</span>
											{accessibleCourse.topic_id === course?.topic_id && (
												<Check className="ml-auto size-4 shrink-0" />
											)}
										</CommandItem>
									))}
								</CommandGroup>
								<CommandGroup>
									<CommandItem
										value="__all-courses__"
										onSelect={() => {
											setIsOpen(false);
											navigate("/my/courses");
										}}
										className="gap-2 text-muted-foreground"
									>
										ดูคอร์สทั้งหมด
									</CommandItem>
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</SidebarMenuItem>
		</SidebarMenu>
	);
};

export default CourseSwitcher;

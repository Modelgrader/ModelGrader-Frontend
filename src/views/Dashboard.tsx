import { useIsMobile } from "@/hooks/use-mobile";
import { SubmissionService } from "@/services/Submission.service";
import { TopicService } from "@/services/Topic.service";
import { SubmissionPopulateSubmissionTestcaseAndProblemSecureModel } from "@/types/models/Submission.model";
import { TopicModel } from "@/types/models/Topic.model";
import { Activity, BookOpen, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import PublicCourseCard from "../components/Cards/CourseCards/PublicCourseCard";
import SubmissionCard from "../components/Cards/SubmissionCard";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../components/shadcn/Carousel";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import NavbarMenuLayout from "../layout/NavbarMenuLayout";

/**
 * Modern Dashboard Component with Responsive Design
 * 
 * Features:
 * - Mobile-first responsive layout with progressive enhancement
 * - Statistics overview cards with icons and hover effects
 * - Adaptive content display (grid for mobile, carousel for desktop)
 * - Loading states with skeleton components
 * - Empty states with helpful messaging
 * - Proper semantic HTML structure with sections
 * - Dark mode support via design system
 * 
 * Responsive Breakpoints:
 * - Mobile: < 768px (single column, grid layout)
 * - Tablet: 768px+ (2 columns for stats, carousel appears)
 * - Desktop: 1024px+ (3 columns for stats, larger cards)
 * - Large: 1280px+ (4 columns for content cards)
 */
const Dashboard = () => {
	const accountId = String(localStorage.getItem("account_id"));
	const username = localStorage.getItem("username");
	const isMobile = useIsMobile();

	const [previousAttemptedProblems, setPreviousAttemptedProblems] = useState<
		SubmissionPopulateSubmissionTestcaseAndProblemSecureModel[]
	>([]);
	const [accessibleCourses, setAccessibleCourses] = useState<TopicModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [submissionsResponse, coursesResponse] = await Promise.all([
					SubmissionService.getAll({
						account_id: accountId,
						sort_date: 1,
						start: 0,
						end: 10,
					}),
					TopicService.getAllAccessibleByAccount(accountId)
				]);

				setPreviousAttemptedProblems(submissionsResponse.data.submissions);
				setAccessibleCourses(coursesResponse.data.topics);
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [accountId]);

	const getDashboardStats = () => {
		const totalProblems = previousAttemptedProblems.length;
		const totalCourses = accessibleCourses.length;
		const recentActivity = previousAttemptedProblems.slice(0, 3).length;
		
		return { totalProblems, totalCourses, recentActivity };
	};

	const stats = getDashboardStats();

	const StatCard = ({ 
		title, 
		value, 
		description, 
		icon: Icon, 
		color 
	}: { 
		title: string; 
		value: number; 
		description: string; 
		icon: React.ComponentType<{ className?: string }>; 
		color: string; 
	}) => (
		<Card className="hover:shadow-lg transition-shadow duration-300">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{title}
				</CardTitle>
				<Icon className={`h-4 w-4 ${color}`} />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground mt-1">
					{description}
				</p>
			</CardContent>
		</Card>
	);

	if (isLoading) {
		return (
			<NavbarMenuLayout xPad={false}>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
					{/* Header Skeleton */}
					<div className="mb-8 sm:mb-12">
						<Skeleton className="h-8 sm:h-12 w-3/4 mb-2" />
						<Skeleton className="h-4 w-1/2" />
					</div>

					{/* Stats Skeleton */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={i} className="h-32" />
						))}
					</div>

					{/* Content Skeleton */}
					<div className="space-y-8">
						<Skeleton className="h-8 w-48" />
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-48" />
							))}
						</div>
					</div>
				</div>
			</NavbarMenuLayout>
		);
	}

	return (
		<NavbarMenuLayout xPad={false}>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
				{/* Header Section */}
				<div className="mb-8 sm:mb-12">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
								Welcome back,{" "}
								<span className="text-emerald-600 dark:text-emerald-400">
									{username}
								</span>
							</h1>
							<p className="text-muted-foreground mt-2 text-sm sm:text-base">
								Continue your learning journey
							</p>
						</div>
					</div>
				</div>

				{/* Stats Overview */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
					<StatCard
						title="Problems Attempted"
						value={stats.totalProblems}
						description="Total problems you've worked on"
						icon={Activity}
						color="text-blue-500"
					/>
					<StatCard
						title="Courses Enrolled"
						value={stats.totalCourses}
						description="Available courses"
						icon={BookOpen}
						color="text-purple-500"
					/>
					<StatCard
						title="Recent Activity"
						value={stats.recentActivity}
						description="Latest submissions"
						icon={TrendingUp}
						color="text-emerald-500"
					/>
				</div>

				{/* Recent Submissions Section */}
				<section className="mb-8 sm:mb-12">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
							Recent Submissions
						</h2>
						{previousAttemptedProblems.length > 0 && (
							<Badge variant="secondary">
								{previousAttemptedProblems.length} submissions
							</Badge>
						)}
					</div>

					{previousAttemptedProblems.length === 0 ? (
						<Card className="p-8 sm:p-12 text-center">
							<Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
							<p className="text-muted-foreground">
								Start solving problems to see your progress here
							</p>
						</Card>
					) : isMobile ? (
						<div className="grid grid-cols-1 gap-4">
							{previousAttemptedProblems.slice(0, 6).map((submission, index) => (
								<SubmissionCard key={index} submission={submission} />
							))}
						</div>
					) : (
						<Carousel className="w-full">
							<CarouselContent className="-ml-2 md:-ml-4">
								{previousAttemptedProblems.map((submission, index) => (
									<CarouselItem 
										key={index} 
										className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
									>
										<SubmissionCard submission={submission} />
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className="hidden sm:flex" />
							<CarouselNext className="hidden sm:flex" />
						</Carousel>
					)}
				</section>

				{/* Courses Section */}
				<section>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
							Your Courses
						</h2>
						{accessibleCourses.length > 0 && (
							<Badge variant="secondary">
								{accessibleCourses.length} courses
							</Badge>
						)}
					</div>

					{accessibleCourses.length === 0 ? (
						<Card className="p-8 sm:p-12 text-center">
							<BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-semibold mb-2">No courses available</h3>
							<p className="text-muted-foreground">
								Check back later for new course assignments
							</p>
						</Card>
					) : isMobile ? (
						<div className="grid grid-cols-1 gap-4">
							{accessibleCourses.slice(0, 6).map((course, index) => (
								<PublicCourseCard key={index} course={course} />
							))}
						</div>
					) : (
						<Carousel className="w-full">
							<CarouselContent className="-ml-2 md:-ml-4">
								{accessibleCourses.map((course, index) => (
									<CarouselItem 
										key={index} 
										className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
									>
										<PublicCourseCard course={course} />
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className="hidden sm:flex" />
							<CarouselNext className="hidden sm:flex" />
						</Carousel>
					)}
				</section>
			</div>
		</NavbarMenuLayout>
	);
};

export default Dashboard;

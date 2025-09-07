import { LibraryBig, StepForward, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopicModel } from "@/types/models/Topic.model";
import { Button } from "@/components/shadcn/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PublicCourseCard = ({ course }: { course: TopicModel }) => {
	const navigate = useNavigate();

	// Generate a course description or use a default one
	const getCourseDescription = () => {
		return `Explore ${course?.name} with comprehensive problems and exercises`;
	};

	// Generate course stats (you can enhance this with real data)
	const getCourseStats = () => {
		// These could be fetched from the API in the future
		return {
			problemCount: Math.floor(Math.random() * 50) + 10, // Mock data
		};
	};

	const stats = getCourseStats();

	return (
		<Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-background to-muted/20">
			<CardHeader className="pb-3">
				<div className="flex items-start gap-3">
					<div className="flex-shrink-0">
						<div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
							<LibraryBig 
								size={24} 
								className="text-purple-600 dark:text-purple-400" 
							/>
						</div>
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
							{course?.name}
						</h3>
						<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
							{getCourseDescription()}
						</p>
					</div>
				</div>
			</CardHeader>

			<CardContent className="flex-1 py-3">
				<div className="space-y-3">
					{/* Course Stats */}
					<div className="flex flex-wrap gap-2">
						<Badge variant="secondary" className="text-xs">
							<BookOpen className="w-3 h-3 mr-1" />
							{stats.problemCount} problems
						</Badge>
						{/* <Badge 
							variant="outline" 
							className={`text-xs ${
								stats.difficulty === 'Beginner' ? 'border-green-300 text-green-700 dark:text-green-400' :
								stats.difficulty === 'Intermediate' ? 'border-yellow-300 text-yellow-700 dark:text-yellow-400' :
								'border-red-300 text-red-700 dark:text-red-400'
							}`}
						>
							{stats.difficulty}
						</Badge> */}
					</div>

				</div>
			</CardContent>

			<CardFooter className="pt-3">
				<Button 
					onClick={() => navigate(`/courses/${course.topic_id}`)}
					className="w-full"
					size="sm"
				>
					<StepForward className="mr-2 h-4 w-4" />
					Start Learning
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PublicCourseCard;

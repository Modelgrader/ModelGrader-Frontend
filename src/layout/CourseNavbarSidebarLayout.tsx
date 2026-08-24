import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import CourseSidebar from "../components/NavigationBar/CourseSidebar";
import { SidebarInset } from "../components/ui/sidebar";
import { CourseNavSidebarContext } from "../contexts/CourseNavSidebarContext";
import { TopicService } from "../services/Topic.service";
import NavbarMenuLayout from "./NavbarMenuLayout";

const CourseNavbarSidebarLayout = ({
	children,
}: {
	children?: React.ReactNode;
}) => {
	const accountId = String(localStorage.getItem("account_id"));
	const { courseId } = useParams();
	const { course, setCourse } = useContext(CourseNavSidebarContext);

	useEffect(() => {
		TopicService.getPublicByAccount(accountId, String(courseId)).then(
			(response) => {
				setCourse(response.data);
			}
		);
	}, [accountId, courseId]);

	// Clear the previous course while the new one loads, otherwise the sidebar
	// briefly renders the old course's collections under the new course's name.
	useEffect(() => {
		return () => setCourse(undefined);
	}, [courseId]);

	return (
		<NavbarMenuLayout xPad={false} yPad={false}>
			{/* Sidebar and SidebarInset must stay siblings — SidebarInset relies on
			    peer-data-* selectors from the Sidebar to react to collapse state. */}
			<div className="flex w-full">
				<CourseSidebar course={course} />
				<SidebarInset className="min-w-0 pt-10">{children}</SidebarInset>
			</div>
		</NavbarMenuLayout>
	);
};

export default CourseNavbarSidebarLayout;

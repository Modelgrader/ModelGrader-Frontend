import React, { useContext, useEffect } from "react";
import NavbarMenuLayout from "./NavbarMenuLayout";
import { Separator } from "../components/shadcn/Seperator";
import { CourseNavSidebarContext } from "../contexts/CourseNavSidebarContext";
import CourseNavSidebar2 from "../components/NavigationBar/CourseNavSidebar2";
import { TopicService } from "../services/Topic.service";
import { useParams } from "react-router-dom";

const CourseNavbarSidebarLayout = ({
	children,
}: {
	children?: React.ReactNode;
}) => {
	const accountId = String(localStorage.getItem("account_id"));
	const { courseId } = useParams();
	const ctx = useContext(CourseNavSidebarContext);
	const {
		isOpen,
		setCourse,
		course,
		setIsOpen,
		setSection,
		setRecentOpenCollection,
		recentOpenCollection,
	} = useContext(CourseNavSidebarContext);

	const widthAdjuster = () => {
		if (isOpen) {
			return ["w-1/6 ", "w-5/6 "];
		} else {
			return ["", "w-full "];
		}
	};

	useEffect(() => {
		TopicService.getPublicByAccount(accountId, String(courseId)).then(
			(response) => {
				setCourse(response.data);
			}
		);
	}, [accountId, courseId]);

	useEffect(() => {
		const courseNavSidebarContextStorage = localStorage.getItem(
			"courseNavSidebarContext"
		);
		if (courseNavSidebarContextStorage) {
			setCourse(JSON.parse(courseNavSidebarContextStorage).course);
			setIsOpen(JSON.parse(courseNavSidebarContextStorage).isOpen);
			setSection(JSON.parse(courseNavSidebarContextStorage).section);
			setRecentOpenCollection(
				JSON.parse(courseNavSidebarContextStorage).recentOpenCollection
			);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("courseNavSidebarContext", JSON.stringify(ctx));
	}, [ctx]);

    const handleSidebarChange = (id: string, isOpen: boolean) => {
        if(isOpen){
            setRecentOpenCollection([...recentOpenCollection,id])
        }else{
            setRecentOpenCollection(recentOpenCollection.filter((item) => item !== id))
        }
    }

	return (
		<NavbarMenuLayout xPad={false} yPad={false}>
			<div className="flex">
				<div className={widthAdjuster()[0]}>
					{course && (
						<CourseNavSidebar2
							course={course}
							recentOpenCollection={recentOpenCollection}
							onChange={handleSidebarChange}
						/>
					)}
				</div>
				<div>
					<Separator orientation="vertical" className="" />
				</div>
				<div className={"pt-10 " + widthAdjuster()[1]}>{children}</div>
			</div>
		</NavbarMenuLayout>
	);
};

export default CourseNavbarSidebarLayout;

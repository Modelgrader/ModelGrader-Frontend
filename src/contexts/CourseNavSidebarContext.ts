import { createContext, useState } from "react";
import { TopicModel } from "../types/models/Topic.model";

export type CourseNavSidebarContextType = {
    course?: TopicModel
    setCourse: React.Dispatch<React.SetStateAction<TopicModel | undefined>>;
    isOpenSidebar: boolean;
    setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const iCourseNavSidebarContextState: CourseNavSidebarContextType = {
    course: undefined,
    setCourse: () => {},
    isOpenSidebar: true,
    setIsOpenSidebar: () => {}
}

export const GetCourseNavSidebarContextStateValue = ():CourseNavSidebarContextType => {
    const [course, setCourse] = useState<TopicModel | undefined>();
    const [isOpenSidebar, setIsOpenSidebar] = useState(true);

    return {
        course,
        setCourse,
        isOpenSidebar,
        setIsOpenSidebar
    }
}

export const CourseNavSidebarContext = createContext<CourseNavSidebarContextType>(iCourseNavSidebarContextState);

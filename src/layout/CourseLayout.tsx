import React, { useContext, useEffect } from 'react';
import { SidebarProvider } from '../components/ui/sidebar';
import { CourseNavSidebarContext } from '@/contexts/CourseNavSidebarContext';

const CourseLayout = ({ children }: { children: React.ReactNode }) => {
    const { isOpenSidebar, setIsOpenSidebar } = useContext(CourseNavSidebarContext);

    useEffect(() => {
        const isOpenSidebarStorage = localStorage.getItem('isOpenSidebar');
        if (isOpenSidebarStorage) {
            setIsOpenSidebar(isOpenSidebarStorage === 'true');
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('isOpenSidebar', isOpenSidebar.toString());
    }, [isOpenSidebar])

    return (
        // onOpenChange is what lets the rail, the footer toggle and Ctrl+B actually
        // move a controlled sidebar — without it `open` was a one-way prop.
        <SidebarProvider open={isOpenSidebar} onOpenChange={setIsOpenSidebar}>
            <div className="w-full">{children}</div>
        </SidebarProvider>
    );
};

export default CourseLayout;

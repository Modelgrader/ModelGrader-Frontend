import React from 'react';
import NavigationBar from '../components/NavigationBar/NavigationBar';

export const NavbarMenuLayout = ({
    children,
    yPad = true,
    xPad = true,
}: {
    children: React.ReactNode;
    yPad?: boolean;
    xPad?: boolean;
}) => {
    return (
        <div className="h-screen overflow-hidden flex flex-col">
            <div className="z-50 fixed w-full">
                <NavigationBar />
            </div>
            <div className={`flex-1 overflow-y-auto overflow-x-hidden ${yPad ? 'pt-10' : ''} ${xPad ? 'pl-10' : ''}`}>{children}</div>
        </div>
    );
};

export default NavbarMenuLayout;

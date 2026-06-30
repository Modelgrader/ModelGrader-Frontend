import React, { useContext } from "react";
import NavSidebar from "../components/NavigationBar/NavSidebar";
import { Separator } from "../components/shadcn/Seperator";
import { LoginContext } from "../contexts/LoginContext";
import NavbarMenuLayout from "./NavbarMenuLayout";

const NavbarSidebarLayout = ({ children }: { children: React.ReactNode }) => {
	const { isLogin } = useContext(LoginContext);

	return (
		<NavbarMenuLayout xPad={false} yPad={false}>
			{
				isLogin ? (
					<div className="flex h-full overflow-hidden">
						<NavSidebar />
						<div>
							<Separator orientation="vertical" className="" />
						</div>
						<div className="flex-1 pt-10 overflow-hidden">{children}</div>
					</div>
				) : (
					<p>No Access</p>
				)
			}
		</NavbarMenuLayout>
	);
};

export default NavbarSidebarLayout;

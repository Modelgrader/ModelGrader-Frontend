import { ReactNode } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/DropdownMenu";

import {
	FileSpreadsheet,
	Folder,
	LibraryBig,
	LogOut,
	Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/Auth.service";

const ProfileDropdown = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();

	const username = localStorage.getItem("username");
	const account_id = String(localStorage.getItem("account_id"));

	const handleLogout = async () => {
		localStorage.removeItem("account_id");
		localStorage.removeItem("username");
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		window.location.href = "/login";
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>{username}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{/* <DropdownMenuItem dis>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span> */}
					{/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
					{/* </DropdownMenuItem> */}
					<DropdownMenuItem onClick={() => navigate("/my/problems")}>
						<FileSpreadsheet className="mr-2 h-4 w-4" />
						<span>My Problems</span>
						{/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => navigate("/my/collections")}
					>
						<Folder className="mr-2 h-4 w-4" />
						<span>My Collections</span>
						{/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate("/my/courses")}>
						<LibraryBig className="mr-2 h-4 w-4" />
						<span>My Courses</span>
						{/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => navigate("/my/groups")}>
						<Users className="mr-2 h-4 w-4" />
						<span>My Groups</span>
						{/* <DropdownMenuShortcut>⌘K</DropdownMenuShortcut> */}
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => navigate("/my/submissions")}>
						<FileSpreadsheet className="mr-2 h-4 w-4" />
						<span>My Previous Submissions</span>
						{/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
					</DropdownMenuItem>
				</DropdownMenuGroup>
				{/* <DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<Users className="mr-2 h-4 w-4" />
						<span>Team</span>
					</DropdownMenuItem>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<UserPlus className="mr-2 h-4 w-4" />
							<span>Invite users</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem>
									<Mail className="mr-2 h-4 w-4" />
									<span>Email</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<MessageSquare className="mr-2 h-4 w-4" />
									<span>Message</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<PlusCircle className="mr-2 h-4 w-4" />
									<span>More...</span>
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuItem>
						<Plus className="mr-2 h-4 w-4" />
						<span>New Team</span>
						<DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Github className="mr-2 h-4 w-4" />
					<span>GitHub</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<LifeBuoy className="mr-2 h-4 w-4" />
					<span>Support</span>
				</DropdownMenuItem>
				<DropdownMenuItem disabled>
					<Cloud className="mr-2 h-4 w-4" />
					<span>API</span>
				</DropdownMenuItem> */}
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
					{/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
export default ProfileDropdown;

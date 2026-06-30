import React, { useEffect, useState } from "react";
import {
	CreateProblemRequestForm,
	ProblemGroupPermissionRequestForm,
} from "@/types/forms/CreateProblemRequestForm";
import { GroupModel } from "@/types/models/Group.model";
import { GroupService } from "@/services/Group.service";
import GroupAndPermissionManager, {
	GroupAndPermissionManagerOnAddGroupsCallback,
	GroupAndPermissionManagerOnRemoveGroupCallback,
} from "../GroupAndPermissionManager";
import PermissionSwitchScrollArea from "../../Permissions/PermissionSwitchScrollArea";
import ProblemPermissionSwitchGroup from "../PermissionSwitchGroups/ProblemPermissionSwitchGroup";

const PermissionsSection = ({
	createRequest,
	setCreateRequest,
}: {
	createRequest: CreateProblemRequestForm;
	setCreateRequest: React.Dispatch<React.SetStateAction<CreateProblemRequestForm>>;
}) => {
	const accountId = String(localStorage.getItem("account_id"));
	const [groupPermission, setGroupPermission] = useState<ProblemGroupPermissionRequestForm>();
	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const [allGroups, setAllGroups] = useState<GroupModel[]>([]);

	useEffect(() => {
		GroupService.getAllAsCreator(accountId).then((res) => setAllGroups(res.data.groups));
	}, [accountId]);

	useEffect(() => {
		if (selectedIndex >= 0 && selectedIndex < createRequest.groupPermissions.length) {
			setGroupPermission(createRequest.groupPermissions[selectedIndex]);
		}
	}, [selectedIndex]);

	useEffect(() => {
		if (groupPermission) {
			setCreateRequest({
				...createRequest,
				groupPermissions: [
					...createRequest.groupPermissions.slice(0, selectedIndex),
					groupPermission,
					...createRequest.groupPermissions.slice(selectedIndex + 1),
				],
			});
		}
	}, [groupPermission]);

	const handleAddGroups = ({ addingGroups }: GroupAndPermissionManagerOnAddGroupsCallback) => {
		const newGroupPermissions = addingGroups.map((group) => ({
			groupId: group.group_id,
			group,
			manageProblems: group.permission_manage_problems,
			viewProblems: group.permission_view_problems,
		}));
		setCreateRequest({
			...createRequest,
			groupPermissions: [...createRequest.groupPermissions, ...newGroupPermissions],
		});
	};

	const handleRemoveGroup = ({ index }: GroupAndPermissionManagerOnRemoveGroupCallback) => {
		if (index === selectedIndex) setSelectedIndex(-1);
		setCreateRequest({
			...createRequest,
			groupPermissions: createRequest.groupPermissions.filter((_, i) => i !== index),
		});
	};

	return (
		<GroupAndPermissionManager
			allGroups={allGroups}
			createRequest={createRequest}
			onAddGroups={handleAddGroups}
			onRemoveGroup={handleRemoveGroup}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
		>
			<PermissionSwitchScrollArea>
				{groupPermission && selectedIndex >= 0 && (
					<ProblemPermissionSwitchGroup
						manageProblemsChecked={groupPermission.manageProblems}
						viewProblemsChecked={groupPermission.viewProblems}
						onClickManageProblems={() =>
							setGroupPermission({ ...groupPermission, manageProblems: !groupPermission.manageProblems })
						}
						onClickViewProblems={() =>
							setGroupPermission({ ...groupPermission, viewProblems: !groupPermission.viewProblems })
						}
					/>
				)}
			</PermissionSwitchScrollArea>
		</GroupAndPermissionManager>
	);
};

export default PermissionsSection;

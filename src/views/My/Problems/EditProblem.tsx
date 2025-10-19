import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateProblemForm, {
	OnProblemSaveCallback,
} from "../../../components/Forms/CreateProblemForm";
import { toast } from "../../../components/shadcn/UseToast";
import NavbarSidebarLayout from "../../../layout/NavbarSidebarLayout";
import { ProblemService } from "@/services/Problem.service";
import { transformCreateProblemRequestForm2CreateProblemRequest } from "@/types/adapters/CreateProblemRequestForm.adapter";
import { transformProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel2CreateProblemRequestForm } from "@/types/adapters/Problem.adapter";
import { CreateProblemRequestForm } from "@/types/forms/CreateProblemRequestForm";
import { ProblemPoplulateCreatorModel } from "@/types/models/Problem.model";
import ManageProblemLayout from "@/layout/ManageProblemLayout";

const EditProblem = () => {
	const accountId = String(localStorage.getItem("account_id"));

	const { problemId } = useParams();
	const editProblemId = String(problemId);

	const [problem, setProblem] = useState<ProblemPoplulateCreatorModel>();

	const [createRequest, setCreateRequest] =
		useState<CreateProblemRequestForm>();

	const handleSave: OnProblemSaveCallback = (setLoading, createRequest) => {
		setLoading(true);

		const { request, groups } =
			transformCreateProblemRequestForm2CreateProblemRequest(
				createRequest
			);

		ProblemService.update(String(editProblemId), accountId, request)
			.then((response) => {
				return ProblemService.updateGroupPermissions(
					response.data.problem_id,
					accountId,
					groups
				);
			})
			.then((response) => {
				console.log("Update Completed", response.data);
				setLoading(false);
				toast({
					title: "Problem Updated",
				});
			});
	};

	useEffect(() => {
		ProblemService.get(accountId, editProblemId).then((response) => {
			setProblem(response.data);
			setCreateRequest(
				transformProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel2CreateProblemRequestForm(
					response.data
				)
			);
            document.title = `${response.data.title} - Edit`;
		});


	}, [accountId, editProblemId]);
	return (
		<NavbarSidebarLayout>
			<ManageProblemLayout isShow={true}>
			{createRequest && (
				<CreateProblemForm
					createRequestInitialValue={createRequest}
					validatedTestcases={problem?.testcases}
					onProblemSave={(
						setLoading,

						createRequest
					) =>
						handleSave(
							setLoading,

							createRequest
						)
					}
				/>
			)}
			</ManageProblemLayout>
		</NavbarSidebarLayout>
	);
};

export default EditProblem;

import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { useNavigate } from "react-router-dom";
import CreateProblemForm, {
	OnProblemSaveCallback,
} from "../../../components/Forms/CreateProblemForm";
import { toast } from "../../../components/shadcn/UseToast";
import NavbarSidebarLayout from "../../../layout/NavbarSidebarLayout";
import ManageProblemLayout from "../../../layout/ManageProblemLayout";
import { ProblemService } from "@/services/Problem.service";
import { transformCreateProblemRequestForm2CreateProblemRequest } from "@/types/adapters/CreateProblemRequestForm.adapter";
import { CreateProblemRequestForm } from "@/types/forms/CreateProblemRequestForm";

const formInitialValue: CreateProblemRequestForm = {
	title: "",
	description: [
		{
			id: "1",
			type: ELEMENT_PARAGRAPH,
			children: [{ text: "" }],
		},
	],
	language: "python",
	solution: "",
	testcases: "",
	testcase_delimeter: ":::",
	time_limit: 1.5,
	groupPermissions: [],
	allowedLanguage: [],
};

const CreateProblem = () => {
	const accountId = String(localStorage.getItem("account_id"));
	const navigate = useNavigate();

	const handleSave: OnProblemSaveCallback = (setLoading, createRequest) => {
		setLoading(true);

		const { request, groups } =
			transformCreateProblemRequestForm2CreateProblemRequest(
				createRequest
			);

		ProblemService.create(accountId, request)
			.then((response) => {
				return ProblemService.updateGroupPermissions(
					response.data.problem_id,
					accountId,
					groups
				);
			})
			.then((response) => {
				setLoading(false);
				toast({
					title: "Create Completed",
				});
				navigate(`/my/problems/${response.data.problem_id}/edit`);
			});
	};

	return (
		<NavbarSidebarLayout>
			<ManageProblemLayout isShow={true}>
				<CreateProblemForm
					createRequestInitialValue={formInitialValue}
					onProblemSave={(setLoading, createRequest) =>
						handleSave(setLoading, createRequest)
					}
				/>
			</ManageProblemLayout>
		</NavbarSidebarLayout>
	);
};

export default CreateProblem;

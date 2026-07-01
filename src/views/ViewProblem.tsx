import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProblemViewLayout, {
	OnSubmitProblemViewLayoutCallback,
} from "../components/ProblemViewLayout";
import NavbarMenuLayout from "../layout/NavbarMenuLayout";
import { ProblemService } from "@/services/Problem.service";
import { SubmissionService } from "@/services/Submission.service";
import { ProblemPopulateCreatorSecureModel } from "@/types/models/Problem.model";
import {
	GetSubmissionByAccountProblemResponse
} from "@/types/models/Submission.model";

const ViewProblem = () => {
	const { problemId } = useParams();
	const accountId = String(localStorage.getItem("account_id"));

	const [problem, setProblem] = useState<ProblemPopulateCreatorSecureModel>();

	const [previousSubmissions, setPreviousSubmissions] =
		useState<GetSubmissionByAccountProblemResponse>()

	useEffect(() => {
		ProblemService.getPublic(String(problemId)).then(async (response) => {
			const problem = response.data;
			if (problem.view_mode === 'pdf' && problem.pdf_url) {
				const pdfUrlResponse = await ProblemService.getPdfUrl(String(problemId));
				problem.pdf_presigned_url = pdfUrlResponse.data.url;
			}
			setProblem(problem);
		});

		SubmissionService.getByAccountProblem(
			accountId,
			String(problemId)
		).then((response) => {
			setPreviousSubmissions(response.data);
		});
	}, []);

	const handleSubmit = ({
		setGrading,
		setLastedSubmission,
		selectedLanguage,
		submitCodeValue,
	}: OnSubmitProblemViewLayoutCallback) => {
		setGrading(true);
		SubmissionService.submit(accountId, String(problemId), {
			language: selectedLanguage,
			submission_code: String(submitCodeValue),
		}).then((response) => {
			console.log(response.data);
			setLastedSubmission(response.data);
			SubmissionService.getByAccountProblem(
				accountId,
				String(problemId)
			).then((response) => {
				setPreviousSubmissions(response.data);
			});
			setGrading(false);
		});
	};

	return (
		<NavbarMenuLayout xPad={false}>
			<div className="ml-10">
				<ProblemViewLayout
					onSubmit={(e) => handleSubmit(e)}
					problem={problem as ProblemPopulateCreatorSecureModel}
					previousSubmissions={
						previousSubmissions as GetSubmissionByAccountProblemResponse
					}
				/>
			</div>
		</NavbarMenuLayout>
	);
};

export default ViewProblem;

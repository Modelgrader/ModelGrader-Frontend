import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MyProblemSubmissionsTable from "../../../components/Tables/MyProblemSubmissionsTable";
import { Button } from "../../../components/shadcn/Button";
import NavbarSidebarLayout from "../../../layout/NavbarSidebarLayout";
import ManageProblemLayout from "../../../layout/ManageProblemLayout";
import { SubmissionService } from "@/services/Submission.service";
import { ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel } from "@/types/models/Problem.model";
import { SubmissionPopulateSubmissionTestcaseAndAccountModel } from "@/types/models/Submission.model";
import { ProblemService } from "@/services/Problem.service";
import { Pagination } from "@/types/Pagination.type";
import { PaginationInitalValue } from "../../../constants/Pagination";
import CustomPagination from "../../../components/Paginations/CustomPagination";

const ProblemStatistic = () => {
	const { problemId } = useParams();
	const accountId = String(localStorage.getItem("account_id"));

	const [problem, setProblem] =
		useState<ProblemPopulateAccountAndTestcasesAndProblemGroupPermissionsPopulateGroupModel>();
	const [submissions, setSubmissions] =
		useState<SubmissionPopulateSubmissionTestcaseAndAccountModel[]>();
	const [pagination, setPagination] = useState<Pagination>(
		PaginationInitalValue
	);

	const loadSubmissions = () => {
		if (!problemId) return;
		ProblemService.get(accountId, problemId)
			.then((response) => {
				setProblem(response.data);
				document.title = `${response.data.title}`;
				return SubmissionService.getByCreatorProblem(
					accountId,
					problemId,
					{
						start: pagination.start,
						end: pagination.end,
					}
				);
			})
			.then((response) => {
				setSubmissions(response.data.submissions);
				setPagination({
					...pagination,
					total: response.data.total,
				});
			});
	};

	const handleNextClick = () => {
		if (pagination.end < pagination.total) {
			setPagination((prev) => {
				const newStart = prev.start + 10;
				const newEnd = prev.end + 10;
				return { ...prev, start: newStart, end: newEnd };
			});
		}
	};

	const handlePreviousClick = () => {
		if (pagination.start > 0) {
			setPagination((prev) => {
				const newStart = prev.start - 10;
				const newEnd = prev.end - 10;
				return { ...prev, start: newStart, end: newEnd };
			});
		}
	};

	useEffect(loadSubmissions, [
		accountId,
		problemId,
		pagination.start,
		pagination.end,
	]);

	return (
		<NavbarSidebarLayout>
			<ManageProblemLayout isShow={true}>
			<div className="mt-10 w-[96%] mx-auto">
				<div className="font-bold text-3xl">{problem?.title}</div>

				<div className="mb-5 flex justify-end gap-10 items-center">
					<div>
						<Link
							target="_blank"
							to={`/my/problems/${problemId}/edit`}
						>
							<Button>
								<Pencil size={20} className="mr-2" />
								Edit Problem
							</Button>
						</Link>
					</div>
				</div>

				<div>
					{problem && (
						<MyProblemSubmissionsTable
							submissions={submissions}
							problem={problem}
						/>
					)}
				</div>

				<div className="flex justify-end">
					<CustomPagination
						pagination={pagination}
						onNextClick={handleNextClick}
						onPreviousClick={handlePreviousClick}
					/>
				</div>
			</div>
			</ManageProblemLayout>
		</NavbarSidebarLayout>
	);
};

export default ProblemStatistic;

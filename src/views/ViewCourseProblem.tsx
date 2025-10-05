import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProblemViewLayout, {
  OnSubmitProblemViewLayoutCallback,
} from "../components/ProblemViewLayout";
import CourseNavbarSidebarLayout from "../layout/CourseNavbarSidebarLayout";
import { ProblemService } from "../services/Problem.service";
import { SubmissionService } from "../services/Submission.service";
import { ProblemPopulateCreatorSecureModel } from "../types/models/Problem.model";
import { GetSubmissionByAccountProblemResponse } from "../types/models/Submission.model";
import CourseLayout from "../layout/CourseLayout";
import { CourseNavSidebarContext } from '@/contexts/CourseNavSidebarContext';

const ViewCourseProblem = () => {
  const accountId = String(localStorage.getItem("account_id"));
  const { courseId, problemId } = useParams();

  const { course } = useContext(CourseNavSidebarContext);

  const [problem, setProblem] = useState<ProblemPopulateCreatorSecureModel>();
  const [previousSubmissions, setPreviousSubmissions] =
    useState<GetSubmissionByAccountProblemResponse>();

  useEffect(() => {
    ProblemService.getPublic(String(problemId)).then((response) => {
      setProblem(response.data);
    });

    SubmissionService.getByAccountProblemInTopic(
      accountId,
      String(problemId),
      String(courseId)
    ).then((response) => {
      setPreviousSubmissions(response.data);
    });
  }, [accountId, problemId, courseId]);

  const handleSubmit = ({
    setGrading,
    setLastedSubmission,
    selectedLanguage,
    submitCodeValue,
  }: OnSubmitProblemViewLayoutCallback) => {
    setGrading(true);
    SubmissionService.topicSubmit(
      accountId,
      String(courseId),
      String(problemId),
      {
        language: selectedLanguage,
        submission_code: String(submitCodeValue),
      }
    ).then((response) => {
      setLastedSubmission(response.data);
      SubmissionService.getByAccountProblemInTopic(
        accountId,
        String(problemId),
        String(courseId)
      ).then((response) => {
        setPreviousSubmissions(response.data);
      });
      setGrading(false);
    });
  };

  return (
    <CourseLayout>
      <CourseNavbarSidebarLayout>
        <div className="ml-5">
          <ProblemViewLayout
            onSubmit={(e) => handleSubmit(e)}
            problem={problem as ProblemPopulateCreatorSecureModel}
            previousSubmissions={
              previousSubmissions as GetSubmissionByAccountProblemResponse
            }
            course={course}
          />
        </div>
      </CourseNavbarSidebarLayout>
    </CourseLayout>
  );
};

export default ViewCourseProblem;

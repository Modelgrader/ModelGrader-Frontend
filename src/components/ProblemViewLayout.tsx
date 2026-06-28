import {
    ProblemPoplulateCreatorModel,
    ProblemPopulateCreatorSecureModel,
} from "@/types/models/Problem.model";
import {
    GetSubmissionByAccountProblemResponse,
    SubmissionPopulateSubmissionTestcasesSecureModel,
} from "@/types/models/Submission.model";
import { handleDeprecatedDescription } from "@/utilities/HandleDeprecatedDescription";
import { readableDateFormat } from "@/utilities/ReadableDateFormat";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { Check, Clipboard, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ProgrammingLanguageOptions } from "../constants/ProgrammingLanguage";
import PreviousSubmissionsCombobox from "./PreviousSubmissionsCombobox";
import ReadOnlyPlate from "./ReadOnlyPlate";
import TestcasesGradingIndicator from "./TestcasesGradingIndicator";
import { Button } from "./shadcn/Button";
import { Combobox } from "./shadcn/Combobox";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./shadcn/Resizable";
import { Separator } from "./shadcn/Seperator";

export type OnSubmitProblemViewLayoutCallback = {
  setGrading: React.Dispatch<React.SetStateAction<boolean>>;
  setLastedSubmission: React.Dispatch<
    React.SetStateAction<
      SubmissionPopulateSubmissionTestcasesSecureModel | undefined
    >
  >;
  selectedLanguage: string;
  submitCodeValue: string;
};

const ProblemViewLayout = ({
  onSubmit,
  problem,
  previousSubmissions,
}: {
  onSubmit: (callback: OnSubmitProblemViewLayoutCallback) => void;
  problem: ProblemPoplulateCreatorModel | ProblemPopulateCreatorSecureModel;
  previousSubmissions: GetSubmissionByAccountProblemResponse;
}) => {

  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [grading, setGrading] = useState<boolean>(false);
  const [submitCodeValue, setSubmitCodeValue] = useState<string | undefined>("");
  const [copied, setCopied] = useState<boolean>(false);

  // const [previousSubmissions, setPreviousSubmissions] =
  useState<GetSubmissionByAccountProblemResponse>();
  const [lastedSubmission, setLastedSubmission] =
    useState<SubmissionPopulateSubmissionTestcasesSecureModel>();

  const handleSubmit = () => {
    onSubmit({
      setGrading,
      setLastedSubmission,
      selectedLanguage,
      submitCodeValue: submitCodeValue || "",
    });
  };

  const handleSelectPreviousSubmission = (submissionId: string) => {
    let submission = null;
    if (submissionId === previousSubmissions?.best_submission?.submission_id) {
      submission = previousSubmissions?.best_submission;
    } else {
      previousSubmissions?.submissions?.forEach((sub) => {
        if (sub.submission_id === submissionId) {
          submission = sub;
          return;
        }
      });
    }

    if (submission) {
      setSubmitCodeValue(submission.submission_code);
      setLastedSubmission(submission);
      setSelectedLanguage(submission.language);
    }
  };

  const handleOnClickCopy = () => {
    navigator.clipboard.writeText(submitCodeValue || "");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    if (problem && problem?.allowed_languages.length > 0) {
      const previousSelectedLanguage = localStorage.getItem(
        "previousSelectedLanguage"
      );
      if (previousSelectedLanguage) {
        setSelectedLanguage(previousSelectedLanguage);
      } else {
        const autoSelectedLanguage = ProgrammingLanguageOptions.filter((lang) =>
          problem?.allowed_languages.includes(lang.value)
        )[0].value;
        setSelectedLanguage(autoSelectedLanguage);
      }
    }
  }, [problem]);

  const problemPanel = (
    <div className="grid content-between h-full">
      <div className="ml-3">
        <div className="text-3xl text-green-700 font-bold mb-2 flex">
          {problem?.title}
        </div>

        <div className="flex text-base justify-between">
          <div className="flex mr-10">
            <b className="mr-2">Author</b>
            <p className="">{problem?.creator.username}</p>
          </div>

          <div className="flex">
            <b className="mr-2">Updated Date</b>
            <p className="">
              {readableDateFormat(String(problem?.updated_date))}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-[8px] mb-[16px]">
        <Separator orientation="horizontal" />
      </div>
      <div>
        {problem && (
          <ReadOnlyPlate
            value={JSON.parse(
              handleDeprecatedDescription(String(problem.description))
            )}
            className="h-[30vh] md:h-[35vh] lg:h-[65vh] xl:h-[75vh]"
          />
        )}
      </div>
    </div>
  );

  const editorPanel = (
    <div className="mr-5 h-full flex flex-col">
      <div className="flex justify-between mb-1 items-center">
        <div className="flex gap-2">
          <Combobox
            label="Select Language"
            options={ProgrammingLanguageOptions.filter((lang) =>
              problem?.allowed_languages.includes(lang.value)
            )}
            onSelect={(value) => {
              setSelectedLanguage(value);
              localStorage.setItem("previousSelectedLanguage", value);
            }}
            value={selectedLanguage}
            setValue={setSelectedLanguage}
          />
        </div>
        <div>
          {lastedSubmission && !grading && (
            <TestcasesGradingIndicator
              submissionTestcases={lastedSubmission.runtime_output}
            />
          )}
          {grading && (
            <div className="flex items-center">
              <Loader2 className="animate-spin mr-2 text-green-400" />
              Grading ...
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <MonacoEditorWrapper>
          <MonacoEditor
            onChange={(e) => setSubmitCodeValue(e)}
            value={submitCodeValue}
            theme="vs-dark"
            language={selectedLanguage}
          />
        </MonacoEditorWrapper>
      </div>

      <div className="flex justify-between mt-1 gap-2">
        <PreviousSubmissionsCombobox
          bestSubmission={
            previousSubmissions?.best_submission as SubmissionPopulateSubmissionTestcasesSecureModel
          }
          submissions={
            previousSubmissions?.submissions as SubmissionPopulateSubmissionTestcasesSecureModel[]
          }
          onSelect={(submissionId) =>
            handleSelectPreviousSubmission(String(submissionId))
          }
        />
        <Button variant="outline" onClick={handleOnClickCopy}>
          {copied ? (
            <>
              <Check className="mr-2" size={16} />
              Copied
            </>
          ) : (
            <>
              <Clipboard className="mr-2" size={16} />
              Copy
            </>
          )}
        </Button>
        <Button
          disabled={
            grading ||
            !submitCodeValue ||
            ProgrammingLanguageOptions.filter((lang) =>
              problem?.allowed_languages.includes(lang.value)
            ).length === 0
          }
          onClick={handleSubmit}
          className="px-10"
        >
          {grading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Submitting
            </>
          ) : (
            <>Submit</>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop (lg+): side-by-side horizontal layout */}
      <ResizablePanelGroup
        direction="horizontal"
        className="hidden lg:flex xxl:mt-10 lg:mt-5 h-[80vh] xl:h-[90vh]"
      >
        <ResizablePanel defaultSize={50} className="w-1/2">
          {problemPanel}
        </ResizablePanel>
        <ResizableHandle className="mx-3" />
        <ResizablePanel defaultSize={50} className="w-1/2">
          {editorPanel}
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Tablet / iPad (< lg): stacked vertical layout — problem top, editor bottom */}
      <ResizablePanelGroup
        direction="vertical"
        className="lg:hidden flex mt-3 h-[92vh]"
      >
        <ResizablePanel defaultSize={38} minSize={20} className="overflow-auto pb-2">
          {problemPanel}
        </ResizablePanel>
        <ResizableHandle className="my-2" />
        <ResizablePanel defaultSize={62} minSize={30} className="overflow-auto">
          {editorPanel}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

const MonacoEditorWrapper = styled.div`
  height: 100%;
  min-height: 200px;

  /* Desktop heights */
  @media (min-width: 1024px) {
    height: 80vh;

    @media (max-height: 900px) {
      height: 75vh;
    }
  }

  /* Tablet heights — fill the resizable panel */
  @media (max-width: 1023px) {
    height: 45vh;
  }
`;

export default ProblemViewLayout;

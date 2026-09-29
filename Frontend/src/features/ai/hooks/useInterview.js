import { useContext } from "react";
import InterviewContext from "../interview.context";
import {
  generateInterviewReport,
  generateInterviewReportById,
  generateAllInterviewReports,
} from "../services/interview.api";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resume,
  }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resume,
      });
      setReport(response);
    } catch (error) {
      console.error("Error generating interview report:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewReportId) => {
    setLoading(true);
    try {
        const response = await generateInterviewReportById(interviewReportId);
        setReport(response);
    } catch (error) {
        console.error("Error fetching interview report by ID:", error);
    }finally {
        setLoading(false);
    }
};

const getAllReports = async () => {
    setLoading(true);
    try{
        const response = await generateAllInterviewReports();
        setReports(response);
    } catch (error) {
        console.error("Error fetching all interview reports:", error);
    } finally {
        setLoading(false);
    }

    return {
        loading,
        report,
        reports,
        setReports,
        generateReport,
        getReportById,
        getAllReports
    };
};


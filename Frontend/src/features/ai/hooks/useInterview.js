import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import {
  generateInterviewReport,
  getInterviewReport,
  getAllInterviewReports,
} from "../services/interview.api";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  const { interviewId } = useParams();

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
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      console.error("Error generating interview report:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await getInterviewReport(interviewReportId);
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (error) {
      console.error("Error fetching interview report by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      const interviewReports = response.interviewReports ?? [];
      setReports(interviewReports);
      return interviewReports;
    } catch (error) {
      console.error("Error fetching all interview reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getAllReports();
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    setReports,
    generateReport,
    getReportById,
    getAllReports,
  };
};

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/interview",
  withCredentials: true,
});

/**
 * @description This function is used to generate a new interview report according to user description, resume and job description
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resume,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  if (resume) formData.append("resume", resume);

  const response = await api.post("/", formData);
  return response.data;
};

/**
 *
 * @description this function is used to get a specific interview report by ID
 */
export const getInterviewReport = async (interviewReportId) => {
  const response = await api.get(`/report/${interviewReportId}`);
  return response.data;
};

/**
 * @description this function is used to get all the interview reports of a user
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/reports");
  return response.data;
};

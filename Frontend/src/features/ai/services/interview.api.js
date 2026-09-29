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
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await api.post("/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

/**
 *
 * @description this function is used to get a specific interview report by ID
 */
export const getInterviewReport = async (interviewReportId) => {
  const response = await api.get(`/report/${interviewReportId}`);
  return response;
};

/**
 * @description this function is used to get all the interview reports of a user
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/reports");
  return response;
};

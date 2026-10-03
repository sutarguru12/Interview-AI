import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api/interview`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status == 429) {
      console.log(
        error.response?.data?.message ||
          "Too many requests, Please try again later",
      );
    }

    return Promise.reject(error);
  },
);

/**
 * @description This function is used to generate a new interview report according to user description, resume and job description
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resume,
}) => {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    if (resume) formData.append("resume", resume);

    const response = await api.post("/", formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 *
 * @description this function is used to get a specific interview report by ID
 */
export const getInterviewReport = async (interviewReportId) => {
  try {
    const response = await api.get(`/report/${interviewReportId}`);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * @description this function is used to get all the interview reports of a user
 */
export const getAllInterviewReports = async () => {
  try {
    const response = await api.get("/reports");
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 *
 * @description this function is used to generate resume pdf on the basis of resume, jobDescription, selfDesctiption
 *
 */
export const generateResumePdf = async (interviewReportId) => {
  try {
    const response = await api.post(`/resume/pdf/${interviewReportId}`, null, {
      responseType: "blob",
    });
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

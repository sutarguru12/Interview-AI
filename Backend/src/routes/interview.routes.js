const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewRouter = express.Router();
const {
  interviewReportGeneratorController,
  interviewReportController,
  getAllInterviewReportsController,
  generateResumePdfController,
} = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

/**
 * @route api/interview/
 * @description generate a new interview report according to user description, resume and job description
 * @access private
 */
interviewRouter.post(
  "/",
  authMiddleware.authGetme,
  upload.single("resume"),
  interviewReportGeneratorController,
);

/**
 * @route api/interview/report/:interviewReportId
 * @description get a specific interview report by ID
 * @access private
 */
interviewRouter.get(
  "/report/:interviewReportId",
  authMiddleware.authGetme,
  interviewReportController,
);

/**
 * @description This route is used to get all the interview reports of a user
 * @route api/interview/reports
 * @access private
 */
interviewRouter.get(
  "/reports",
  authMiddleware.authGetme,
  getAllInterviewReportsController,
);

/**
 * @route GET api/interview/resume/pdf
 * @description Generate resume pdf on the basis of resume, jobDescription, selfDesctiption
 * @access public
 */
interviewRouter.post(
  "/resume/pdf/:interviewReportId",
  authMiddleware.authGetme,
  generateResumePdfController,
);

module.exports = interviewRouter;

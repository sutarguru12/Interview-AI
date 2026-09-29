const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewRouter = express.Router();
const {
  interviewReportGeneratorController,
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

module.exports = interviewRouter;

const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 *
 * @description This controller is used to generate a new interview report according to user description, resume and job description
 * @route api/interview/
 * @access private
 */
async function interviewReportGeneratorController(req, res) {
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
}

/**
 *
 *@description This controller is used to get a specific interview report by ID
 * @route api/interview/report/:interviewReportId
 * @access private
 */
async function interviewReportController(req, res) {
  const { interviewReportId } = req.params;
  const interviewReport =
    await interviewReportModel.findById(interviewReportId);

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }

  res.status(200).json({
    message: "Interview report retrieved successfully",
    interviewReport,
  });
}

/**
 * @description This controller is used to get all the interview reports of a user
 * @route api/interview/reports
 * @access private
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({
      user: req.user.id,
    })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  if (!interviewReports) {
    return res.status(404).json({
      message: "No interview reports found",
    });
  }

  res.status(200).json({
    message: "Interview reports retrieved successfully",
    interviewReports,
  });
}

module.exports = {
  interviewReportGeneratorController,
  interviewReportController,
  getAllInterviewReportsController,
};

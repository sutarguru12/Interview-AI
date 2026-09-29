const mongoose = require("mongoose");

/**
 *
 * - resumeText: String
 * - selfDescription: String
 * - jobDescription: String
 * 
 * - matchScore: Number
 * 
 *- Technical Questions =[{
                    question: String
                    intention: String
                    answer: String}]
 * - Behavioral Questions = [{
                        question: String
                        intention: String
                        answer: String}]
 * - Skill gaps = [{
                        skills: String
                        severity: {type: String,
                                    enum:['low', 'medium', 'high']}
                        }]
 * - Preparation plan = [{
                        day: Number
                        tasks: String
                        focus: String
                        }] 
*/

const technicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    intention: {
      type: String,
      required: [true, "intention required"],
    },
    answer: {
      type: String,
      required: [true, "answer required"],
    },
  },
  {
    _id: false,
  },
);

const behavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    intention: {
      type: String,
      required: [true, "intention required"],
    },
    answer: {
      type: String,
      required: [true, "answer required"],
    },
  },
  {
    _id: false,
  },
);

const skillGapSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: [true, "Skill is requires"],
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },
  },
  { _id: false },
);

const preparationPlanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Days required"],
  },
  focus: {
    type: String,
    required: [true, "focus required"],
  },
  task: [
    {
      type: String,
      required: [true, "task required"],
    },
  ],
});

const interviewReportSchema = new mongoose.Schema(
  {
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resume: {
      type: String,
      required: true,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  },
);
const interviewReportModel = mongoose.model(
  "interviewModel",
  interviewReportSchema,
);

module.exports = interviewReportModel;

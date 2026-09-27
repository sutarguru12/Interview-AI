const { GoogleGenAI, Behavior } = require("@google/genai");
require("dotenv").config();
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 to 100 indicating how well the candidate matches the job description",
    ),

  technicalQuestions: z.array(
    z.object({
      question: z
        .string()
        .describe(
          "The technical question that can be asked by the interviewer",
        ),
      intention: z
        .string()
        .describe(
          "The intention of the interviewer behind asking that question",
        ),
      answer: z
        .string()
        .describe(
          "How to answer this question, what points to cover, what approach to take, etc.",
        ),
    }),
  ),

  BehavioralQuestions: z.array(
    z.object({
      question: z
        .string()
        .describe(
          "The Behavioral question that can be asked by the interviewer",
        ),
      intention: z
        .string()
        .describe(
          "The intention of the interviewer behind asking that question",
        ),
      answer: z
        .string()
        .describe(
          "How to answer this question, what points to cover, what approach to take, etc.",
        ),
    }),
  ),

  Skillgaps: z.array(
    z.object({
      skill: z.string().describe("The skill that the candidate is lacking"),
      severity: z
        .string()
        .describe("The severity of the skill gap, can be low, medium or high"),
    }),
  ),

  preparationPlan: z.array(
    z.object({
      day: z
        .number()
        .describe("The day number of the preparation plan, starting from 1"),
      tasks: z.string().describe("The tasks to be done on that day"),
      focus: z.string().describe("The focus of the preparation on that day"),
    }),
  ),
});

async function generateInterviewReport({
  resume,
  jobDescription,
  selfDescription,
}) {
  const prompt = `you are an expert recruiter and interviewer. You have to generate an interview report for a candidate based on the resume, job description and self description provided. The report should contain the following:
1. A match score between 0 to 100 indicating how well the candidate matches the job description.
2. A list of technical questions that can be asked by the interviewer, along with the intention behind asking that question and how to answer it.
3. A list of behavioral questions that can be asked by the interviewer, along with the intention behind asking that question and how to answer it.
4. A list of skill gaps that the candidate has, along with the severity of each skill gap (low, medium or high).
5. A preparation plan for the candidate to improve their skills and prepare for the interview, with tasks and focus for each day.
    resume: ${resume}
    job description: ${jobDescription}
    self description: ${selfDescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(interviewReportSchema),
    },
  });

  console.log(JSON.parse(response.text));
}

module.exports = generateInterviewReport;

const { GoogleGenAI, Behavior } = require("@google/genai");
require("dotenv").config();
const { z } = require("zod");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 to 100 indicating how well the candidate matches the job description",
    ),

  technicalQuestions: z
    .array(
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
    )
    .min(10)
    .describe(
      "A list of technical questions that can be asked by the interviewer, along with the intention behind asking that question and how to answer it.",
    ),

  behavioralQuestions: z
    .array(
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
    )
    .min(10)
    .describe(
      "A list of behavioral questions that can be asked by interviewer, along with the intention behind asking that question and how to answer it.",
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z
          .string()
          .describe(
            "The severity of the skill gap, can be low, medium or high",
          ),
      }),
    )
    .min(7)
    .describe(
      "A list of skill gaps that the candidate has, along with the severity of each skill gap (Low, Medium or High).",
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number of the preparation plan, starting from 1"),
        tasks: z.string().describe("The tasks to be done on that day"),
        focus: z.string().describe("The focus of the preparation on that day"),
      }),
    )
    .min(7)
    .describe(
      "A preparation plan for the candidate to improve their skills and prepare for the interview, with tasks and focus for each day.",
    ),
  title: z
    .string()
    .describe(
      "The title of the job for which the interview report is generated",
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
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(interviewReportSchema),
    },
  });

  const report = interviewReportSchema.parse(JSON.parse(response.text));
  return report;
}

async function generatePdfFromHtml(htmlContent) {
  const isProd = process.env.NODE_ENV === "production";

  const browser = await puppeteer.launch(
    isProd
      ? {
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: "shell",
        }
      : {
          executablePath:
            "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
          headless: true,
        },
  );

  try {
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume PDF which can be converted to PDF with libraries like puppeteer",
      ),
  });

  const prompt = `You are an expert resume writer. You have to generate a resume in HTML format based on the resume, job description and self description provided. The resume should be in a professional format and should be ATS friendly. The resume should contain the following:
1. A professional summary that highlights the candidate's skills and experience.
2. A list of technical skills that the candidate possesses.
3. A list of work experience that the candidate has, along with the job title, company name, and duration of employment.
4. A list of educational qualifications that the candidate has, along with the degree, university name, and year of graduation.
5. A list of certifications that the candidate has, along with the certification name and year of completion.
6. A list of projects that the candidate has worked on, along with the project name, description, and technologies used.
do not add any additional information or sections to the resume that is not provided. The resume should be in a professional format and should be ATS friendly.
you can highlight the skills and experience of the candidate in a professional manner. it should not look like it is generated by AI.
resume should be 1 to 2 pages only
  resume: ${resume},
  selfDescription: ${selfDescription},
  jobDescription: ${jobDescription}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: z.toJSONSchema(resumePdfSchema),
    },
  });

  const JsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(JsonContent.html);

  return pdfBuffer;
}
module.exports = { generateInterviewReport, generateResumePdf };

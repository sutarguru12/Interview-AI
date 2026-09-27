const DB_Connect = require("./src/config/database");
const app = require("./src/app");
const {
  resume,
  jobDescription,
  selfDescription,
} = require("./src/services/ai.service");

const generateInterviewReport = require("./src/services/ai.service");

require("dotenv").config();
require("./src/config/database");

DB_Connect();
generateInterviewReport({ resume, jobDescription, selfDescription });

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Listniing on port ${PORT}`);
});

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.set("trust proxy", 1);

const {
  apiRateLimiter,
  interviewRateLimiter,
} = require("../src/middlewares/ratelimit.middleware");

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Require all the api here
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

//Use all the routes here
app.use("/api/auth", apiRateLimiter, authRouter);
app.use("/api/interview", interviewRateLimiter, interviewRouter);

module.exports = app;

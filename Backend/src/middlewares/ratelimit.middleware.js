const rateLimit = require("express-rate-limit");

const apiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please wait for 10 minutes",
  },
});

const interviewRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, Please try again after 15 min",
  },
});

module.exports = { apiRateLimiter, interviewRateLimiter };

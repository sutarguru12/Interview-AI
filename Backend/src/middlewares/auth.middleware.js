const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authGetme(req, res, next) {
  const token = req.cookies?.token;
  const decoded = jwt.decode(token);

  if (!token) {
    return res.status(401).json({ message: "token do not exist" });
  }
  const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

  if (isTokenBlacklisted) {
    return res.status(401).json({ message: "Token in invalid" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
  req.user = decoded;

  next();
}

module.exports = { authGetme };

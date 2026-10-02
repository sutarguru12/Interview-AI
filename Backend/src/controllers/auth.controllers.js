const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
/**
 * @name registerUserController
 * @description registers a new user, expects name, email and a password
 * @access public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email and password" });
  }

  const isUserExists = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExists) {
    if (isUserExists.username == username) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (isUserExists.email == email) {
      return res.status(400).json({ message: "Email already exists" });
    }
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      name: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  res.cookie("token", token);

  return res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name loginUserController
 * @description logs in a user, expects email and password
 * @access public
 *
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "invalid credentials." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "invalid email or password" });
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token);

  return res.status(200).json({
    message: "Logged in succesfully",
    user: { id: user._id, name: user.username, email: user.email },
    token,
  });
}

/**
 * @description Login using Google
 * @access public
 */
async function googleLoginControler(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ mesage: "Google Credentials required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Google account email not available" });
    }

    let user =
      (await userModel.findOne({ googleId })) ||
      (await userModel.findOne({ email }));

    if (user) {
      user.googleId = googleId;
      user.avatar = picture;

      await user.save();
    } else {
      let username = name || email.split("@")[0];
      if (await userModel.findOne({ username })) {
        username = `${username}${Date.now()}`;
      }
      user = await userModel.create({
        username,
        email,
        googleId,
        avatar: picture,
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token);

    return res.status(200).json({
      message: "Google login successful",
      user: { id: user._id, name: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Google login error: ", error);

    return res.status(401).json({ message: "Google authentication failed" });
  }
}

/**
 * @name logoutUserController
 * @description logout user, adds token in blacklist, expects token
 */
async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlacklistModel.create({
      token,
    });
  }

  res.clearCookie("token");

  return res.status(200).json({ message: "User logout successfully" });
}

/**
 * @name authGetMeController
 * @description gets the details of the user
 * @access public
 */
async function authGetMeController(req, res) {
  const user = await userModel.findById(req.user.id);

  res.status(200).json({
    message: "user details fetched successfully",
    user: { id: user._id, name: user.username, email: user.email },
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  authGetMeController,
  googleLoginControler,
};

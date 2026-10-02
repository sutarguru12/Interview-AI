const { Router } = require("express");
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description registers a new user, expects name, email and a password
 * @access public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description logs in a user, expects email and password
 * @access public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route POST /api/auth/google-login
 * @description login using google
 * @access public
 */
authRouter.post("/google", authController.googleLoginControler);

/**
 * @name /api/auth/logout
 * @description removes token from cookie and adds it to blacklist model
 * @access public
 */
authRouter.get("/logout", authController.logoutUserController);

/**
 * @route GET /api/auth/get-me
 * @description get the details of the user
 * @access private
 */
authRouter.get(
  "/get-me",
  authMiddleware.authGetme,
  authController.authGetMeController,
);

module.exports = authRouter;

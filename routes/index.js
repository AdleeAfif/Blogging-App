const { Router } = require("express");

const {
  registerUser,
  loginUser,
  authorizeUser,
  signOutUser,
} = require("../middlewares/access-control.middleware");
const blogRouter = require("./blog.route");
const { renderMainPage } = require("../controllers/blog.controller");

const router = Router();

router
  .route("/")
  .get((req, res) => {
    res.status(200).render("login");
  })
  .post(loginUser, (req, res) => {
    res.redirect("/blog");
  });

router
  .route("/register")
  .get((req, res) => {
    res.status(200).render("register");
  })
  .post(registerUser, (req, res) => {
    res.status(200).render("login");
  });

router.route("/signout").get(signOutUser);

router.use("/blog", blogRouter);

module.exports = { router };

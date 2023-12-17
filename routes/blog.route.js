const { Router } = require("express");
const multer = require("multer");

const {
  renderMainPage,
  renderCreatePage,
  createBlog,
  updateBlog,
} = require("../controllers/blog.controller");
const { authorizeUser } = require("../middlewares/access-control.middleware");

const router = Router();

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage }).single("image");

router
  .route("/")
  .get(authorizeUser, renderMainPage)
  .post(authorizeUser, updateBlog);

router
  .route("/create")
  .get(authorizeUser, renderCreatePage)
  .post(authorizeUser, upload, createBlog);

module.exports = router;

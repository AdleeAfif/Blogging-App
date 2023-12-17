const expressAsyncHandler = require("express-async-handler");
const {
  addBlog,
  readBlog,
  getBlogById,
  updateBlogById,
} = require("../services/blog.service");

const renderMainPage = async (req, res) => {
  const data = await readBlog(req.query.blogId);

  if (data.length === 0) {
    return res.render("endBlog");
  }
  const { title, imageTitle, image, blogText, email, id, likes, comments } =
    data[0];
  res.render("main", {
    title,
    imageTitle,
    image,
    blogText,
    email,
    likes,
    id,
    comments,
  });
};

const renderCreatePage = (req, res) => {
  res.render("create", { email: req.session.email });
};

const createBlog = expressAsyncHandler(async (req, res) => {
  const { title, imageTitle, email, blogText } = req.body;

  if (!(title && email && req.file)) res.status(400).redirect("/blog/create");

  const data = {
    title,
    imageTitle,
    email,
    blogText,
    image: req.file,
    dateCreated: new Date(),
    likes: 0,
    comments: [],
  };

  await addBlog(data);

  res.status(201).redirect("/blog");
});

const updateBlog = expressAsyncHandler(async (req, res) => {
  const { id, commentContent } = req.body;

  if (!commentContent) res.status(400).redirect("/blog");

  const blogDoc = await getBlogById(id);

  if (commentContent)
    blogDoc.comments.push({
      email: req.session.email,
      content: commentContent,
    });
  else blogDoc.likes++;

  await updateBlogById(id, blogDoc);

  return res.status(200).redirect("/blog");
});

module.exports = {
  renderMainPage,
  renderCreatePage,
  createBlog,
  updateBlog,
};

const $ = require("jquery"),
  queryString = require("query-string"),
  blogs = require("./blogs"),
  troll = require("./troll"),
  register = require("./register"),
  login = require("./login"),
  blogComments = require("./blogComments");

$(document).ready(function () {
  const blogId = queryString.parse(location.search).blogId;
  blogs.loadBlog(blogId);
  blogs.loadNextBlogListPage();
  blogs.registerBlogListListeners();

  troll.registerTrollListeners();
  login.registerLoginListeners(blogComments);

  register.registerForm();
});

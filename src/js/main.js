const $ = require("jquery"),
  queryString = require("query-string"),
  blogs = require("./blogs"),
  troll = require("./troll"),
  subscribe = require("./subscribe");

$(document).ready(function () {
  const blogId = queryString.parse(location.search).blogId;
  blogs.loadBlog(blogId);
  blogs.loadNextBlogListPage();
  blogs.registerBlogListListeners();

  troll.registerTrollListeners();

  subscribe.registerForm();
});

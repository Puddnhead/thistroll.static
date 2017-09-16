const $ = require("jquery"),
  blogs = require("./blogs"),
  troll = require("./troll"),
  subscribe = require("./subscribe");

$(document).ready(function () {
  blogs.loadCurrentBlog();
  blogs.loadNextBlogListPage();
  blogs.registerBlogListListeners();

  troll.registerTrollListeners();

  subscribe.registerForm();
});

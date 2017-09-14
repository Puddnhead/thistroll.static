const $ = require("jquery"),
  blogs = require("./blogs"),
  troll = require("./troll");

$(document).ready(function () {
  blogs.loadCurrentBlog();
  blogs.loadNextBlogListPage();
  blogs.registerBlogListListeners();

  troll.registerTrollListeners();
});

const $ = require("jquery"),
  thistroll = require("./thistroll");
$(document).ready(function () {
  thistroll.loadCurrentBlog();
  thistroll.loadBlogList();
});

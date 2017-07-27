const $ = require("jquery"),
  queryString = require("query-string"),
  moment = require("moment");

module.exports = {

  // location of the ec2 server
  serverHost: "http://thistroll.us-east-2.elasticbeanstalk.com",
  // serverHost: "http://localhost:8081",

  loadCurrentBlog: function () {
    const blogTitleH1 = document.getElementById("blogTitle"),
      blogDateH2 = document.getElementById("blogDate"),
      blogTextDiv = document.getElementById("blogText"),
      blogId = queryString.parse(location.search).blog,
      endpoint = blogId ? this.serverHost + "/blog?id=" + blogId : this.serverHost + "/blog/current";

    $.get(endpoint, function (blog) {
      blogTitleH1.innerHTML = blog.title;
      blogDateH2.innerHTML = blog.createdOn ? new moment(blog.createdOn).format("LL") : "";
      blogTextDiv.innerHTML = blog.text;
    });
  },

  loadBlogList: function () {
    const endpoint = this.serverHost + "/blog/all",
      blogList = document.getElementById("blogList");

    let index, blogCount;

    $.get(endpoint, function (blogs) {
      for (index = 0, blogCount = blogs.length; index < blogCount; index++) {
        blogList.innerHTML += "<li><a href='index.html?blog=" +
          blogs[index].id + "'>" + blogs[index].title + "</a></li>";
      }
    });
  }
};

const $ =       require("jquery"),
  queryString = require("query-string"),
  moment =      require("moment"),
  slick =       require("slick-carousel-browserify"),
  properties =  require("./properties");

module.exports = {

  loadCurrentBlog: function () {
    const blogTitleH1 = document.getElementById("blogTitle"),
      blogLocationH2 = document.getElementById("blogLocation"),
      blogDateH2 = document.getElementById("blogDate"),
      blogTextDiv = document.getElementById("blogText"),
      blogId = queryString.parse(location.search).blog,
      endpoint = blogId ? properties.serverHost + "/blog?id=" + blogId : properties.serverHost + "/blog/current";

    $.get(endpoint, function (blog) {
      blogTitleH1.innerHTML = blog.title;
      blogLocationH2.innerHTML = blog.location ? blog.location : "";
      blogDateH2.innerHTML = blog.createdOn ? new moment(blog.createdOn).format("LL") : "";
      blogTextDiv.innerHTML = blog.text;
    });
  },

  loadBlogList: function () {
    const endpoint = properties.serverHost + "/blog/all",
      blogList = document.getElementById("blogList");

    let index, blogCount, listItem;

    $.get(endpoint, function (blogs) {
      for (index = 0, blogCount = blogs.length; index < blogCount; index++) {
        listItem = "<li><p class='blogListTitle'><a href='index.html?blog=" +
          blogs[index].id + "'>" + blogs[index].title + "</a></p>";
        if (blogs[index].location) {
          listItem += "<p class='blogListLocation'>" + blogs[index].location + "</p>";
        }
        listItem += "</li>";
        blogList.innerHTML += listItem;
      }
    });
  },

  loadBlogImages: function () {
    let carousel = document.getElementById("carousel");

    slick($(carousel), {
      slidesToShow: 1,
      slidesToScroll: 3,
      lazyLoad: true,
      centerMode: true,
      dots: true,
      speed: 500,
      centerPadding: "10%"
    });
  }
};

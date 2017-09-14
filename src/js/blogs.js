const $ =       require("jquery"),
  queryString = require("query-string"),
  moment =      require("moment"),
  slick =       require("slick-carousel-browserify"),
  properties =  require("./properties"),
  LuminousGallery =    require("luminous-lightbox").LuminousGallery;

module.exports = {
  blogListPage: 0,

  loadCurrentBlog: function () {
    const blogTitleH1 = document.getElementById("blogTitle"),
      blogLocationH2 = document.getElementById("blogLocation"),
      blogDateH2 = document.getElementById("blogDate"),
      blogTextDiv = document.getElementById("blogText"),
      blogId = queryString.parse(location.search).blog,
      endpoint = blogId ? properties.serverHost + "/blog/" + blogId : properties.serverHost + "/blog/current";

    $.get(endpoint, function (blog) {
      this.loadBlogImages(blog.id);
      blogTitleH1.innerHTML = blog.title;
      blogLocationH2.innerHTML = blog.location ? blog.location : "";
      blogDateH2.innerHTML = blog.createdOn ? new moment(blog.createdOn).format("LL") : "";
      blogTextDiv.innerHTML = blog.text;
    }.bind(this));
  },

  loadNextBlogListPage: function () {
    const endpoint = properties.serverHost + "/blog/page?pageNumber=" + this.blogListPage,
      blogList = document.getElementById("blogList"),
      seeMoreLink = document.getElementById("seeMoreLink");
    let index, blogCount, listItem, blogs;

    $.get(endpoint, function (response) {
      blogs = response.blogs;
      for (index = 0, blogCount = blogs.length; index < blogCount; index++) {
        listItem = "<li><p class='blogListTitle'><a href='index.html?blog=" +
          blogs[index].id + "'>" + blogs[index].title + "</a></p>";
        if (blogs[index].location) {
          listItem += "<p class='blogListLocation'>" + blogs[index].location + "</p>";
        }
        listItem += "</li>";
        blogList.innerHTML += listItem;
      }
      if (!response.lastPage) {
        seeMoreLink.style.display = "inline";
      } else {
        seeMoreLink.style.display = "none";
      }
    });
    this.blogListPage++;
  },

  loadBlogImages: function (blogId) {
    const endpoint = properties.serverHost + "/blog/" + blogId + "/images",
      carousel = document.getElementById("carousel");

    let index, imageCount;

    $.get(endpoint, function (imageUrls) {
      if (imageUrls && imageUrls.length) {
        $(carousel).css("display", "block");

        for (index = 0, imageCount = imageUrls.length; index < imageCount; index++) {
          carousel.innerHTML += "<div class='slide'>"
            + "<a class='lightboxTrigger' href='" + imageUrls[index] + "'>"
            + "<img class='slideImage' src='" + imageUrls[index] + "' /></a></div>";
        }

        if (imageCount % 2 === 0) {
          carousel.innerHTML += "<div class='slide'><img class='slideImage' src='resources/images/thistroll.png' /></div>";
        }

        slick($(carousel), {
          slidesToShow: 1,
          slidesToScroll: 1,
          lazyLoad: false,
          centerMode: true,
          dots: true,
          speed: 500,
          centerPadding: "10%"
        });


        new LuminousGallery(document.querySelectorAll(".lightboxTrigger"));
      }
    });
  },

  registerBlogListListeners: function() {
    const seeMoreLink = document.getElementById("seeMoreLink");
    seeMoreLink.addEventListener("click", this.loadNextBlogListPage.bind(this));
  }
};

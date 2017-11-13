const $ =       require("jquery"),
  moment =      require("moment"),
  slick =       require("slick-carousel-browserify"),
  properties =  require("./properties"),
  LuminousGallery =    require("luminous-lightbox").LuminousGallery;

module.exports = {
  blogListPage: 0,

  loadBlog: function (blogId) {
    const blogTitleH1 = document.getElementById("blogTitle"),
      blogLocationH2 = document.getElementById("blogLocation"),
      blogDateH2 = document.getElementById("blogDate"),
      blogTextDiv = document.getElementById("blogText"),
      endpoint = blogId ? properties.serverHost + "/blog/" + blogId : properties.serverHost + "/blog/current";

    $.get(endpoint, function (blog) {
      const blogTextLoadingIndicator = $("#blogTextLoadingIndicator");
      if (blogTextLoadingIndicator) {
        blogTextLoadingIndicator.remove();
      }
      this.loadBlogImages(blog.id);
      blogTitleH1.innerHTML = blog.title;
      blogLocationH2.innerHTML = blog.location ? blog.location : "";
      blogDateH2.innerHTML = blog.createdOn ? new moment(blog.createdOn).format("LL") : "";
      blogTextDiv.innerHTML = blog.text;
    }.bind(this));
  },

  loadNextBlogListPage: function () {
    const endpoint = properties.serverHost + "/blog/page?pageNumber=" + this.blogListPage,
      blogList = $("#blogList"),
      seeMoreLink = $("#seeMoreLink");
    let index, blogCount, listItem, blogs;

    $.get(endpoint, function (response) {
      const blogListLoadingIndicator = $("#blogListLoadingIndicator");
      if (blogListLoadingIndicator) {
        blogListLoadingIndicator.remove();
      }
      blogs = response.blogs;
      for (index = 0, blogCount = blogs.length; index < blogCount; index++) {
        listItem = $("<li></li>");
        listItem.append($("<p class='blogListTitle'><a href='#'>" + blogs[index].title + "</a></p>"));
        if (blogs[index].location) {
          listItem.append($( "<p class='blogListLocation'>" + blogs[index].location + "</p>"));
        }

        listItem.click(this.generateLoadBlogFunction(blogs[index].id));
        blogList.append(listItem);
      }
      if (!response.lastPage) {
        seeMoreLink.css("display", "inline");
      } else {
        seeMoreLink.css("display", "none");
      }
    }.bind(this));
    this.blogListPage++;
  },

  loadBlogImages: function (blogId) {
    const endpoint = properties.serverHost + "/blog/" + blogId + "/images";

    $.get(endpoint, function (imageUrls) {
      const carouselContainer = $("#carouselContainer");
      let carousel = $("#carousel"),
        index, imageCount;

      if (carousel) {
        carousel.slick("unslick").slick("reinit");
        carousel.remove();
      }

      if (imageUrls && imageUrls.length) {
        carousel = $("<div id='carousel' class='carousel'></div>");
        carousel.css("display", "block");
        carouselContainer.append(carousel);

        for (index = 0, imageCount = imageUrls.length; index < imageCount; index++) {
          carousel.append($("<div class='slide'>"
            + "<a class='lightboxTrigger' href='" + imageUrls[index] + "'>"
            + "<img class='slideImage' data-lazy='" + imageUrls[index] + "' /></a></div>"
          ));
        }

        if (imageCount % 2 === 0) {
          carousel.append($("<div class='slide'><img class='slideImage' src='resources/images/thistroll.png' /></div>"));
        }

        slick(carousel, {
          slidesToShow: 1,
          slidesToScroll: 1,
          lazyLoad: "ondemand",
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
  },

  generateLoadBlogFunction: function(blogId) {
    return function () {
      this.loadBlog(blogId);
    }.bind(this);
  },
};

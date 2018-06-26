const $ =       require("jquery"),
  moment =      require("moment"),
  slick =       require("slick-carousel-browserify"),
  properties =  require("./properties"),
  blogComments =    require("./blogComments"),
  LuminousGallery =    require("luminous-lightbox").LuminousGallery;

module.exports = {
  blogListPage: 0,

  loadBlog: function (blogId) {
    const blogTitleH1 = $("#blogTitle"),
      blogLocationH2 = $("#blogLocation"),
      blogDateH2 = $("#blogDate"),
      blogTextDiv = $("#blogText"),
      endpoint = blogId ? properties.serverHost + "/blog/" + blogId : properties.serverHost + "/blog/current";

      let blogLocation, blogDate;

    $.get(endpoint, function (blog) {
      const blogTextLoadingIndicator = $("#blogTextLoadingIndicator");
      if (blogTextLoadingIndicator) {
        blogTextLoadingIndicator.remove();
      }
      this.loadBlogImages(blog.id);
      blogTitleH1.text(blog.title);
      blogLocation = blog.location ? blog.location : "";
      blogLocationH2.text(blogLocation);
      blogDate = blog.createdOn ? new moment(blog.createdOn).format("LL") : "";
      blogDateH2.text(blogDate);
      blogTextDiv.html(blog.text);

      blogComments.loadBlogComments(blog.id);
    }.bind(this));
  },

  loadNextBlogListPage: function () {
    const endpoint = properties.serverHost + "/blog/page?pageNumber=" + this.blogListPage,
      blogList = $("#blogList"),
      seeMoreLink = $("#seeMoreLink");
    let index, blogCount, listItem, blogs;

    $.get(endpoint, function (response) {
      const blogListLoadingIndicator = $("#blogListLoadingIndicator");

      let lastBlogItemYCoord;

      if (seeMoreLink.css("display") !== "none") {
        lastBlogItemYCoord = seeMoreLink.offset().top - 100;
      }

      if (blogListLoadingIndicator) {
        blogListLoadingIndicator.remove();
      }
      blogs = response.blogs;
      for (index = 0, blogCount = blogs.length; index < blogCount; index++) {
        listItem = $("<li class='blogListItem'></li>");
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
      if (lastBlogItemYCoord) {
        $("html, body").animate({
          scrollTop: lastBlogItemYCoord
        }, 500);
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
          carousel.append($("<div class='slide'><img class='slideImage' src='resources/images/thistroll.gif' /></div>"));
        }

        slick(carousel, {
          slidesToShow: 1,
          slidesToScroll: 1,
          lazyLoad: "ondemand",
          centerMode: true,
          dots: true,
          speed: 500,
          centerPadding: "0%"
        });


        new LuminousGallery(document.querySelectorAll(".lightboxTrigger"));
      }
    });
  },

  registerBlogListListeners: function() {
    $("#seeMoreLink").click(function (e) {
        e.preventDefault();
        this.loadNextBlogListPage();
    }.bind(this));
  },

  generateLoadBlogFunction: function(blogId) {
    return function () {
      this.loadBlog(blogId);
    }.bind(this);
  },
};

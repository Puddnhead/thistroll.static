var troll = {

  // location of the ec2 server
  serverHost: "http://thistroll.us-east-2.elasticbeanstalk.com",
  //serverHost: "http://localhost:8081",

  loadCurrentBlog: function () {
    var blogTitleH1 = document.getElementById("blogTitle"),
      blogDateH2 = document.getElementById("blogDate"),
      blogTextDiv = document.getElementById("blogText"),
      blogId = $.getUrlVar("blog"),
      endpoint = blogId ? this.serverHost + "/blog?id=" + blogId : this.serverHost + "/blog/current";

    $.get(endpoint, function (blog) {
      blogTitleH1.innerHTML = blog.title;
      blogDateH2.innerHTML = blog.createdOn ? new Date(blog.createdOn).toLocaleDateString() : "";
      blogTextDiv.innerHTML = blog.text;
    });
  },

  loadBlogList: function () {
    var endpoint = this.serverHost + "/blog/all",
      blogList = document.getElementById("blogList"),
      index,
      blogCount;

    $.get(endpoint, function (blogs) {
      for (index = 0, blogCount = blogs.length; index < blogCount; index++) {
        blogList.innerHTML += "<li><a href='index.html?blog=" +
          blogs[index].id + "'>" + blogs[index].title + "</a></li>";
      }
    });
  }
};

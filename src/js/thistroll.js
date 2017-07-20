var troll = {

  // location of the ec2 server
  serverHost: "http://thistroll.us-east-2.elasticbeanstalk.com",
  // serverHost: "http://localhost:8081",

  loadCurrentBlog: function () {
    var blogTitleH1 = document.getElementById("blogTitle"),
      blogDateH2 = document.getElementById("blogDate"),
      blogTextDiv = document.getElementById("blogText"),
      endpoint = this.serverHost + "/blog/current";

    $.get(endpoint, function (blog) {
      blogTitleH1.innerHTML = blog.title;
      blogDateH2.innerHTML = blog.createdOn ? new Date(blog.createdOn).toLocaleDateString() : "";
      blogTextDiv.innerHTML = blog.text;
    });
  }
}

const $ = require("jquery"),
  queryString = require("query-string"),
  moment = require("moment");

let clearTextareaNextAction = true;

module.exports = {

  // location of the ec2 server
  serverHost: "http://thistroll.us-east-2.elasticbeanstalk.com",
  //serverHost: "http://localhost:8081",

  loadCurrentBlog: function () {
    const blogTitleH1 = document.getElementById("blogTitle"),
      blogLocationH2 = document.getElementById("blogLocation"),
      blogDateH2 = document.getElementById("blogDate"),
      blogTextDiv = document.getElementById("blogText"),
      blogId = queryString.parse(location.search).blog,
      endpoint = blogId ? this.serverHost + "/blog?id=" + blogId : this.serverHost + "/blog/current";

    $.get(endpoint, function (blog) {
      blogTitleH1.innerHTML = blog.title;
      blogLocationH2.innerHTML = blog.location ? blog.location : "";
      blogDateH2.innerHTML = blog.createdOn ? new moment(blog.createdOn).format("LL") : "";
      blogTextDiv.innerHTML = blog.text;
    });
  },

  loadBlogList: function () {
    const endpoint = this.serverHost + "/blog/all",
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

  registerTrollListeners: function () {
    const textBox = document.getElementById("trollTextarea"),
      endpoint = this.serverHost + "/troll";

    textBox.addEventListener("focus", function () {
      if (clearTextareaNextAction) {
        textBox.value = "";
        clearTextareaNextAction = false;
      }
    });

    textBox.addEventListener("keypress", function (event) {
      if (clearTextareaNextAction) {
        clearTextareaNextAction = false;
        textBox.value = "";
      } else if (event.charCode === 13) {
        $.ajax({
            type: "POST",
            url: endpoint,
            data: textBox.value,
            contentType: "text/plain",
            success: function (answer) {
              clearTextareaNextAction = true;
              textBox.value = answer;
            }
        });
      }
    });
  }
};

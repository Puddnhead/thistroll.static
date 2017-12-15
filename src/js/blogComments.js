const $ =         require("jquery"),
  properties =    require("./properties"),
  dateUtil =      require("./dateUtil"),
  sessionModel =  require("./sessionModel"),
  login =         require("./login"),
  register =      require("./register"),
  notify =        require("./notify");

module.exports = {
  _currentBlog: null,

  loadBlogComments: function (blogId) {
    const endpoint = properties.serverHost + "/blog/" + blogId + "/comments",
      blogCommentsDiv = $("#blogCommentsDiv"),
      loadingIndicator =
        $("<img class='loadingIndicator' id='blogCommentsLoadingIndicator' src='resources/images/loading.gif' />");

    this._currentBlog = blogId;

    blogCommentsDiv.empty();
    blogCommentsDiv.append($("<h2 class='blogCommentsHeader'>Opinions</h2>"));
    blogCommentsDiv.append(loadingIndicator);

    $.get(endpoint, function (blogComments) {
      let blogComment, blogCommentHeader, index, timestamp, deleteLink, deleteFunction;

      loadingIndicator.remove();

      for (index = 0; index < blogComments.length; index++) {
        timestamp = dateUtil.parseTimeAgo(blogComments[index].createdOn);

        blogComment = $("<div class='blogComment'></div>");
        blogCommentHeader = $("<div class='blogCommentHeader'></div>");
        blogCommentHeader.append($("<div class='blogCommentAuthor'>" + blogComments[index].username + "</div>"));
        deleteLink = $("<a href='#' class='deleteComment' data-comment-id=" + blogComments[index].id + ">X</a>");
        blogCommentHeader.append(deleteLink);
        blogCommentHeader.append($("<div class='blogCommentTimestamp'>" + timestamp + "</div>"));
        blogComment.append(blogCommentHeader);

        deleteFunction = this._createDeleteBlogCommentFunction(this._currentBlog, blogComments[index].id);
        deleteLink.click(deleteFunction.bind(this));

        blogComment.append($("<div><p class='comment'>" + blogComments[index].comment + "</p></div>"));
        blogCommentsDiv.append(blogComment);
      }

      if (sessionModel.isLoggedIn()) {
        this._createAddCommentDiv();
      } else {
        this._createLoginOrRegisterDiv();
      }
    }.bind(this));
  },

  _createDeleteBlogCommentFunction(blogId, commentId) {
    const deleteEndpoint = properties.serverHost + "/blog/comment/delete";

    return function () {
      $.ajax({
          type: "POST",
          url: deleteEndpoint,
          data: JSON.stringify({
            blogId: blogId,
            id: commentId
          }),
          contentType: "application/json",
          success: function () {
            this.reloadBlogComments();
          }.bind(this),
          error: function () {
            notify.error("Error deleting comment");
          },
          xhrFields: {
            withCredentials: true
          },
      });
    }.bind(this);
  },

  reloadBlogComments: function () {
    if (this._currentBlog) {
      this.loadBlogComments(this._currentBlog);
    }
  },

  _createAddCommentDiv: function () {
    const blogCommentsDiv = $("#blogCommentsDiv"),
      addCommentDiv = $("<div id='addCommentDiv' class='addCommentDiv'>" +
      "<a href='#' id='addCommentLink'>" +
      "<img src='resources/images/comments.gif' /> Add Comment</a></div>");

    blogCommentsDiv.append(addCommentDiv);

    $("#addCommentLink").click(function (e) {
      e.preventDefault();
      this._renderNewCommentTextBox();
    }.bind(this));
  },

  _createLoginOrRegisterDiv: function () {
    const blogCommentsDiv = $("#blogCommentsDiv"),
      loginOrRegisterDiv = $("<div class='loginOrRegisterDiv'>" +
        "<a href='#' id='blogCommentLoginLink'>Login</a> or " +
        "<a href='#' id='blogCommentRegisterLink'>Register</a> to add comments</div>");

    blogCommentsDiv.append(loginOrRegisterDiv);

    $("#blogCommentLoginLink").click(function (e) {
      e.preventDefault();
      login.loginDialog(this.reloadBlogComments);
    }.bind(this));
    $("#blogCommentRegisterLink").click(function (e) {
      e.preventDefault();
      register.displayRegistrationForm();
    });
  },

  _renderNewCommentTextBox: function () {
    const addCommentDiv = $("#addCommentDiv"),
      endpoint = properties.serverHost + "/blog/comment";

    let commentTextbox, submitButton;

    addCommentDiv.empty();
    commentTextbox = $("<hr/><textarea id='blogCommentTextarea' maxlength=512></textarea>");
    submitButton = $("<br/><input type='button' class='addCommentButton' id='addCommentButton' value='ADD' />");
    addCommentDiv.append(commentTextbox);
    addCommentDiv.append(submitButton);

    $("#addCommentButton").click(function (e) {
      e.preventDefault();
      $.ajax({
          type: "POST",
          url: endpoint,
          data: JSON.stringify({
            blogId: this._currentBlog,
            comment: $("#blogCommentTextarea").val()
          }),
          contentType: "application/json",
          success: function () {
            this.reloadBlogComments();
          }.bind(this),
          error: function () {
            notify.error("Error adding comment");
          },
          xhrFields: {
            withCredentials: true
          },
      });
    }.bind(this));
  }
}

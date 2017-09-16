const properties =  require("./properties"),
  notify =          require("./notify");
let $ = window.jQuery = require("jquery");
require("parsleyjs");

module.exports = {

  registerForm: function () {
    $("#headerSubscribeBtn").click(function () {
      $("#headerSubscribeBtn").hide();
      $("#trollDiv").css("display", "none");
      $("#subscribeDiv").css("display", "inline-block");
    });

    $("#subscribeForm").parsley().on("field:validated", function() {
        let ok = $(".parsley-error").length === 0;
        $(".bs-callout-info").toggleClass("hidden", !ok);
        $(".bs-callout-warning").toggleClass("hidden", ok);
      })
      .on("form:submit", function() {
        const endpoint = properties.serverHost + "/user/register",
          subscribeRequest = {
            "username": $("#usernameInput").val(),
            "email": $("#emailInput").val(),
            "password": $("#passwordInput").val(),
            "notificationsEnabled": true
          },
          settings = {
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(subscribeRequest),
            error: this._handleUserRegistrationError,
            success: this._handleUserRegistrationSuccess.bind(this)
          },
          firstName = $("#firstNameInput").val(),
          lastName = $("lastNameInput").val();

        if (firstName) {
          subscribeRequest["firstName"] = firstName;
        }
        if (lastName) {
          subscribeRequest["lastName"] = lastName;
        }

        $("#subscribeButton").prop("disabled", true);
        $.ajax(endpoint, settings);

        // don't actually submit the form
        return false;
      }.bind(this));

      $("#cancelLink").click(this._handleCancel.bind(this));
  },

  _handleCancel: function () {
    $("#headerSubscribeBtn").show();
    $("#subscribeDiv").css("display", "none");
    $("#trollDiv").css("display", "inline-block");
    this._resetForm();
  },

  _handleUserRegistrationError: function (data) {
    let message = data && data.responseJSON && data.responseJSON.message
      ? data.responseJSON.message
      : "Error creating subscription";

    $("#subscribeButton").prop("disabled", false);
    notify.error(message);
  },

  _handleUserRegistrationSuccess: function (data) {
    this._handleCancel();
    notify.success("Successfully subscribed user " + data.username + " with email " + data.email);
  },

  _resetForm: function () {
    $("#subscribeButton").prop("disabled", false);
    $("#subscribeForm")[0].reset();
    $(".subscribeInput").removeClass("parsley-success");
    $(".subscribeInput").removeClass("parsley-error");
  }
}

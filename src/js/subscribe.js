const properties =  require("./properties"),
  notify =          require("./notify");
let $ = window.jQuery = require("jquery");
require("parsleyjs");

const animationDistance = properties.subscribe.animationDistance,
  animationDuration = properties.subscribe.animationDuration,
  downAnimationProps = {
    "margin-top": "+=" + animationDistance
  },
  upAnimationProps = {
    "margin-top": "-=" + animationDistance
  };

module.exports = {

  registerForm: function () {
    $("#headerSubscribeBtn").click(function () {
      $("#headerSubscribeBtn").hide();
      this._slideSwitchDivs($("#trollDiv"), $("#subscribeDiv"));
    }.bind(this));

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
    this._slideSwitchDivs($("#subscribeDiv"), $("#trollDiv"));
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
  },

  _slideSwitchDivs: function (previous, next) {
    // animate previous div down and off
    previous.animate(downAnimationProps, animationDuration, "swing", function () {
      // hide previous div and animate it back to its original position
      next.css("visibility", "hidden");
      previous.hide();
      next.css("display", "inline-block");
      previous.animate(upAnimationProps, 1, "swing", function () {
          // animate next div off the page
          next.animate(downAnimationProps, 1, "swing", function () {
            // make next div visible and animate it back onto validationSuccessGreen
            next.css("visibility", "visible")
              .animate(upAnimationProps, animationDuration);
          });
        });
    });
  }
}

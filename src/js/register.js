const properties =  require("./properties"),
  notify =          require("./notify"),
  login =           require("./login");
let $ = window.jQuery = require("jquery");
require("parsleyjs");

const animationDistance = properties.register.animationDistance,
  animationDuration = properties.register.animationDuration,
  downAnimationProps = {
    "margin-top": "+=" + animationDistance
  },
  upAnimationProps = {
    "margin-top": "-=" + animationDistance
  };

module.exports = {

  _registrationFormVisible: false,

  displayRegistrationForm: function () {
    if (!this._registrationFormVisible) {
      $("html, body").animate({
        scrollTop: 0
      }, 500);
      this._registrationFormVisible = true;
      this._slideSwitchDivs($("#trollDiv"), $("#registerDiv"), this._animateheaderRegisterBtn.bind(this));
    }
  },

  registerForm: function () {
    $("#headerRegisterBtn").click(this.displayRegistrationForm.bind(this));

    $("#registerForm").parsley().on("field:validated", function() {
        let ok = $(".parsley-error").length === 0;
        $(".bs-callout-info").toggleClass("hidden", !ok);
        $(".bs-callout-warning").toggleClass("hidden", ok);
      })
      .on("form:submit", function() {
        const endpoint = properties.serverHost + "/user/register",
          registerRequest = {
            "username": $("#usernameInput").val(),
            "email": $("#emailInput").val(),
            "password": $("#passwordInput").val(),
            "notificationsEnabled": $("#subscribeToUpdates")[0].checked
          },
          settings = {
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(registerRequest),
            error: this._handleUserRegistrationError,
            success: this._handleUserRegistrationSuccess.bind(this)
          },
          firstName = $("#firstNameInput").val(),
          lastName = $("lastNameInput").val();

        if (firstName) {
          registerRequest["firstName"] = firstName;
        }
        if (lastName) {
          registerRequest["lastName"] = lastName;
        }

        $("#registerButton").prop("disabled", true);
        $.ajax(endpoint, settings);

        // don't actually submit the form
        return false;
      }.bind(this));

      $("#cancelLink").click(this.cancelRegistration.bind(this));
  },

  cancelRegistration: function () {
    if (this._registrationFormVisible) {
      this._registrationFormVisible = false;
      this._animateregisterButton(false, function () {
        this._slideSwitchDivs($("#registerDiv"), $("#trollDiv"));
        this._resetForm();
      }.bind(this));
    }
  },

  _handleUserRegistrationError: function (data) {
    let message = data && data.responseJSON && data.responseJSON.message
      ? data.responseJSON.message
      : "Error registering user";

    $("#registerButton").prop("disabled", false);
    notify.error(message);
  },

  _handleUserRegistrationSuccess: function (data) {
    const password = $("#passwordInput").val();
    this.cancelRegistration();

    login.login(data.username, password);
  },

  _resetForm: function () {
    $("#registerButton").prop("disabled", false);
    $("#registerForm")[0].reset();
    $(".registerInput").removeClass("parsley-success");
    $(".registerInput").removeClass("parsley-error");
  },

  _slideSwitchDivs: function (previous, next, callback) {
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
              .animate(upAnimationProps, animationDuration, "swing", callback);
          });
        });
    });
  },

  _animateheaderRegisterBtn: function () {
    this._animateregisterButton(true);
  },

  _animateregisterButton: function (headerToDiv, callback) {
    const headerRegisterBtn = $("#headerRegisterBtn"),
      divRegisterBtn = $("#registerButton"),
      headerBtnOffset = headerRegisterBtn.offset(),
      divRegisterOffset = divRegisterBtn.offset(),
      margin = parseInt(divRegisterBtn.css("margin-top").split("px")[0]);
    let animateButton, style, topChange, leftChange, btnToHide, btnToShow;

    headerRegisterBtn.mouseout();
    divRegisterBtn.mouseout();
    if (headerToDiv) {
      style ="position: absolute; top: " + (headerBtnOffset.top - margin) +
        "; left: " + (headerBtnOffset.left - margin) + ";";
      btnToHide = headerRegisterBtn;
      btnToShow = divRegisterBtn;
      topChange = "+=" + (divRegisterOffset.top - headerBtnOffset.top);
      leftChange = "-=" + (headerBtnOffset.left - divRegisterOffset.left);
    } else {
      style ="position: absolute; top: " + (divRegisterOffset.top - margin) +
        "; left: " + (divRegisterOffset.left - margin) + ";";
      btnToHide = divRegisterBtn;
      btnToShow = headerRegisterBtn;
      topChange = "-=" + (divRegisterOffset.top - headerBtnOffset.top);
      leftChange = "+=" + (headerBtnOffset.left - divRegisterOffset.left);
    }
    animateButton = $("<input type='button' class='registerButton' value='REGISTER' " +
      "style=\"" + style + "\"/>");
    $("body").append(animateButton);
    btnToHide.css("opacity", 0);

    animateButton.animate({
      "top": topChange,
      "left": leftChange
    }, 500, "swing", function () {
      btnToShow.css("opacity", 1);
      animateButton.remove();
      if (callback) {
        callback();
      }
    });
  }
}

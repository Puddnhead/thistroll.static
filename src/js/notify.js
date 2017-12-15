const $ = require("jquery");

const fadeDuration = 500;

module.exports = {
  success: function (message, duration) {
    let displayTime = duration ? duration : 3000;

    $("html, body").animate({
      scrollTop: 0
    }, 500);
    $("#notificationsBar").text(message)
      .addClass("success")
      .fadeIn(fadeDuration, function () {
        setTimeout(function () {
          $("#notificationsBar").fadeOut(fadeDuration, function () {
              $("#notificationsBar").text("")
                .removeClass("success");
            });
        }, displayTime);
      });
  },

  error: function (message, duration) {
    $("html, body").animate({
      scrollTop: 0
    }, 500);
    let displayTime = duration ? duration : 3500;

    $("#notificationsBar").text(message)
      .addClass("error")
      .fadeIn(fadeDuration, function () {
        setTimeout(function () {
          $("#notificationsBar").fadeOut(fadeDuration, function () {
              $("#notificationsBar").text("")
                .removeClass("error");
            });
        }, displayTime);
      });
  }
}

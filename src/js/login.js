const $ =       require("jquery"),
  properties =  require("./properties"),
  notify =      require("./notify");

module.exports = {

    login: function () {
      const textBox = $("#trollTextarea"),
        loginEndpoint = properties.serverHost + "/session/login";
      let username, password;

      try {
        username = textBox.val().split(" ")[1],
        password = textBox.val().split(" ")[2];
        textBox.attr("disabled", true);
        textBox.val("...");
        $.ajax({
            type: "POST",
            url: loginEndpoint,
            data: JSON.stringify({
              username: username,
              password: password
            }),
            contentType: "application/json",
            success: function () {
              notify.success("Successfully logged in");
              textBox.val("Proceed");
              textBox.attr("disabled", false);
            },
            error: this._handleLoginError,
            xhrFields: {
              withCredentials: true
            },
        });
      } catch(err) {
        this._handleLoginError(err);
      }
    },

    _handleLoginError: function (err) {
      const textBox = $("#trollTextarea");

      notify.error("Error logging in.");
      if (err && err.responseJSON && err.responseJSON.message) {
        textBox.val(err.responseJSON.message);
      } else {
        textBox.val("");
      }
      textBox.attr("disabled", false);
    }
}

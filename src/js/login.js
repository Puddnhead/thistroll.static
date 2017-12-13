const $ =       require("jquery"),
  vex =         require("vex-js"),
  properties =  require("./properties"),
  notify =      require("./notify");

vex.registerPlugin(require("vex-dialog"))
vex.defaultOptions.className = "vex-theme-top";
vex.defaultO

module.exports = {

  registerLoginListeners: function () {
    const loginLink = $("#loginLink");
    loginLink.click(function (e) {
      e.preventDefault();
      this.loginDialog();
    }.bind(this));
  },

  loginDialog: function () {
    vex.dialog.open({
      message: "Login",
      input: [
        "<input name='username' type='text' placeholder='Username'/>",
        "<input name='password' type='password' placeholder='Password' />"
      ].join(""),
      callback: function (data) {
        if (data) {
          this.login(data.username, data.password);
        }
      }.bind(this)
    });
    return false;
  },

  login: function (username, password) {
    const loginEndpoint = properties.serverHost + "/session/login";

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
        },
        error: function () {
          notify.error("Error logging in.");
        },
        xhrFields: {
          withCredentials: true
        },
    });
  }
}

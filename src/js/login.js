const $ =       require("jquery"),
  vex =         require("vex-js"),
  _ =           require("lodash"),
  properties =  require("./properties"),
  notify =      require("./notify");

vex.registerPlugin(require("vex-dialog"))
vex.defaultOptions.className = "vex-theme-top";
vex.defaultO

module.exports = {

  registerLoginListeners: function () {
    const loginLink = $("#loginLink");

    if (this.isLoggedIn()) {
      this.setLogoutText();
    }
    loginLink.click(function (e) {
      e.preventDefault();
      this.loginDialog();
    }.bind(this));
  },

  loginDialog: function () {
    if (this.isLoggedIn()) {
      this.logout();
    } else {
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
    }
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
        success: function (session) {
          // omit the expiration time because the client doesn't care and we don't want to update it
          document.session=_.omit(session, "expirationTime");
          notify.success("Successfully logged in");
          this.setLogoutText();
        }.bind(this),
        error: function () {
          notify.error("Error logging in.");
        },
        xhrFields: {
          withCredentials: true
        },
    });
  },

  logout: function () {
    const logoutEndpoint = properties.serverHost + "/session/logout";

    $.ajax({
        type: "POST",
        url: logoutEndpoint,
        contentType: "application/json",
        error: function () {
          notify.error("Error logging out.");
        },
        xhrFields: {
          withCredentials: true
        },
    });
    delete document.session;
    this.setLoginText();
  },

  isLoggedIn: function () {
    if (document.session) {
      return document.session.id;
    }

    return false;
  },

  getLoggedInUsername: function () {
    if (document.session) {
      return document.session.userDetails.username;
    }

    return "";
  },

  setLogoutText: function () {
    $("#loginLink").text("Logout " + this.getLoggedInUsername());
  },

  setLoginText: function () {
    $("#loginLink").text("Login");
  }
}

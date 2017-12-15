/* Simple model for holding session information - the session cookie will be http only */
const _ = require("lodash");

module.exports = {
  _session: null,

  getSession: function () {
    return this._session;
  },

  clearSession: function () {
    this._session = null;
  },

  setSession: function (session) {
    // omit the id to prevent spoofing - id is stored in secure http-only cookie
    this._session = _.omit(session, "expirationTime", "id");
  },

  isLoggedIn: function () {
    return !!this._session;
  },

  getLoggedInUsername: function () {
    if (this._session) {
      return this._session.userDetails.username;
    }

    return "";
  },

  /* Faux security - the real security is implemented in the back end server */
  isAdmin: function () {
    let index;

    if (this.isLoggedIn()) {
      for (index = 0; index < this._session.userDetails.roles.length; index++) {
        if (this._session.userDetails.roles[index] === "ADMIN") {
          return true;
        }
      }
    }

    return false;
  }
}

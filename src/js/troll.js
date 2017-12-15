const $ =         require("jquery"),
  properties =    require("./properties"),
  sessionModel =  require("./sessionModel");

let clearTextareaNextAction = true,
  currentSpeech;

module.exports = {

  registerTrollListeners: function (submitFunction) {
    const textBox = $("#trollTextarea");

    this.clearTrollListeners();
    textBox.focus(function () {
      if (clearTextareaNextAction) {
        textBox.val("");
        clearTextareaNextAction = false;
      }
    });

    textBox.keydown(function (event) {
      let command;

      if (clearTextareaNextAction) {
        clearTextareaNextAction = false;
        textBox.val("");
      } else if (event.keyCode === 13) {
        event.preventDefault();
        command = textBox.val().split(" ")[0];

        switch (command) {
          case "exit":
            textBox.val("");
            this.registerTrollListeners();
            break;
          case "answermode":
            this.switchToAnswerMode();
            break;
          case "deleteMode":
            textBox.val("");
            if (sessionModel.isAdmin()) {
              $(".deleteComment").css("display", "inline");
            }
            break;
          default:
            submitFunction ? submitFunction() : this.normalSpeechSubmit();
        }
      }
    }.bind(this));
  },

  normalSpeechSubmit: function () {
    const textBox = $("#trollTextarea"),
      endpoint = properties.serverHost + "/troll",
      messageForTroll = textBox.val();

    textBox.val("...");
    textBox.attr("disabled", true);
    $.ajax({
        type: "POST",
        url: endpoint,
        data: messageForTroll,
        contentType: "text/plain",
        success: function (answer) {
          clearTextareaNextAction = true;
          textBox.val(answer);
          textBox.attr("disabled", false);
        },
        xhrFields: {
          withCredentials: true
        },
    });
  },

  updateResponseSubmit: function () {
    const textBox = $("#trollTextarea"),
      updateResponseEndpoint = properties.serverHost + "/troll",
      messageForTroll = textBox.val();

    currentSpeech.responses = [messageForTroll];
    textBox.val("...");
    textBox.attr("disabled", true);
    $.ajax({
        type: "PUT",
        url: updateResponseEndpoint,
        data: JSON.stringify(currentSpeech),
        contentType: "application/json",
        success: this.fetchNextSpeech,
        xhrFields: {
          withCredentials: true
        },
    });
  },

  clearTrollListeners: function () {
    $("#trollTextarea").off();
  },

  switchToAnswerMode: function () {
    const textBox = $("#trollTextarea");

    textBox.val("...");
    textBox.attr("disabled", true);
    this.registerTrollListeners(this.updateResponseSubmit.bind(this));
    this.fetchNextSpeech();
  },

  fetchNextSpeech: function () {
    const textBox = $("#trollTextarea"),
      nextSpeechEndpoint = properties.serverHost + "/troll/next";

    $.ajax({
        type: "GET",
        url: nextSpeechEndpoint,
        contentType: "application/json",
        success: function (speech) {
          clearTextareaNextAction = true;
          textBox.val(speech.text);
          textBox.attr("disabled", false);
          currentSpeech = speech;
        },
        error: function () {
          textBox.attr("disabled", false);
          textBox.val("Nice try bucko.");
          clearTextareaNextAction = true;
          this.registerTrollListeners();
        }.bind(this),
        xhrFields: {
          withCredentials: true
        },
    });
  }
};

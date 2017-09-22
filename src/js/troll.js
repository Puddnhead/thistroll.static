const $ =       require("jquery"),
  properties =  require("./properties");

let clearTextareaNextAction = true;

module.exports = {

  registerTrollListeners: function () {
    const textBox = $("#trollTextarea"),
      endpoint = properties.serverHost + "/troll";

    textBox.focus(function () {
      if (clearTextareaNextAction) {
        textBox.val("");
        clearTextareaNextAction = false;
      }
    });

    textBox.keydown(function (event) {
      let messageForTroll;

      if (clearTextareaNextAction) {
        clearTextareaNextAction = false;
        textBox.val("");
      } else if (event.keyCode === 13) {
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
            }
        });
      }
    });
  }
};

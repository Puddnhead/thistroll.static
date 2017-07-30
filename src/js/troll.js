const $ =       require("jquery"),
  properties =  require("./properties");

let clearTextareaNextAction = true;

module.exports = {

  registerTrollListeners: function () {
    const textBox = document.getElementById("trollTextarea"),
      endpoint = properties.serverHost + "/troll";

    textBox.addEventListener("focus", function () {
      if (clearTextareaNextAction) {
        textBox.value = "";
        clearTextareaNextAction = false;
      }
    });

    textBox.addEventListener("keypress", function (event) {
      let messageForTroll;

      if (clearTextareaNextAction) {
        clearTextareaNextAction = false;
        textBox.value = "";
      } else if (event.charCode === 13) {
        messageForTroll = textBox.value;
        textBox.value = "...";
        textBox.disabled = true;
        $.ajax({
            type: "POST",
            url: endpoint,
            data: messageForTroll,
            contentType: "text/plain",
            success: function (answer) {
              clearTextareaNextAction = true;
              textBox.value = answer;
              textBox.disabled = false;
            }
        });
      }
    });
  }
};

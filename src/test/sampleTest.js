// TODO: Figure out how to unit test methods that make JQUERY AJAX requests and update a document?

var assert = require("assert");
describe("Array", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getString } from "../src/utils/bar";
import { bgRed, bgYellow } from "../src/utils/colors";

describe("bar", () => {
  describe("getString", () => {
    it("should return a red bar of the specified length", () => {
      const result = getString(5, "red");
      const expected = bgRed("     ");
      assert.strictEqual(result, expected);
    });

    it("should return a yellow bar of the specified length", () => {
      const result = getString(5, "yellow");
      const expected = bgYellow("     ");
      assert.strictEqual(result, expected);
    });

    it("should return empty string for zero length", () => {
      const result = getString(0, "red");
      const expected = bgRed("");
      assert.strictEqual(result, expected);
    });
  });
});

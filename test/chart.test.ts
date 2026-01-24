import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getObjectOutput,
  getStackedOutput,
  getOutputByFolder,
} from "../src/utils/chart";
import type { RuleStats, FolderStats } from "../src/types/types";

describe("chart", () => {
  const maxWidth = 100;

  describe("getObjectOutput", () => {
    it("should display single property object with correct format", () => {
      const stats: RuleStats = { "no-comma-dangle": { error: 7 } };
      const output = getObjectOutput(stats, maxWidth);
      assert.ok(output.includes("no-comma-dangle:"));
      assert.ok(output.includes("7"));
    });

    it("should handle warnings", () => {
      const stats: RuleStats = { "no-comma-dangle": { warning: 7 } };
      const output = getObjectOutput(stats, maxWidth);
      assert.ok(output.includes("no-comma-dangle:"));
      assert.ok(output.includes("7"));
    });

    it("should pad multiple rules to longest rule name", () => {
      const stats: RuleStats = {
        "no-comma-dangle": { error: 1 },
        "no-empty": { error: 1 },
      };
      const output = getObjectOutput(stats, maxWidth);
      const lines = output.trim().split("\n");
      assert.strictEqual(lines.length, 2);
      // Both lines should have padded rule names
      assert.ok(lines[0].includes("no-comma-dangle:"));
      assert.ok(lines[1].includes("no-empty:"));
    });

    it("should handle both errors and warnings in same rule", () => {
      const stats: RuleStats = {
        "no-comma-dangle": { error: 5, warning: 3 },
      };
      const output = getObjectOutput(stats, maxWidth);
      const lines = output.trim().split("\n");
      assert.strictEqual(lines.length, 2); // One line for errors, one for warnings
    });
  });

  describe("getStackedOutput", () => {
    it("should display stacked errors and warnings", () => {
      const stats: RuleStats = {
        "no-comma-dangle": { error: 5, warning: 3 },
      };
      const output = getStackedOutput(stats, maxWidth);
      assert.ok(output.includes("no-comma-dangle:"));
      assert.ok(output.includes("5"));
      assert.ok(output.includes("3"));
    });

    it("should handle rules with only errors", () => {
      const stats: RuleStats = {
        "no-comma-dangle": { error: 5 },
      };
      const output = getStackedOutput(stats, maxWidth);
      assert.ok(output.includes("no-comma-dangle:"));
      assert.ok(output.includes("5"));
    });
  });

  describe("getOutputByFolder", () => {
    it("should divide output by folder", () => {
      const stats: FolderStats = {
        "/src/utils": {
          "no-comma-dangle": { error: 5 },
        },
        "/src/types": {
          "no-unused-vars": { warning: 3 },
        },
      };
      const output = getOutputByFolder(stats, maxWidth);
      assert.ok(output.includes("/src/utils:"));
      assert.ok(output.includes("/src/types:"));
      assert.ok(output.includes("no-comma-dangle:"));
      assert.ok(output.includes("no-unused-vars:"));
    });

    it("should handle empty folder stats", () => {
      const stats: FolderStats = {};
      const output = getOutputByFolder(stats, maxWidth);
      assert.strictEqual(output.trim(), "");
    });
  });
});

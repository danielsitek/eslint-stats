import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { byError } from "../src/formatters/by-error";
import { byWarning } from "../src/formatters/by-warning";
import { byErrorAndWarning } from "../src/formatters/by-error-and-warning";
import { byErrorAndWarningStacked } from "../src/formatters/by-error-and-warning-stacked";
import { byFolder } from "../src/formatters/by-folder";
import type { LintResult } from "../src/types/types";

describe("formatters", () => {
  const mockResults: LintResult[] = [
    {
      filePath: "test.js",
      messages: [
        {
          ruleId: "semi",
          severity: 2,
          message: "Missing semicolon",
          line: 1,
          column: 1,
        },
        {
          ruleId: "quotes",
          severity: 1,
          message: "Strings must use double quotes",
          line: 2,
          column: 1,
        },
      ],
      errorCount: 1,
      fatalErrorCount: 0,
      warningCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
      suppressedMessages: [],
    },
  ];

  describe("byError", () => {
    it("should format error-only output", () => {
      const output = byError(mockResults);
      assert.ok(typeof output === "string");
      assert.ok(output.includes("semi:"));
      // Should not include warnings
      assert.ok(!output.includes("quotes:"));
    });
  });

  describe("byWarning", () => {
    it("should format warning-only output", () => {
      const output = byWarning(mockResults);
      assert.ok(typeof output === "string");
      assert.ok(output.includes("quotes:"));
      // Should not include errors
      assert.ok(!output.includes("semi:"));
    });
  });

  describe("byErrorAndWarning", () => {
    it("should format combined error and warning output", () => {
      const output = byErrorAndWarning(mockResults);
      assert.ok(typeof output === "string");
      assert.ok(output.includes("semi:"));
      assert.ok(output.includes("quotes:"));
    });
  });

  describe("byErrorAndWarningStacked", () => {
    it("should format stacked error and warning output", () => {
      const output = byErrorAndWarningStacked(mockResults);
      assert.ok(typeof output === "string");
      // In stacked mode, both should appear in the same entry
      assert.ok(output.length > 0);
    });
  });

  describe("byFolder", () => {
    it("should format output grouped by folder", () => {
      const output = byFolder(mockResults);
      assert.ok(typeof output === "string");
      assert.ok(output.length > 0);
    });
  });
});

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { byRule, byFolderAndRule } from "../src/utils/stats";
import type { LintResult } from "../src/types/types";

describe("stats", () => {
  const eslintResults: LintResult[] = [
    {
      filePath: "path1",
      messages: [
        {
          ruleId: "id1",
          severity: 2,
          message: "Error",
          line: 1,
          column: 1,
        },
        {
          ruleId: "id2",
          severity: 2,
          message: "Error",
          line: 2,
          column: 1,
        },
      ],
      errorCount: 2,
      fatalErrorCount: 0,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
      suppressedMessages: [],
    },
    {
      filePath: "path2",
      messages: [
        {
          ruleId: "id1",
          severity: 2,
          message: "Error",
          line: 1,
          column: 1,
        },
      ],
      errorCount: 1,
      fatalErrorCount: 0,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
      suppressedMessages: [],
    },
    {
      filePath: "path3",
      messages: [
        {
          ruleId: "id1",
          severity: 1,
          message: "Warning",
          line: 1,
          column: 1,
        },
      ],
      errorCount: 0,
      fatalErrorCount: 0,
      warningCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
      suppressedMessages: [],
    },
  ];

  it("should return an empty object for empty array results", () => {
    const result = byRule([]);
    assert.deepStrictEqual(result, {});
  });

  it("should return an aggregated object by rule, then severity", () => {
    const stats = byRule(eslintResults);
    assert.strictEqual(Object.keys(stats).length, 2);
    assert.deepStrictEqual(stats.id1, { Error: 2, Warning: 1 });
    assert.deepStrictEqual(stats.id2, { Error: 1 });
  });

  it("should accept a second param, severity, which filters the severities", () => {
    const stats = byRule(eslintResults, 2);
    assert.strictEqual(Object.keys(stats).length, 2);
    assert.deepStrictEqual(stats.id1, { Error: 2 });
    assert.deepStrictEqual(stats.id2, { Error: 1 });
  });

  describe("byFolderAndRule", () => {
    const byFolderResults: LintResult[] = [
      {
        filePath: "path1/file1",
        messages: [
          {
            ruleId: "id1",
            severity: 2,
            message: "Error",
            line: 1,
            column: 1,
          },
          {
            ruleId: "id2",
            severity: 2,
            message: "Error",
            line: 2,
            column: 1,
          },
        ],
        errorCount: 2,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        suppressedMessages: [],
      },
      {
        filePath: "path1/file2",
        messages: [
          {
            ruleId: "id1",
            severity: 2,
            message: "Error",
            line: 1,
            column: 1,
          },
        ],
        errorCount: 1,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        suppressedMessages: [],
      },
      {
        filePath: "path3",
        messages: [
          {
            ruleId: "id1",
            severity: 1,
            message: "Warning",
            line: 1,
            column: 1,
          },
        ],
        errorCount: 0,
        fatalErrorCount: 0,
        warningCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        suppressedMessages: [],
      },
    ];

    it("should divide the results by folder", () => {
      const stats = byFolderAndRule(byFolderResults);
      const expectedResult = {
        path1: {
          id1: { Error: 2 },
          id2: { Error: 1 },
        },
        "Base Folder": {
          id1: { Warning: 1 },
        },
      };
      assert.deepStrictEqual(stats, expectedResult);
    });
  });
});

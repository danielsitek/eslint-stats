import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { byError } from "../src/formatters/by-error";
import { byWarning } from "../src/formatters/by-warning";
import { byErrorAndWarning } from "../src/formatters/by-error-and-warning";
import { byErrorAndWarningStacked } from "../src/formatters/by-error-and-warning-stacked";
import { byFolder } from "../src/formatters/by-folder";
import {
  byPrometheus,
  createPrometheusFormatter,
} from "../src/formatters/by-prometheus";
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

  describe("byPrometheus", () => {
    const prometheusResults: LintResult[] = [
      {
        filePath: "src/utils/helper.js",
        messages: [
          {
            ruleId: "no-unused-vars",
            severity: 2,
            message: "Unused variable",
            line: 1,
            column: 1,
          },
          {
            ruleId: "no-console",
            severity: 1,
            message: "Unexpected console",
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
      {
        filePath: "src/types/types.ts",
        messages: [
          {
            ruleId: "no-unused-vars",
            severity: 2,
            message: "Unused variable",
            line: 5,
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
        filePath: "test/helper.test.js",
        messages: [],
        errorCount: 0,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        suppressedMessages: [],
      },
    ];

    it("should return valid Prometheus format", () => {
      const output = byPrometheus(prometheusResults);
      assert.ok(typeof output === "string");
      assert.ok(output.length > 0);
    });

    it("should include metric headers (HELP and TYPE)", () => {
      const output = byPrometheus(prometheusResults);
      assert.ok(output.includes("# HELP eslint_rule_violations_total"));
      assert.ok(output.includes("# TYPE eslint_rule_violations_total counter"));
      assert.ok(output.includes("# HELP eslint_violations_by_severity_total"));
      assert.ok(
        output.includes("# TYPE eslint_violations_by_severity_total counter"),
      );
      assert.ok(output.includes("# HELP eslint_files_total"));
      assert.ok(output.includes("# TYPE eslint_files_total counter"));
    });

    it("should include rule violations with labels", () => {
      const output = byPrometheus(prometheusResults);
      assert.ok(
        output.includes('eslint_rule_violations_total{rule="no-unused-vars"'),
      );
      assert.ok(output.includes('severity="error"'));
      assert.ok(output.includes('folder="src/utils"'));
      assert.ok(output.includes('folder="src/types"'));
    });

    it("should include severity totals", () => {
      const output = byPrometheus(prometheusResults);
      assert.ok(
        output.includes(
          'eslint_violations_by_severity_total{severity="error"}',
        ),
      );
      assert.ok(
        output.includes(
          'eslint_violations_by_severity_total{severity="warning"}',
        ),
      );
    });

    it("should include file statistics", () => {
      const output = byPrometheus(prometheusResults);
      assert.ok(output.includes("eslint_files_total 3"));
      assert.ok(output.includes("eslint_files_with_violations_total 2"));
      assert.ok(output.includes("eslint_files_clean_total 1"));
    });

    it("should include unique rules count", () => {
      const output = byPrometheus(prometheusResults);
      assert.ok(output.includes("eslint_rules_violated_total 2"));
    });

    it("should escape label values correctly", () => {
      const specialResults: LintResult[] = [
        {
          filePath: 'src/special"path/file.js',
          messages: [
            {
              ruleId: "rule-with-quotes",
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
      ];
      const output = byPrometheus(specialResults);
      assert.ok(output.includes('folder="src/special\\"path"'));
    });

    it("should handle empty results", () => {
      const output = byPrometheus([]);
      assert.ok(typeof output === "string");
      assert.ok(output.includes("eslint_files_total 0"));
      assert.ok(output.includes("eslint_files_with_violations_total 0"));
      assert.ok(output.includes("eslint_files_clean_total 0"));
      assert.ok(output.includes("eslint_rules_violated_total 0"));
    });
  });

  describe("createPrometheusFormatter", () => {
    const prefixResults: LintResult[] = [
      {
        filePath: "src/utils/helper.js",
        messages: [
          {
            ruleId: "no-unused-vars",
            severity: 2,
            message: "Unused variable",
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
    ];

    it("should prepend prefix to folder paths", () => {
      const formatter = createPrometheusFormatter({ folderPrefix: "fectory" });
      const output = formatter(prefixResults);
      assert.ok(output.includes('folder="fectory/src/utils"'));
    });

    it("should work without prefix (same as byPrometheus)", () => {
      const formatter = createPrometheusFormatter();
      const output = formatter(prefixResults);
      assert.ok(output.includes('folder="src/utils"'));
      assert.ok(!output.includes("fectory"));
    });

    it("should work with empty options", () => {
      const formatter = createPrometheusFormatter({});
      const output = formatter(prefixResults);
      assert.ok(output.includes('folder="src/utils"'));
    });

    it("should return a function", () => {
      const formatter = createPrometheusFormatter({ folderPrefix: "app" });
      assert.ok(typeof formatter === "function");
    });
  });
});

import type { LintResult, FolderStats } from "../types/types.js";
import { byFolderAndRule } from "../utils/stats.js";

/**
 * Escapes label values for Prometheus format
 * Replaces backslashes, quotes, and newlines
 */
const escapeLabel = (value: string): string => {
  // Fast path: if no special chars, return as-is
  if (!/["\\\n]/.test(value)) {
    return value;
  }

  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n");
};

/**
 * Generates Prometheus metric line
 */
const metricLine = (
  name: string,
  labels: Record<string, string>,
  value: number,
): string => {
  const labelPairs = Object.entries(labels)
    .map(([key, val]) => `${key}="${escapeLabel(val)}"`)
    .join(",");

  return labelPairs ? `${name}{${labelPairs}} ${value}` : `${name} ${value}`;
};

/**
 * Generates HELP and TYPE comments for a metric
 */
const metricHeader = (name: string, help: string, type: string): string => {
  return `# HELP ${name} ${help}\n# TYPE ${name} ${type}`;
};

/**
 * Processes folder stats in a single pass for optimal performance
 * Returns rule violations lines, severity totals, and unique rule count
 */
const processFolderStats = (
  folderStats: FolderStats,
): {
  lines: string[];
  severityTotals: Record<string, number>;
  uniqueRulesCount: number;
} => {
  const lines: string[] = [];
  const severityTotals: Record<string, number> = { error: 0, warning: 0 };
  const uniqueRules = new Set<string>();

  for (const [folder, ruleStats] of Object.entries(folderStats)) {
    for (const [rule, severityStats] of Object.entries(ruleStats)) {
      // Track unique rules
      uniqueRules.add(rule);

      // Generate metrics and accumulate totals
      if (severityStats.error) {
        severityTotals.error += severityStats.error;
        lines.push(
          metricLine(
            "eslint_rule_violations_total",
            { rule, severity: "error", folder },
            severityStats.error,
          ),
        );
      }
      if (severityStats.warning) {
        severityTotals.warning += severityStats.warning;
        lines.push(
          metricLine(
            "eslint_rule_violations_total",
            { rule, severity: "warning", folder },
            severityStats.warning,
          ),
        );
      }
    }
  }

  // Sort for consistent output
  lines.sort();

  return {
    lines,
    severityTotals,
    uniqueRulesCount: uniqueRules.size,
  };
};

/**
 * Generates severity totals metrics
 */
const generateSeverityTotalsMetrics = (
  totals: Record<string, number>,
): string[] => {
  const lines: string[] = [];

  if (totals.error > 0) {
    lines.push(
      metricLine(
        "eslint_violations_by_severity_total",
        { severity: "error" },
        totals.error,
      ),
    );
  }
  if (totals.warning > 0) {
    lines.push(
      metricLine(
        "eslint_violations_by_severity_total",
        { severity: "warning" },
        totals.warning,
      ),
    );
  }

  return lines;
};

/**
 * Generates file statistics metrics
 */
const generateFileMetrics = (results: LintResult[]): string[] => {
  const totalFiles = results.length;
  let filesWithViolations = 0;

  // Single pass instead of filter
  for (const result of results) {
    if (result.messages.length > 0) {
      filesWithViolations++;
    }
  }

  const cleanFiles = totalFiles - filesWithViolations;

  return [
    metricLine("eslint_files_total", {}, totalFiles),
    metricLine("eslint_files_with_violations_total", {}, filesWithViolations),
    metricLine("eslint_files_clean_total", {}, cleanFiles),
  ];
};

/**
 * Formats ESLint results as Prometheus metrics
 *
 * Exports metrics in Prometheus text exposition format:
 * - eslint_rule_violations_total{rule,severity,folder} - violations by rule, severity, and folder
 * - eslint_violations_by_severity_total{severity} - total violations by severity
 * - eslint_files_total - total files analyzed
 * - eslint_files_with_violations_total - files with violations
 * - eslint_files_clean_total - files without violations
 * - eslint_rules_violated_total - unique rules violated
 *
 * @param results - ESLint results array
 * @returns Prometheus metrics as string
 */
export const byPrometheus = (results: LintResult[]): string => {
  const folderStats = byFolderAndRule(results);

  // Single pass through folder stats for optimal performance
  const {
    lines: ruleViolationsLines,
    severityTotals,
    uniqueRulesCount,
  } = processFolderStats(folderStats);

  const sections: string[] = [];

  // 1. Rule violations with folder breakdown
  if (ruleViolationsLines.length > 0) {
    const ruleViolationsHeader = metricHeader(
      "eslint_rule_violations_total",
      "Total number of ESLint rule violations",
      "counter",
    );
    sections.push([ruleViolationsHeader, ...ruleViolationsLines].join("\n"));
  }

  // 2. Severity totals
  const severityTotalsLines = generateSeverityTotalsMetrics(severityTotals);
  if (severityTotalsLines.length > 0) {
    const severityTotalsHeader = metricHeader(
      "eslint_violations_by_severity_total",
      "Total ESLint violations by severity",
      "counter",
    );
    sections.push([severityTotalsHeader, ...severityTotalsLines].join("\n"));
  }

  // 3. File statistics
  const fileMetricsLines = generateFileMetrics(results);
  sections.push(
    [
      metricHeader(
        "eslint_files_total",
        "Total number of files analyzed by ESLint",
        "counter",
      ),
      fileMetricsLines[0],
    ].join("\n"),
  );

  sections.push(
    [
      metricHeader(
        "eslint_files_with_violations_total",
        "Total number of files with ESLint violations",
        "counter",
      ),
      fileMetricsLines[1],
    ].join("\n"),
  );

  sections.push(
    [
      metricHeader(
        "eslint_files_clean_total",
        "Total number of files without violations",
        "counter",
      ),
      fileMetricsLines[2],
    ].join("\n"),
  );

  // 4. Unique rules count
  sections.push(
    [
      metricHeader(
        "eslint_rules_violated_total",
        "Total number of different ESLint rules violated",
        "counter",
      ),
      metricLine("eslint_rules_violated_total", {}, uniqueRulesCount),
    ].join("\n"),
  );

  // Join all sections with double newline (Prometheus convention)
  return sections.join("\n\n") + "\n";
};

export default byPrometheus;

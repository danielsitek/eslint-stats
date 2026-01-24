import path from "node:path";
import type {
  LintResult,
  LintMessage,
  RuleStats,
  FolderStats,
  SeverityLevel,
} from "../types/types.js";
import { severityLabel } from "./severities.js";

// Native replacement for lodash groupBy
const groupBy = <T>(
  array: T[],
  iterate: (item: T) => string,
): Record<string, T[]> => {
  return array.reduce<Record<string, T[]>>((result, item) => {
    const key = String(iterate(item));

    // Validate key to prevent prototype pollution
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return result;
    }

    if (!Array.isArray(result[key])) {
      result[key] = [];
    }

    result[key].push(item);

    return result;
  }, {});
};

// Native replacement for lodash mapValues
const mapValues = <T, R>(
  obj: Record<string, T>,
  iterate: (value: T) => R,
): Record<string, R> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, iterate(value)]),
  );
};

const isInvalidRuleId = (message: LintMessage): boolean => {
  return (
    typeof message.ruleId !== "string" || message.ruleId.trim().length === 0
  );
};

const isSeverityFiltered = (
  message: LintMessage,
  severity?: SeverityLevel,
): boolean => {
  return severity !== undefined && message.severity !== severity;
};

export function byRule(
  results: LintResult[],
  severity?: SeverityLevel,
): RuleStats {
  // Single-pass optimization: flatten, filter, group, and count in one reduce
  const stats: RuleStats = {};

  for (const result of results) {
    for (const message of result.messages) {
      if (isInvalidRuleId(message)) {
        continue;
      }

      if (isSeverityFiltered(message, severity)) {
        continue;
      }

      const ruleId = message.ruleId as string;
      const severityName = severityLabel(message.severity);

      if (!stats[ruleId]) {
        stats[ruleId] = {};
      }

      stats[ruleId][severityName] = (stats[ruleId][severityName] ?? 0) + 1;
    }
  }

  return stats;
}

const getDirName = (result: LintResult): string => {
  const dirname = path.dirname(result.filePath);

  return dirname === "." ? "Base Folder" : dirname;
};

export function byFolderAndRule(
  results: LintResult[],
  severity?: SeverityLevel,
): FolderStats {
  const byDirName = groupBy(results, getDirName);

  return mapValues(byDirName, (messages) => byRule(messages, severity));
}

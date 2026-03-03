import path from "node:path";
import type {
  LintResult,
  LintMessage,
  RuleStats,
  FolderStats,
  SeverityLevel,
} from "../types/types.js";
import { severityLabel } from "./severities.js";

const isInvalidRuleId = (message: LintMessage): boolean => {
  return typeof message.ruleId !== "string" || message.ruleId.length === 0;
};

const loopOverMessages = (
  objectStats: RuleStats,
  result: LintResult,
  severity?: SeverityLevel,
): void => {
  const shouldFilter = severity !== undefined;

  for (const message of result.messages) {
    if (isInvalidRuleId(message)) {
      continue;
    }

    if (shouldFilter && message.severity !== severity) {
      continue;
    }

    const ruleId = message.ruleId!;
    let ruleStats = objectStats[ruleId];

    // Single check & assignment
    if (!ruleStats) {
      ruleStats = objectStats[ruleId] = {};
    }

    const severityKey = severityLabel(message.severity);
    ruleStats[severityKey] = (ruleStats[severityKey] ?? 0) + 1;
  }
};

const getDirName = (result: LintResult): string => {
  const dirname = path.relative(process.cwd(), path.dirname(result.filePath));

  if (dirname === "" || dirname === ".") {
    return ".";
  }

  return dirname;
};

export const byRule = (
  results: LintResult[],
  severity?: SeverityLevel,
): RuleStats => {
  const stats: RuleStats = {};

  for (const result of results) {
    loopOverMessages(stats, result, severity);
  }

  return stats;
};

export const byFolderAndRule = (
  results: LintResult[],
  severity?: SeverityLevel,
): FolderStats => {
  const stats: FolderStats = {};

  for (const result of results) {
    if (result.messages.length === 0) {
      continue;
    }

    const folderName = getDirName(result);

    if (!stats[folderName]) {
      stats[folderName] = {};
    }

    loopOverMessages(stats[folderName], result, severity);
  }

  return stats;
};

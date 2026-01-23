import path from "node:path";
import type {
  LintResult,
  LintMessage,
  RuleStats,
  FolderStats,
  SeverityLevel,
  SeverityStats,
} from "../types/types.js";
import { names } from "./severities.js";

// Native replacement for lodash countBy
const countBy = <T>(
  array: T[],
  iterate: (item: T) => string,
): Record<string, number> => {
  return array.reduce<Record<string, number>>((result, item) => {
    const key = iterate(item);

    result[key] = (Object.hasOwn(result, key) ? result[key] : 0) + 1;

    return result;
  }, Object.create(null));
};

// Native replacement for lodash groupBy
const groupBy = <T>(
  array: T[],
  iterate: (item: T) => string,
): Record<string, T[]> => {
  return array.reduce<Record<string, T[]>>((result, item) => {
    const key = iterate(item);

    if (!Object.hasOwn(result, key)) {
      result[key] = [];
    }

    result[key].push(item);

    return result;
  }, Object.create(null));
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

const getStatsForRule = (ruleMessages: LintMessage[]): SeverityStats => {
  return countBy(ruleMessages, (message) => names[message.severity as 1 | 2]);
};

export function byRule(
  results: LintResult[],
  severity?: SeverityLevel,
): RuleStats {
  const allMessages = results.flatMap((result) => result.messages);

  const messagesInSeverities = severity
    ? allMessages.filter((message) => message.severity === severity)
    : allMessages;

  const messagesByRuleId = groupBy(
    messagesInSeverities,
    (message) => message.ruleId ?? "unknown",
  );

  return mapValues(messagesByRuleId, getStatsForRule);
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

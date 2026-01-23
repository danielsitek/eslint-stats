import path from "node:path";
import type {
  LintResult,
  LintMessage,
  RuleStats,
  FolderStats,
  SeverityLevel,
  SeverityStats,
} from "../types/types";
import { names } from "./severities";

// Native replacement for lodash countBy
const countBy = <T>(
  array: T[],
  iteratee: (item: T) => string,
): Record<string, number> => {
  return array.reduce(
    (result, item) => {
      const key = iteratee(item);
      result[key] = (result[key] || 0) + 1;
      return result;
    },
    {} as Record<string, number>,
  );
};

// Native replacement for lodash groupBy
const groupBy = <T>(
  array: T[],
  iteratee: (item: T) => string,
): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const key = iteratee(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
};

// Native replacement for lodash mapValues
const mapValues = <T, R>(
  obj: Record<string, T>,
  iteratee: (value: T) => R,
): Record<string, R> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, iteratee(value)]),
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
    (message) => message.ruleId || "unknown",
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

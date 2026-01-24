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
    const key = String(iterate(item));

    // Validate key to prevent prototype pollution
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return result;
    }

    result[key] = (result[key] ?? 0) + 1;

    return result;
  }, {});
};

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

const getStatsForRule = (ruleMessages: LintMessage[]): SeverityStats => {
  return countBy(ruleMessages, (message) => names[message.severity as 1 | 2]);
};

const filterMessagesBySeverity = (
  messages: LintMessage[],
  severity?: SeverityLevel,
): LintMessage[] => {
  if (severity === undefined || (severity !== 1 && severity !== 2)) {
    return messages;
  }

  return messages.filter((message) => message.severity === severity);
};

const groupMessagesByRuleId = (
  messages: LintMessage[],
): Record<string, LintMessage[]> => {
  const filteredMessages = messages.filter(
    (message) => typeof message.ruleId === "string" && message.ruleId.length,
  );

  return groupBy(filteredMessages, (message) => message.ruleId as string);
};

export function byRule(
  results: LintResult[],
  severity?: SeverityLevel,
): RuleStats {
  const allMessages = results
    .flatMap((result) => result.messages)
    .filter(
      // Filter out not a string `ruleId` messages
      (message) => typeof message.ruleId === "string" && message.ruleId.length,
    );

  console.log("===");

  console.log("results:", results);

  console.log("allMessages:", allMessages);

  const messagesInSeverities = filterMessagesBySeverity(allMessages, severity);

  console.log("messagesInSeverities:", messagesInSeverities);

  const messagesByRuleId = groupMessagesByRuleId(messagesInSeverities);

  console.log("messagesByRuleId:", messagesByRuleId);

  console.log("===");

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

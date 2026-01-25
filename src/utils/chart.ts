import { magenta, underline } from "./colors.js";
import type { RuleStats, FolderStats, SeverityStats } from "../types/types.js";
import { getString } from "./bar.js";

const barColors = {
  error: "red" as const,
  warning: "yellow" as const,
};

const allSeverities = ["error", "warning"] as const;

const getMaxRuleLength = (stats: RuleStats): number => {
  return Math.max(...Object.keys(stats).map((key) => key.length));
};

const getStringLength = (num: number): number => {
  return String(num).length;
};

const getBarRatio = (
  usedColumns: number,
  maxResult: number,
  maxWidth: number,
): number => {
  const maxBarLength = maxWidth - usedColumns;
  return maxResult <= maxBarLength ? 1 : maxBarLength / maxResult;
};

const sortByKey = <T>(obj: Record<string, T>): T[] => {
  return Object.entries(obj)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
};

export const getObjectOutput = (stats: RuleStats, maxWidth: number): string => {
  const maxRuleLength = getMaxRuleLength(stats);
  const maxResult = Math.max(
    ...Object.values(stats).flatMap((ruleStats) => [
      ruleStats.error ?? 0,
      ruleStats.warning ?? 0,
    ]),
  );
  const maxResultLength = String(maxResult).length;

  const barRatio = getBarRatio(
    maxRuleLength + maxResultLength + 3,
    maxResult,
    maxWidth,
  );

  const getRuleOutput = (
    ruleStats: SeverityStats,
    ruleName: string,
  ): string => {
    const ruleCell = `${ruleName}: `.padEnd(maxRuleLength + 2);
    return Object.entries(ruleStats)
      .map(([severity, count]) => {
        const countCell = magenta(String(count).padStart(maxResultLength));
        const barCell = getString(
          Math.floor(barRatio * count),
          barColors[severity as "error" | "warning"],
        );
        return `${ruleCell}${countCell}|${barCell}`;
      })
      .join("\n");
  };

  const mappedStats = Object.fromEntries(
    Object.entries(stats).map(([ruleName, ruleStats]) => [
      ruleName,
      getRuleOutput(ruleStats, ruleName),
    ]),
  );

  return `${sortByKey(mappedStats).join("\n")}\n`;
};

const isAnyRuleStacked = (stats: RuleStats): boolean => {
  return Object.values(stats).some(
    (ruleData) => Object.keys(ruleData).length > 1,
  );
};

export const getStackedOutput = (
  stats: RuleStats,
  maxWidth: number,
): string => {
  if (!isAnyRuleStacked(stats)) {
    return getObjectOutput(stats, maxWidth);
  }

  const normalizedStats = Object.fromEntries(
    Object.entries(stats).map(([key, value]) => [
      key,
      { error: 0, warning: 0, ...value },
    ]),
  );

  const maxRuleLength = getMaxRuleLength(normalizedStats);
  const maxResults: Record<string, number> = {};

  for (const severity of allSeverities) {
    maxResults[severity] = Math.max(
      ...Object.values(stats).map((s) => {
        const val = severity === "error" ? s.error : s.warning;
        return val ?? 0;
      }),
    );
  }

  const maxResultLengths = Object.fromEntries(
    Object.entries(maxResults).map(([key, value]) => [
      key,
      getStringLength(value),
    ]),
  );

  const maxRuleSum = Math.max(
    ...Object.values(normalizedStats).map((x) => x.error + x.warning),
  );

  const barRatio = getBarRatio(
    maxRuleLength +
      Object.values(maxResultLengths).reduce((a, b) => a + b, 0) +
      4,
    maxRuleSum,
    maxWidth,
  );

  const getStackedBar = (ruleStats: {
    error: number;
    warning: number;
  }): string => {
    return (
      getString(Math.floor(barRatio * ruleStats.error), barColors.error) +
      getString(Math.floor(barRatio * ruleStats.warning), barColors.warning)
    );
  };

  return `${Object.entries(normalizedStats)
    .map(([ruleId, ruleStats]) => {
      const ruleCell = `${ruleId}: `.padEnd(maxRuleLength + 2);
      const errorLength = maxResultLengths.error ?? 0;
      const warningLength = maxResultLengths.warning ?? 0;
      const errorCountCell = String(ruleStats.error).padStart(errorLength);
      const warningCountCell = String(ruleStats.warning).padStart(
        warningLength,
      );
      const countCell = magenta(`${errorCountCell},${warningCountCell}`);
      const barCell = getStackedBar(ruleStats);
      return `${ruleCell}${countCell}|${barCell}`;
    })
    .join("\n")}\n`;
};

const getFolderOutput =
  (maxWidth: number) =>
  (folderStats: RuleStats, folderName: string): string =>
    `${underline(`${folderName}:`)}\n${getObjectOutput(folderStats, maxWidth)}`;

export const getOutputByFolder = (
  stats: FolderStats,
  maxWidth: number,
): string => {
  const filteredStats = Object.fromEntries(
    Object.entries(stats).filter(([, value]) => Object.keys(value).length > 0),
  );

  return Object.entries(filteredStats)
    .map(([folderName, folderStats]) =>
      getFolderOutput(maxWidth)(folderStats, folderName),
    )
    .join("");
};

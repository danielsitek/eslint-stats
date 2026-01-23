import { magenta, underline } from "./colors.js";
import type { RuleStats, FolderStats, SeverityStats } from "../types/types.js";
import { getString } from "./bar.js";

const barColors = {
  Error: "red" as const,
  Warning: "yellow" as const,
};

const allSeverities = ["Error", "Warning"] as const;

function getMaxRuleLength(stats: RuleStats): number {
  return Math.max(...Object.keys(stats).map((key) => key.length));
}

function getStringLength(num: number): number {
  return String(num).length;
}

const getBarRatio = (
  usedColumns: number,
  maxResult: number,
  maxWidth: number,
): number => {
  const maxBarLength = maxWidth - usedColumns;
  return maxResult <= maxBarLength ? 1 : maxBarLength / maxResult;
};

const sortByKey = <T>(obj: Record<string, T>): T[] => {
  return Object.keys(obj)
    .sort()
    .map((key) => obj[key]);
};

export function getObjectOutput(stats: RuleStats, maxWidth: number): string {
  const maxRuleLength = getMaxRuleLength(stats);
  const maxResult = Math.max(
    ...Object.values(stats).flatMap((ruleStats) => [
      ruleStats.Error || 0,
      ruleStats.Warning || 0,
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
          barColors[severity as "Error" | "Warning"],
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
}

function isAnyRuleStacked(stats: RuleStats): boolean {
  return Object.values(stats).some(
    (ruleData) => Object.keys(ruleData).length > 1,
  );
}

export function getStackedOutput(stats: RuleStats, maxWidth: number): string {
  if (!isAnyRuleStacked(stats)) {
    return getObjectOutput(stats, maxWidth);
  }

  const normalizedStats = Object.fromEntries(
    Object.entries(stats).map(([key, value]) => [
      key,
      { Error: 0, Warning: 0, ...value },
    ]),
  );

  const maxRuleLength = getMaxRuleLength(normalizedStats);
  const maxResults = Object.fromEntries(
    allSeverities.map((severity) => [
      severity,
      Math.max(...Object.values(stats).map((s) => s[severity] || 0)),
    ]),
  );
  const maxResultLengths = Object.fromEntries(
    Object.entries(maxResults).map(([key, value]) => [
      key,
      getStringLength(value),
    ]),
  );
  const maxRuleSum = Math.max(
    ...Object.values(normalizedStats).map((x) => x.Error + x.Warning),
  );

  const barRatio = getBarRatio(
    maxRuleLength +
      Object.values(maxResultLengths).reduce((a, b) => a + b, 0) +
      4,
    maxRuleSum,
    maxWidth,
  );

  const getStackedBar = (ruleStats: {
    Error: number;
    Warning: number;
  }): string => {
    return (
      getString(Math.floor(barRatio * ruleStats.Error), barColors.Error) +
      getString(Math.floor(barRatio * ruleStats.Warning), barColors.Warning)
    );
  };

  return `${Object.entries(normalizedStats)
    .map(([ruleId, ruleStats]) => {
      const ruleCell = `${ruleId}: `.padEnd(maxRuleLength + 2);
      const errorCountCell = String(ruleStats.Error).padStart(
        maxResultLengths.Error,
      );
      const warningCountCell = String(ruleStats.Warning).padStart(
        maxResultLengths.Warning,
      );
      const countCell = magenta(`${errorCountCell},${warningCountCell}`);
      const barCell = getStackedBar(ruleStats);
      return `${ruleCell}${countCell}|${barCell}`;
    })
    .join("\n")}\n`;
}

const getFolderOutput =
  (maxWidth: number) =>
  (folderStats: RuleStats, folderName: string): string =>
    `${underline(`${folderName}:`)}\n${getObjectOutput(folderStats, maxWidth)}`;

export function getOutputByFolder(
  stats: FolderStats,
  maxWidth: number,
): string {
  const filteredStats = Object.fromEntries(
    Object.entries(stats).filter(([, value]) => Object.keys(value).length > 0),
  );

  return Object.entries(filteredStats)
    .map(([folderName, folderStats]) =>
      getFolderOutput(maxWidth)(folderStats, folderName),
    )
    .join("");
}

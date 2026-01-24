import type { ESLint, Linter } from "eslint";

export type LintResult = ESLint.LintResult;
export type LintMessage = Linter.LintMessage;
export type Formatter = ESLint.Formatter["format"];
export type SeverityLevel = Linter.LintMessage["severity"];

export type SeverityType = "warning" | "error";

export interface SeverityMap {
  names: Record<number, SeverityType>;
}

export interface SeverityStats {
  error?: number;
  warning?: number;
}

export type RuleStats = Record<string, SeverityStats>;

export type FolderStats = Record<string, RuleStats>;

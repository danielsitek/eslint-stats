import type { ESLint, Linter } from "eslint";

export type LintResult = ESLint.LintResult;
export type LintMessage = Linter.LintMessage;
export type Formatter = ESLint.Formatter["format"];

export interface SeverityStats {
  Error?: number;
  Warning?: number;
}

export type RuleStats = Record<string, SeverityStats>;

export type FolderStats = Record<string, RuleStats>;

export type SeverityLevel = 0 | 1 | 2;

export interface SeverityMap {
  names: Record<number, "Warning" | "Error">;
}

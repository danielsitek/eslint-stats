import type { ESLint, Linter } from "eslint";

export type LintResult = ESLint.LintResult;
export type LintMessage = Linter.LintMessage;
export type Formatter = ESLint.Formatter["format"];

export interface SeverityStats {
  Error?: number;
  Warning?: number;
}

export interface RuleStats {
  [ruleId: string]: SeverityStats;
}

export interface FolderStats {
  [folderPath: string]: RuleStats;
}

export type SeverityLevel = 0 | 1 | 2;

export interface SeverityMap {
  names: {
    [key: number]: "Warning" | "Error";
  };
}

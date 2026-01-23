import type { LintResult } from "../types/types";
import { byRule } from "../utils/stats";
import { getStackedOutput } from "../utils/chart";

export const byErrorAndWarningStacked = (results: LintResult[]): string => {
  const obj = byRule(results);
  return getStackedOutput(obj, process.stdout.columns || 80);
};

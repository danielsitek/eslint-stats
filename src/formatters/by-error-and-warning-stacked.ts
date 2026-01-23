import type { LintResult } from "../types/types.js";
import { byRule } from "../utils/stats.js";
import { getStackedOutput } from "../utils/chart.js";

export const byErrorAndWarningStacked = (results: LintResult[]): string => {
  const obj = byRule(results);
  return getStackedOutput(obj, process.stdout.columns || 80);
};

export default byErrorAndWarningStacked;

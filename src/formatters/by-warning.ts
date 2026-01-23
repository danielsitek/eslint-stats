import type { LintResult } from "../types/types.js";
import { byRule } from "../utils/stats.js";
import { getObjectOutput } from "../utils/chart.js";

export const byWarning = (results: LintResult[]): string => {
  const warningObj = byRule(results, 1);
  return getObjectOutput(warningObj, process.stdout.columns || 80);
};

export default byWarning;

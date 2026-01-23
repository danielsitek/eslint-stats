import type { LintResult } from "../types/types.js";
import { byRule } from "../utils/stats.js";
import { getObjectOutput } from "../utils/chart.js";

export const byError = (results: LintResult[]): string => {
  const errorObj = byRule(results, 2);
  return getObjectOutput(errorObj, process.stdout.columns || 80);
};

export default byError;

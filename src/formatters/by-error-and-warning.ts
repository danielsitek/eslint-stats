import type { LintResult } from "../types/types.js";
import { byRule } from "../utils/stats.js";
import { getObjectOutput } from "../utils/chart.js";

export const byErrorAndWarning = (results: LintResult[]): string => {
  const obj = byRule(results);
  return getObjectOutput(obj, process.stdout.columns || 80);
};

export default byErrorAndWarning;

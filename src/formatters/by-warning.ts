import type { LintResult } from "../types/types";
import { byRule } from "../utils/stats";
import { getObjectOutput } from "../utils/chart";

export const byWarning = (results: LintResult[]): string => {
  const warningObj = byRule(results, 1);
  return getObjectOutput(warningObj, process.stdout.columns || 80);
};

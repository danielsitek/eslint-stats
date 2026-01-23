import type { LintResult } from "../types/types";
import { byRule } from "../utils/stats";
import { getObjectOutput } from "../utils/chart";

export const byError = (results: LintResult[]): string => {
  const errorObj = byRule(results, 2);
  return getObjectOutput(errorObj, process.stdout.columns || 80);
};

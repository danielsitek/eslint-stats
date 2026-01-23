import type { LintResult } from "../types/types";
import { byRule } from "../utils/stats";
import { getObjectOutput } from "../utils/chart";

export const byErrorAndWarning = (results: LintResult[]): string => {
  const obj = byRule(results);
  return getObjectOutput(obj, process.stdout.columns || 80);
};

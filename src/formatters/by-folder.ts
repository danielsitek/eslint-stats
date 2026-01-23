import type { LintResult } from "../types/types";
import { byFolderAndRule } from "../utils/stats";
import { getOutputByFolder } from "../utils/chart";

export const byFolder = (results: LintResult[]): string => {
  const obj = byFolderAndRule(results);
  return getOutputByFolder(obj, process.stdout.columns || 80);
};

import type { LintResult } from "../types/types.js";
import { byFolderAndRule } from "../utils/stats.js";
import { getOutputByFolder } from "../utils/chart.js";

export const byFolder = (results: LintResult[]): string => {
  const obj = byFolderAndRule(results);
  return getOutputByFolder(obj, process.stdout.columns || 80);
};

export default byFolder;

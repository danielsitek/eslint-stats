import { dirname, join } from "node:path";

// For ESM builds, paths will be resolved at runtime
const getFormatterPath = (formatter: string): string => {
  // When built, this will be in dist/ and formatters will be in dist/formatters/
  return join(
    dirname(new URL(import.meta.url).pathname),
    "formatters",
    `${formatter}.js`,
  );
};

export const byError = getFormatterPath("by-error");
export const byWarning = getFormatterPath("by-warning");
export const byErrorAndWarning = getFormatterPath("by-error-and-warning");
export const byErrorAndWarningStacked = getFormatterPath(
  "by-error-and-warning-stacked",
);
export const byFolder = getFormatterPath("by-folder");

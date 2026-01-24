import type { SeverityLevel, SeverityType } from "../types/types.js";

export const names: Record<number, SeverityType> = {
  1: "warning",
  2: "error",
};

export const severityLabel = (severity: SeverityLevel): SeverityType => {
  if (severity === 2) {
    return names[2];
  }

  return names[1];
};

import type { SeverityLevel, SeverityMap } from "../types/types.js";

export const names: SeverityMap["names"] = {
  1: "Warning",
  2: "Error",
};

export const normalize = (severity?: SeverityLevel): SeverityLevel[] => {
  return severity ? [severity] : [1, 2];
};

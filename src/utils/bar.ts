import chalk from "chalk";

export const getString = (length: number, color: "red" | "yellow"): string => {
  return chalk[color](" ".repeat(length));
};

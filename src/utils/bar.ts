import { bgRed, bgYellow } from "./colors.js";

export const getString = (length: number, color: "red" | "yellow"): string => {
  const colorFn = color === "red" ? bgRed : bgYellow;

  return colorFn(" ".repeat(length));
};

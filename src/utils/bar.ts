import { red, yellow } from "./colors";

export const getString = (length: number, color: "red" | "yellow"): string => {
  const colorFn = color === "red" ? red : yellow;
  return colorFn(" ".repeat(length));
};

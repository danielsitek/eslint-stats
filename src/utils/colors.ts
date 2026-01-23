import { styleText } from "node:util";

/**
 * Native color utilities using Node.js util.styleText (Node 20+)
 * Replaces chalk dependency with zero-dependency solution
 */

type Color = "red" | "yellow" | "magenta" | "underline" | "bgRed" | "bgYellow";

export const color = (text: string, style: Color): string => {
  return styleText(style, text);
};

export const red = (text: string): string => color(text, "red");

export const yellow = (text: string): string => color(text, "yellow");

export const magenta = (text: string): string => color(text, "magenta");

export const underline = (text: string): string => color(text, "underline");

export const bgRed = (text: string): string => color(text, "bgRed");

export const bgYellow = (text: string): string => color(text, "bgYellow");

import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      semi: "error",
      "prefer-const": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  prettierConfig,
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
]);

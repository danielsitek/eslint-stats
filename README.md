[![Build Status](https://github.com/danielsitek/eslint-stats/actions/workflows/dev.yml/badge.svg?branch=main)](https://github.com/danielsitek/eslint-stats/actions)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6c466a724da04212b8471eda7c6adf16)](https://app.codacy.com/gh/danielsitek/eslint-stats/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/6c466a724da04212b8471eda7c6adf16)](https://app.codacy.com/gh/danielsitek/eslint-stats/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Maintainability](https://qlty.sh/gh/danielsitek/projects/eslint-stats/maintainability.svg)](https://qlty.sh/gh/danielsitek/projects/eslint-stats)
[![GitHub Release](https://img.shields.io/github/v/release/danielsitek/eslint-stats)](https://github.com/danielsitek/eslint-stats/releases)
[![NPM Version](https://img.shields.io/npm/v/%40danielsitek%2Feslint-stats)](https://www.npmjs.com/package/@danielsitek/eslint-stats)

# Statistics Reporter for ESLint

Modern TypeScript formatters for ESLint with aggregated error and warning statistics. Analyzes files by error frequency rather than location, making it easier to prioritize fixes when introducing ESLint to existing projects.

![screenshot](https://raw.githubusercontent.com/danielsitek/eslint-stats/master/screenshot.png)

## Features

- Multiple aggregation views (by error, warning, folder)
- Color-coded output with visual graphs
- ESLint 8 and 9 compatible
- Full TypeScript support with type definitions
- Zero runtime dependencies
- Modern Node.js (20+)

## Installation

```bash
npm install --save-dev @danielsitek/eslint-stats
```

## Usage with ESLint

Create a file named `stats.mjs`:

```js
import { byErrorAndWarning } from "@danielsitek/eslint-stats/by-error-and-warning";

export default byErrorAndWarning;
```

```bash
eslint . --format ./stats.mjs
```

## Available Formatters

### by-error

Displays aggregated error statistics without file separation. Only shows rules with errors; warnings are not displayed.

### by-warning

Displays aggregated warning statistics without file separation. Only shows rules with warnings; errors are not displayed.

### by-error-and-warning

Displays aggregated statistics for both errors and warnings without file separation. Errors are shown in red, warnings in yellow.

### by-error-and-warning-stacked

Similar to `by-error-and-warning` but displays errors and warnings stacked together when a rule has both severities across different files.

### by-folder

Displays aggregated statistics grouped by folder. Errors are shown in red, warnings in yellow.

## Demo

The package includes demo scripts for testing formatters:

```bash
npm run demo:error
npm run demo:warning
npm run demo:both
npm run demo:stacked
npm run demo:folder
```

## Requirements

- Node.js >= 20.0.0
- ESLint >= 8.0.0

## Migration from `ganimomer/eslint-stats` v1.x

If you're upgrading from the original `eslint-stats` package:

1. Update package name:

   ```bash
   npm uninstall eslint-stats
   npm install --save-dev @danielsitek/eslint-stats
   ```

2. Update formatter paths in your ESLint configuration or CLI commands to use the new scoped package name.

3. For programmatic usage, update imports to use the scoped package name.

## Credits

Modernized fork of [eslint-stats](https://github.com/ganimomer/eslint-stats) by [Omer Ganim](https://github.com/ganimomer).

## License

MIT

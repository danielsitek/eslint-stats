[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6c466a724da04212b8471eda7c6adf16)](https://app.codacy.com/gh/danielsitek/eslint-stats/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

# Statistic Reporter for ESLint.

Analyses the files for error frequency, rather than location. This is helpful when introducing ESLint to an existing project.

![screenshot](https://raw.githubusercontent.com/ganimomer/eslint-stats/master/screenshot.png)

# Install

```js
npm install --save-dev eslint-stats
```

# Getting Started

Use it with grunt:

```js
...
  eslint: {
    options: {
      format: require('eslint-stats').byError,
      src: [...]
    },
...
```

or use it directly with ESLint:

```bash
$ eslint --format node_modules/eslint-stats/byError.js
```

# Available Reporters:

### byError

Shows the eslint report, aggragated by errors, without separation into specific files. Rules with warnings are not displayed

### byWarning

Shows the eslint report, aggragated by warnings, without separation into specific files. Rules with errors are not displayed.

### byErrorAndWarning

Shows the eslint report, aggragated by errors and warnings, without separation into specific files. Errors are red, and warnings are yellow.

### byErrorAndWarningStacked

Shows the eslint report, aggragated by errors and warnings, without separation into specific files. Errors are red, and warnings are yellow.
If any rule is an error in one file and a warning in another, results show up stacked.

### byFolder

Shows the eslint report, aggragated by errors and warnings, separated into folders. Errors are red, and warnings are yellow.

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { byRule, byFolderAndRule } from "../src/utils/stats";
import type { LintResult } from "../src/types/types";

describe("stats", () => {
  const eslintResults: LintResult[] = [
    {
      filePath: "path1",
      messages: [
        {
          ruleId: "id1",
          severity: 2,
          message: "Error",
          line: 1,
          column: 1,
        },
        {
          ruleId: "id2",
          severity: 2,
          message: "Error",
          line: 2,
          column: 1,
        },
      ],
      errorCount: 2,
      fatalErrorCount: 0,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
      suppressedMessages: [],
    },
    {
      filePath: "path2",
      messages: [
        {
          ruleId: "id1",
          severity: 2,
          message: "Error",
          line: 1,
          column: 1,
        },
      ],
      errorCount: 1,
      fatalErrorCount: 0,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
      suppressedMessages: [],
    },
    {
      filePath: "path3",
      messages: [
        {
          ruleId: "id3",
          severity: 1,
          message: "Warning",
          line: 1,
          column: 1,
        },
      ],
      errorCount: 0,
      fatalErrorCount: 0,
      warningCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
      suppressedMessages: [],
    },
    {
      filePath: "/components/footer/shippay-badges/ShipPayBadges.stories.tsx",
      messages: [],
      suppressedMessages: [],
      errorCount: 0,
      fatalErrorCount: 0,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
    },
    {
      filePath: "/components/footer/shippay-badges/ShipPayBadges.tsx",
      messages: [],
      suppressedMessages: [],
      errorCount: 0,
      fatalErrorCount: 0,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      usedDeprecatedRules: [],
    },
    {
      filePath: "/components/footer/socials/Socials.stories.tsx",
      messages: [
        {
          ruleId: null,
          message:
            "Unused eslint-disable directive (no problems were reported from 'react-hooks/rules-of-hooks').",
          line: 26,
          column: 5,
          severity: 1,
          fix: {
            range: [596, 650],
            text: " ",
          },
        },
      ],
      suppressedMessages: [],
      errorCount: 0,
      fatalErrorCount: 0,
      warningCount: 1,
      fixableErrorCount: 0,
      fixableWarningCount: 1,
      source:
        'import { useStore } from "@f-hooks/store-provider";\nimport type { SettingsStore } from "@f-stores/settings/index.store";\nimport type { Meta, StoryObj } from "@storybook/nextjs";\nimport { Socials } from "./Socials";\n\ntype Story = StoryObj<typeof Socials>;\n\nconst meta: Meta<typeof Socials> = {\n    title: "Footer/Socials",\n    component: Socials,\n    tags: ["autodocs"],\n\n    argTypes: {\n        className: {\n            control: {\n                type: "text",\n            },\n            description: "Tailwind CSS class",\n        },\n    },\n};\n\nexport default meta;\n\nconst Wrap = (args) => {\n    // eslint-disable-next-line react-hooks/rules-of-hooks\n    const { settings } = useStore();\n\n    const updatedArgs = {\n        ...args,\n        settings: {\n            ...settings,\n            ...args.settings,\n        } as SettingsStore,\n    };\n\n    return <Socials {...updatedArgs} />;\n};\n\nexport const Default: Story = {\n    render: (args) => <Wrap {...args} />,\n\n    decorators: [\n        (Story) => (\n            <div className="[--social-icons__link__color:#000]">\n                <Story />\n            </div>\n        ),\n    ],\n};\n',
      usedDeprecatedRules: [],
    },
    {
      filePath: "/components/forms/checkbox-as-figure/index.tsx",
      messages: [
        {
          ruleId: "@typescript-eslint/no-explicit-any",
          severity: 2,
          message: "Unexpected any. Specify a different type.",
          line: 12,
          column: 4,
          nodeType: "TSAnyKeyword",
          messageId: "unexpectedAny",
          endLine: 12,
          endColumn: 7,
          suggestions: [
            {
              messageId: "suggestUnknown",
              fix: {
                range: [209, 212],
                text: "unknown",
              },
              desc: "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct.",
            },
            {
              messageId: "suggestNever",
              fix: {
                range: [209, 212],
                text: "never",
              },
              desc: "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of.",
            },
          ],
        },
        {
          ruleId: "@typescript-eslint/no-explicit-any",
          severity: 2,
          message: "Unexpected any. Specify a different type.",
          line: 36,
          column: 39,
          nodeType: "TSAnyKeyword",
          messageId: "unexpectedAny",
          endLine: 36,
          endColumn: 42,
          suggestions: [
            {
              messageId: "suggestUnknown",
              fix: {
                range: [1174, 1177],
                text: "unknown",
              },
              desc: "Use `unknown` instead, this will force you to explicitly, and safely assert the type is correct.",
            },
            {
              messageId: "suggestNever",
              fix: {
                range: [1174, 1177],
                text: "never",
              },
              desc: "Use `never` instead, this is useful when instantiating generic type parameters that you don't need to know the type of.",
            },
          ],
        },
      ],
      suppressedMessages: [],
      errorCount: 2,
      fatalErrorCount: 0,
      warningCount: 0,
      fixableErrorCount: 0,
      fixableWarningCount: 0,
      source:
        'import { useState } from "react";\nimport Image from "next/image";\n\nexport const FormCheckboxAsFigureGroup = ({\n    name,\n    register,\n    required,\n    value,\n    media,\n    checked = false,\n    onChange,\n}: any) => {\n    const [c, setC] = useState(checked);\n\n    return (\n        <div className="pb-1 pt-1">\n            <label htmlFor={name} className="cursor-pointer">\n                <div\n                    className={`w-[60px] h-[60px] transition cursor-pointer block overflow-hidden border-2 ${\n                        c ? "border-black" : "border-white"\n                    } rounded-full p-[2px]`}\n                >\n                    <Image\n                        width={60}\n                        height={60}\n                        src={media.path}\n                        alt={name}\n                        className={`rounded-full object-cover border border-white -z-1`}\n                    />\n                </div>\n                <div className="text-base text-center mt-1">{name}</div>\n                <input\n                    id={name}\n                    {...register(name, {\n                        required,\n                        onChange: (e: any) => {\n                            if (onChange) onChange();\n                            setC(e.target.checked);\n                        },\n                    })}\n                    name={name}\n                    type="checkbox"\n                    value={value || c}\n                    className="hidden"\n                />\n            </label>\n        </div>\n    );\n};\n',
      usedDeprecatedRules: [],
    },
  ];

  it("should return an empty object for empty array results", () => {
    const result = byRule([]);
    assert.deepStrictEqual(result, {});
  });

  it("should return an aggregated object by rule, then severity", () => {
    const stats = byRule(eslintResults);
    assert.strictEqual(Object.keys(stats).length, 4);
    assert.deepStrictEqual(stats.id1, { error: 2 });
    assert.deepStrictEqual(stats.id2, { error: 1 });
    assert.deepStrictEqual(stats.id3, { warning: 1 });
    assert.deepStrictEqual(stats["@typescript-eslint/no-explicit-any"], {
      error: 2,
    });
  });

  it("should accept a second param, severity, which filters the severities", () => {
    const stats = byRule(eslintResults, 2);
    assert.deepStrictEqual(Object.keys(stats).length, 3);
    assert.deepStrictEqual(stats.id1, { error: 2 });
    assert.deepStrictEqual(stats.id2, { error: 1 });
    assert.deepStrictEqual(stats["@typescript-eslint/no-explicit-any"], {
      error: 2,
    });
  });

  describe("byFolderAndRule", () => {
    const cwd = process.cwd();
    const byFolderResults: LintResult[] = [
      {
        filePath: `${cwd}/path1/file1.js`,
        messages: [
          {
            ruleId: "id1",
            severity: 2,
            message: "Error",
            line: 1,
            column: 1,
          },
          {
            ruleId: "id2",
            severity: 2,
            message: "Error",
            line: 2,
            column: 1,
          },
        ],
        errorCount: 2,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        suppressedMessages: [],
      },
      {
        filePath: `${cwd}/path1/file2.js`,
        messages: [
          {
            ruleId: "id1",
            severity: 2,
            message: "Error",
            line: 1,
            column: 1,
          },
        ],
        errorCount: 1,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        suppressedMessages: [],
      },
      {
        filePath: `${cwd}/path3/file3.js`,
        messages: [
          {
            ruleId: "id1",
            severity: 1,
            message: "Warning",
            line: 1,
            column: 1,
          },
        ],
        errorCount: 0,
        fatalErrorCount: 0,
        warningCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        suppressedMessages: [],
      },
    ];

    it("should divide the results by folder", () => {
      const stats = byFolderAndRule(byFolderResults);
      const expectedResult = {
        path1: {
          id1: { error: 2 },
          id2: { error: 1 },
        },
        path3: {
          id1: { warning: 1 },
        },
      };
      assert.deepStrictEqual(stats, expectedResult);
    });
  });
});

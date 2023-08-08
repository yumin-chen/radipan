import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import main from "./bin";
import { extractCSS } from "./bin";

describe("cli/bin", () => {
  let mockExecSync: jest.Mock;

  beforeEach(() => {
    mockExecSync = jest.fn();
  });

  afterEach(() => {
    mockExecSync.mockRestore();
  });

  describe("css-extract", () => {
    it("should call extractCSS and copy-artifacts commands with or without watch option", () => {
      type Case = {
        argv: string[];
        extractCSS: string;
        copyArtifacts: string;
      };
      const cases: Record<string, Case> = {
        "without watch": {
          argv: ["node", "main.ts", "css-extract"],
          extractCSS: extractCSS,
          copyArtifacts:
            'npx tsx "node_modules/radipan/dist/copy-artifacts.js"',
        },
        "with watch": {
          argv: ["node", "main.ts", "css-extract", "--watch"],
          extractCSS: `${extractCSS} --watch`,
          copyArtifacts:
            'npx tsx "node_modules/radipan/dist/copy-artifacts.js"',
        },
      };
      for (const name of Object.keys(cases) as (keyof typeof cases)[]) {
        const testCase = cases[name];
        process.argv = testCase.argv;
        main(mockExecSync);
        expect(mockExecSync).toHaveBeenCalledTimes(2);
        expect(mockExecSync).toHaveBeenCalledWith(testCase.extractCSS, {
          stdio: "inherit",
        });
        expect(mockExecSync).toHaveBeenCalledWith(testCase.copyArtifacts, {
          stdio: "inherit",
        });
        mockExecSync.mockReset();
      }
    });
  });

  describe("cssgen", () => {
    it("should call extractCSS and panda cssgen commands with or without watch option and with default or custom config path", () => {
      type Case = {
        argv: string[];
        cssgen: string;
      };
      const cases: Record<string, Case> = {
        "without watch and default config": {
          argv: ["node", "main.ts", "cssgen"],
          cssgen:
            "npx radipan css-extract && npx panda cssgen --config radipan.config.ts",
        },
        "without watch and custom config": {
          argv: ["node", "main.ts", "cssgen", "--config", "custom.config.ts"],
          cssgen:
            "npx radipan css-extract && npx panda cssgen --config custom.config.ts",
        },
        "with watch and default config": {
          argv: ["node", "main.ts", "cssgen", "--watch"],
          cssgen: `npx radipan css-extract --watch & npx panda cssgen --config radipan.config.ts --watch`,
        },
        "with watch and custom config": {
          argv: [
            "node",
            "main.ts",
            "cssgen",
            "--watch",
            "--config",
            "custom.config.ts",
          ],
          cssgen: `npx radipan css-extract --watch & npx panda cssgen --config custom.config.ts --watch`,
        },
      };
      for (const name of Object.keys(cases) as (keyof typeof cases)[]) {
        const testCase = cases[name];
        process.argv = testCase.argv;
        main(mockExecSync);
        expect(mockExecSync).toHaveBeenCalledTimes(1);
        expect(mockExecSync).toHaveBeenCalledWith(testCase.cssgen, {
          stdio: "inherit",
        });
        mockExecSync.mockReset();
      }
    });
  });

  describe("design", () => {
    it("should call panda studio command with default or custom config path", () => {
      type Case = {
        argv: string[];
        studio: string;
      };
      const cases: Record<string, Case> = {
        "default config": {
          argv: ["node", "main.ts", "design"],
          studio: `npx panda studio --config radipan.config.ts`,
        },
        "custom config": {
          argv: ["node", "main.ts", "design", "--config", "custom.config.ts"],
          studio: `npx panda studio --config custom.config.ts`,
        },
      };
      for (const name of Object.keys(cases) as (keyof typeof cases)[]) {
        const testCase = cases[name];
        process.argv = testCase.argv;
        main(mockExecSync);
        expect(mockExecSync).toHaveBeenCalledTimes(1);
        expect(mockExecSync).toHaveBeenCalledWith(testCase.studio, {
          stdio: "inherit",
        });
        mockExecSync.mockReset();
      }
    });
  });

  describe("prepare", () => {
    it("should call panda codegen and radipan cssgen commands with default or custom config path", () => {
      type Case = {
        argv: string[];
        prepare: string;
      };
      const cases: Record<string, Case> = {
        "default config": {
          argv: ["node", "main.ts", "prepare"],
          prepare: `npx panda codegen --config radipan.config.ts && npx radipan cssgen --config radipan.config.ts`,
        },
        "custom config": {
          argv: ["node", "main.ts", "prepare", "--config", "custom.config.ts"],
          prepare: `npx panda codegen --config custom.config.ts && npx radipan cssgen --config custom.config.ts`,
        },
      };
      for (const name of Object.keys(cases) as (keyof typeof cases)[]) {
        const testCase = cases[name];
        process.argv = testCase.argv;
        main(mockExecSync);
        expect(mockExecSync).toHaveBeenCalledTimes(1);
        expect(mockExecSync).toHaveBeenCalledWith(testCase.prepare, {
          stdio: "inherit",
        });
        mockExecSync.mockReset();
      }
    });
  });

  describe("invalid command", () => {
    it("should log an error and exit the process with code 1", () => {
      process.argv = ["node", "main.ts", "invalid"];
      jest.spyOn(console, "error");
      console.error = jest.fn();
      jest.spyOn(process, "exit");
      (process.exit as unknown as jest.Mock).mockImplementation(() => {});
      main(mockExecSync);
      expect(console.error).toHaveBeenCalledWith("Invalid command:", "invalid");
      expect(process.exit).toHaveBeenCalledWith(1);
    });
  });
});

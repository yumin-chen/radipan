import { transpile } from "./transpiler";
import {
  describe,
  beforeEach,
  afterEach,
  expect,
  test,
  jest,
} from "@jest/globals";
import { readFileSync } from "fs";
import mock from "mock-fs";

// Define some constants for testing
const EXPORT_FOLDER = "node_modules/test_out_dir/exported";
const filenames = {
  jsxFile: "jsxFile.jsx",
  hsFile: "hsFile.ts",
};

// Define some sample source files with JSX and Hyperscript syntax
const jsxSrc = `
<div radipanId={"radipanId1"} css={{ color: "red" }}>
  Hello
</div>
`;

const hyperscriptSrc = `
h("div", { radipanId: "radipanId2", css: { color: "blue" } }, "World")
`;

const jsxOutput = `
<div /* Radipan Transpiled */ className={"merged class names returned from cx"}>
  Hello
</div>
`;

const hyperscriptOutput = `
h("div", { /* Radipan Transpiled */ className: "merged class names returned from cx",}, "World")
`;

jest.mock("../../cli/get-config", () => ({
  __esModule: true,
  outdir: "test_out_dir",
}));

jest.mock("../../cli/get-design-system", () => ({
  __esModule: true,
  cx: jest.fn(() => "merged class names returned from cx"),
}));

// Group the tests into a suite with a name
describe("transpile", () => {
  let srcFilename = "";
  let srcContent = "";

  beforeEach(() => {
    process.env.EXPORT_FOLDER = EXPORT_FOLDER;
  });

  afterEach(() => {
    mock.restore();
  });

  test("should transpile JSX syntax", async () => {
    srcFilename = filenames.jsxFile;
    srcContent = jsxSrc;
    process.env.CSSGEN_FILE = srcFilename;
    mock({
      [`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`]: srcContent,
    });
    // Call the transpile function with some arguments
    const result = await transpile("radipanId1", "class1", "class2");
    // Expect the result to be true
    expect(result).toBe(true);
    // Expect the output file to match the expected output
    expect(
      readFileSync(`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`, "utf-8")
    ).toEqual(jsxOutput);
  });

  test("should transpile Hyperscript syntax", async () => {
    srcFilename = filenames.hsFile;
    srcContent = hyperscriptSrc;
    process.env.CSSGEN_FILE = srcFilename;
    mock({
      [`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`]: srcContent,
    });
    // Call the transpile function with some arguments
    const result = await transpile("radipanId2", "class1", "class2");
    // Expect the result to be true
    expect(result).toBe(true);
    // Expect the output file to match the expected output
    expect(
      readFileSync(`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`, "utf-8")
    ).toEqual(hyperscriptOutput);
  });

  test("should return false if radipanId is not found", async () => {
    srcFilename = filenames.hsFile;
    srcContent = hyperscriptSrc;
    process.env.CSSGEN_FILE = srcFilename;
    mock({
      [`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`]: srcContent,
    });
    // Call the transpile function with an invalid radipanId
    const result = await transpile("radipanId3", "class1", "class2");
    // Expect the result to be false
    expect(result).toBe(false);
  });

  test("should return false if closing tag is not found", async () => {
    srcFilename = filenames.jsxFile;
    srcContent = `<div radipanId={"radipanId4"} css={{ color: "green" }
    Oops
  </div>
  `;
    process.env.CSSGEN_FILE = srcFilename;
    mock({
      [`${EXPORT_FOLDER}/${srcFilename}.lite.tsx`]: srcContent,
    });
    // Call the transpile function with a valid radipanId but an invalid source file
    const result = await transpile("radipanId4", "class1", "class2");
    // Expect the result to be false
    expect(result).toBe(false);
  });
});

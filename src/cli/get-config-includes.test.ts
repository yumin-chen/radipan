import childProcess from "child_process";
import { getIncludeFileList } from "./get-config-includes";
import { describe, expect, jest, test } from "@jest/globals";

jest.mock("./get-config", () => ({
  __esModule: true,
  include: ["include_path"],
  exclude: ["exclude_path"],
  includeNames: ["*.file1.ts", "*.file2.ts"],
  excludeNames: ["no-file1.ts", "no-file2.ts"],
}));

describe("get-config-includes::getIncludeFileList", () => {
  const execSyncSpy = jest.spyOn(childProcess, "execSync");

  test("should return correct file list", () => {
    const mockOutput = "include_path/file1.ts\ninclude_path/file2.ts";
    execSyncSpy.mockReturnValue(mockOutput);
    const expectedFileList = ["include_path/file1.ts", "include_path/file2.ts"];

    const result = getIncludeFileList();

    expect(result).toEqual(expectedFileList);
    expect(execSyncSpy).toHaveBeenCalledWith(
      'find "include_path"  ! -path "exclude_path"   ! -iname "no-file1.ts"   ! -iname "no-file2.ts"  -type f \\( -iname "*.file1.ts"  -o  -iname "*.file2.ts" \\)'
    );
  });
});

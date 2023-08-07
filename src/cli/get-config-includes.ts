import { execSync } from "child_process";
import { include, exclude, includeNames, excludeNames } from "./get-config";

const parseFilePathArr = (filePathArr: string[]) =>
  filePathArr
    .map(filePath => {
      const includeNameStr = includeNames
        .map(name => ` -iname "${name}" `)
        .join(" -o ");
      const excludeNameStr = excludeNames
        .map(name => ` ! -iname "${name}" `)
        .join(" ");
      const excludePaths = exclude.map(path => ` ! -path "${path}" `).join(" ");

      return execSync(
        `find "${filePath}" ${excludePaths} ${excludeNameStr} -type f \\(${includeNameStr}\\)`
      )
        .toString()
        .trim()
        .split(/\r?\n/);
    })
    .flat(1);

export const getIncludeFileList = () => parseFilePathArr(include);

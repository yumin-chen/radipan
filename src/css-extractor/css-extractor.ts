import fs from "fs";
import { execSync } from "child_process";
import {
  include,
  exclude,
  includeNames,
  excludeNames,
  outdir,
} from "radipan/radipan.config.json";

fs.existsSync(`node_modules/${outdir}/exported`) &&
  fs.rmSync(`node_modules/${outdir}/exported`, { recursive: true });

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

const includeFileList = parseFilePathArr(include);

includeFileList.forEach(async srcFile => {
  fs.mkdirSync(`node_modules/${outdir}/exported/${srcFile}.out`, {
    recursive: true,
  });
  console.log(`Processing app: ${srcFile}`);
  process.env.CSSGEN = "pregen";
  process.env.CSSGEN_FILE = srcFile;
  execSync(
    `tsx --tsconfig "node_modules/radipan/extractor.tsconfig.json" "node_modules/radipan/dist/css-extractor/extract.js" ${srcFile}`,
    { stdio: "inherit" }
  );
  process.env.CSSGEN = "done";
  process.env.CSSGEN_FILE = "";
});

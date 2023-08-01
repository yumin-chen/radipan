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

includeFileList.forEach(srcFile => {
  fs.mkdirSync(`node_modules/${outdir}/exported/${srcFile}.out`, {
    recursive: true,
  });
  process.env.CSSGEN_FILE = srcFile;
  console.log(`Processing app: ${srcFile}`);
  import(`../../../../${srcFile}`)
    .then(module => {
      const exported = module.default;
      if (typeof exported !== "function") {
        throw "Only function components are supported.";
      }
      fs.copyFileSync(
        fs.realpathSync(`./${srcFile}`),
        `node_modules/${outdir}/exported/${srcFile}.lite.tsx`
      );
      process.env.DEBUG && console.debug(exported.toString());
      exported();
      console.log("Successfully extracted:", srcFile);
    })
    .catch(err => {
      console.log("Failed to process:", srcFile, err);
    });
});

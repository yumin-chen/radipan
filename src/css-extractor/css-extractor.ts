import fs from "fs";
import { execSync } from "child_process";
import { outdir } from "../cli/get-config";
import { getIncludeFileList } from "../cli/get-config-includes";

fs.existsSync(`node_modules/${outdir}/exported`) &&
  fs.rmSync(`node_modules/${outdir}/exported`, { recursive: true });

getIncludeFileList().forEach(async srcFile => {
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

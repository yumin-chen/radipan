import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { format, resolveConfig, resolveConfigFile } from "prettier";
import {
  outdir,
  sourceTranspile,
} from "radipan/radipan.config.json" assert { type: "json" };

// const process = (typeof global !== "undefined" && global?.process) || {
//   env: {},
// };
// const DEBUG = process?.env?.DEBUG;

const prettierConfigResolve = async () => {
  const prettierConfig = await resolveConfigFile();
  prettierConfig && (await resolveConfig(prettierConfig));
};

prettierConfigResolve();

sourceTranspile?.enabled &&
  execSync(`find "node_modules/${outdir}/exported" -iname "*.lite.tsx"`)
    .toString()
    .trim()
    .split(/\r?\n/)
    .forEach(async file => {
      if (!file) return;
      const i = file.lastIndexOf(`node_modules/${outdir}/exported/`);
      if (i == -1) return;
      const iExt = file.lastIndexOf(".", file.length - ".lite.tsx".length - 1);
      const ext = file.substring(iExt, file.length - ".lite.tsx".length);
      const outPath =
        file.substring(
          i + `node_modules/${outdir}/exported/`.length,
          file.length - ".lite.tsx".length - ext.length
        ) + sourceTranspile?.extension;
      // DEBUG &&
      //   console.debug(
      //     "Copying",
      //     file,
      //     "to",
      //     file.substring(
      //       i + `node_modules/${outdir}/exported/`.length,
      //       file.length - ".lite.tsx".length
      //     ) + sourceTranspile?.extension,
      //   );
      const fileContent = readFileSync(file, "utf-8");
      writeFileSync(
        outPath,
        await format(fileContent, { parser: "typescript" })
      );
    });

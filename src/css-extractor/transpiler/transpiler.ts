import { format, resolveConfig, resolveConfigFile } from "prettier";
import { outdir } from "radipan/radipan.config.json";
import { cx } from "radipan/design-system";
import { writeFileSync, readFileSync } from "fs";

const EXPORT_FOLDER = `node_modules/${outdir}/exported`;
const process = (typeof global !== "undefined" && global?.process) || {
  env: {},
};
const DEBUG = process?.env?.DEBUG;
const TRANSPILED_FILES = new Map();

global.fileLock = "";

const prettierConfigResolve = async () => {
  const prettierConfig = await resolveConfigFile();
  prettierConfig && (await resolveConfig(prettierConfig));
};

const prettierConfigResolvePromise = prettierConfigResolve();

export const transpileForJsx = async (
  radipanId,
  _source,
  cssProp,
  className,
  cssClasses
) => {
  const transpileFileName = `${EXPORT_FOLDER}/${process.env.CSSGEN_FILE}.lite.tsx`;
  while (global.fileLock === transpileFileName) {
    await prettierConfigResolvePromise;
  }
  global.fileLock = transpileFileName;
  const allFileContents =
    (TRANSPILED_FILES.has(transpileFileName) &&
      TRANSPILED_FILES.get(transpileFileName)) ||
    readFileSync(transpileFileName, "utf-8");
  const lines = allFileContents.split(/\r?\n/);
  const restOfFile =
    lines[_source.lineNumber - 1].substring(_source.columnNumber - 1) +
    "\n" +
    lines
      .slice(_source.lineNumber)
      .join("\n")
      .replaceAll(new RegExp(/\r?\n\s+/, "g"), "\n  ")
      .replaceAll(new RegExp(/\r?\n\s+}/, "g"), "\n}");

  const cssString = (
    await format(JSON.stringify(cssProp), { parser: "json5" })
  ).replace(/\r?\n+$/, "");
  const numCssLines = cssString.split(/\r?\n/).length;

  if (restOfFile.indexOf(`css={${cssString}}`) === -1) {
    console.error(
      "Failed to transpile ",
      transpileFileName,
      restOfFile,
      `css={${cssString}}`
    );
  }
  const replacement = `/* Radipan Transpiled */ ${"\n".repeat(
    numCssLines - 1
  )} className="${!className ? cssClasses : cx(cssClasses, className)}"`;
  const replaced = restOfFile.replace(
    `radipanId={"${radipanId}"} css={${cssString}}`,
    replacement
  );
  const transpiledContents =
    lines.slice(0, _source.lineNumber - 1).join("\n") +
    "\n" +
    lines[_source.lineNumber - 1].substring(0, _source.columnNumber - 1) +
    replaced;
  TRANSPILED_FILES.set(transpileFileName, transpiledContents);
  writeFileSync(transpileFileName, transpiledContents);
  global.fileLock = "";
  DEBUG &&
    console.debug(
      "Transpiled component successfully: ",
      transpileFileName,
      cssString,
      replaced
    );
};

export const transpileForHyperscript = async (
  radipanId,
  cssProp,
  className,
  cssClasses
) => {
  const transpileFileName = `${EXPORT_FOLDER}/${process.env.CSSGEN_FILE}.lite.tsx`;
  while (global.fileLock === transpileFileName) {
    await prettierConfigResolvePromise;
  }
  global.fileLock = transpileFileName;
  const allFileContents =
    (TRANSPILED_FILES.has(transpileFileName) &&
      TRANSPILED_FILES.get(transpileFileName)) ||
    readFileSync(transpileFileName, "utf-8");
  const formatted = allFileContents
    .split(/\r?\n/)
    .join("\n")
    .replaceAll(new RegExp(/\r?\n\s+/, "g"), "\n  ")
    .replaceAll(new RegExp(/\r?\n\s+}/, "g"), "\n}");

  const cssString = (
    await format(JSON.stringify(cssProp), { parser: "json5" })
  ).replace(/\r?\n+$/, "");
  const numCssLines = cssString.split(/\r?\n/).length;

  if (formatted.indexOf(`css: ${cssString}`) === -1) {
    console.error(
      "Failed to transpile ",
      transpileFileName,
      formatted,
      `css: ${cssString}`
    );
  }
  const replaceRegex = `radipanId: "${radipanId}", css: {${".*\\r?\\n".repeat(
    numCssLines - 1
  )}.*},?`;
  const replacement = `/* Radipan Transpiled */ ${"\n".repeat(
    numCssLines - 1
  )} className: "${!className ? cssClasses : cx(cssClasses, className)}"${
    numCssLines === 1 ? " }," : ""
  }`;

  // console.log(numCssLines, numCssLines === 1, replaceRegex, "|", replacement);
  const replaced = formatted.replace(new RegExp(replaceRegex), replacement);
  TRANSPILED_FILES.set(transpileFileName, replaced);
  writeFileSync(transpileFileName, replaced);
  global.fileLock = "";
  DEBUG &&
    console.debug(
      "Transpiled component successfully: ",
      transpileFileName,
      cssString,
      replaced
    );
};

import { format, resolveConfig, resolveConfigFile } from "prettier";
import { outdir } from "radipan/radipan.config.json";
import { cx } from "radipan/design-system";
import { writeFileSync, readFileSync } from "fs";

const EXPORT_FOLDER = `node_modules/${outdir}/exported`;
const process = (typeof global !== "undefined" && global?.process) || {
  env: {},
};
const DEBUG = process?.env?.DEBUG;
const COMPILED_FILES = new Map();

const prettierConfigResolve = async () => {
  const prettierConfig = await resolveConfigFile();
  prettierConfig && (await resolveConfig(prettierConfig));
};

const prettierConfigResolvePromise = prettierConfigResolve();

export const transpileForJsx = async (
  _source,
  cssProp,
  className,
  cssClasses
) => {
  !!prettierConfigResolvePromise && (await prettierConfigResolvePromise);
  const transpileFileName = `${EXPORT_FOLDER}/${process.env.CSSGEN_FILE}.lite.tsx`;
  const allFileContents =
    (COMPILED_FILES.has(transpileFileName) &&
      COMPILED_FILES.get(transpileFileName)) ||
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
  const replaced = restOfFile.replace(`css={${cssString}}`, replacement);
  const transpiledContents =
    lines.slice(0, _source.lineNumber - 1).join("\n") +
    "\n" +
    lines[_source.lineNumber - 1].substring(0, _source.columnNumber - 1) +
    replaced;
  COMPILED_FILES.set(transpileFileName, transpiledContents);
  writeFileSync(transpileFileName, transpiledContents);
  DEBUG &&
    console.debug("Transpiled component successfully: ", cssString, replaced);
};

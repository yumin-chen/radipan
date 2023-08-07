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

export const transpileForJsx = async (radipanId, className, cssClasses) => {
  const transpileFileName = `${EXPORT_FOLDER}/${process.env.CSSGEN_FILE}.lite.tsx`;
  while (global.fileLock !== "") {
    await prettierConfigResolvePromise;
  }
  global.fileLock = transpileFileName;
  const src =
    (TRANSPILED_FILES.has(transpileFileName) &&
      TRANSPILED_FILES.get(transpileFileName)) ||
    readFileSync(transpileFileName, "utf-8");
  const keyPos = src.indexOf(`radipanId={"${radipanId}"} css={`);
  if (keyPos === -1) {
    DEBUG &&
      console.error(
        "Failed to transpile ",
        transpileFileName,
        src,
        `radipanId={"${radipanId}"} css={`
      );
    return false;
  }
  const classesStr = !className ? cssClasses : cx(cssClasses, className);
  const escapedClassStr = classesStr.replace(/"/g, '\\"');
  const replacement = `/* Radipan Transpiled */ className={"${escapedClassStr}"}`;
  const end = findBalancedClosingBracketOrEol(src, keyPos + 24, "{", "}");
  if (end === -1) {
    DEBUG &&
      console.error(
        "Cannot find closing tag ",
        transpileFileName,
        src,
        keyPos + 24,
        replacement
      );
    return false;
  }
  const replaced =
    src.substring(0, keyPos) + replacement + src.substring(end + 1);
  TRANSPILED_FILES.set(transpileFileName, replaced);
  writeFileSync(transpileFileName, replaced);
  global.fileLock = "";
  DEBUG &&
    console.debug(
      "Transpiled component successfully: ",
      transpileFileName,
      replaced
    );
  return true;
};

export const transpileForHyperscript = async (
  radipanId: string,
  className: string,
  cssClasses: string
) => {
  const transpileFileName = `${EXPORT_FOLDER}/${process.env.CSSGEN_FILE}.lite.tsx`;
  while (global.fileLock !== "") {
    await prettierConfigResolvePromise;
  }
  global.fileLock = transpileFileName;
  const src =
    (TRANSPILED_FILES.has(transpileFileName) &&
      TRANSPILED_FILES.get(transpileFileName)) ||
    readFileSync(transpileFileName, "utf-8");
  const keyPos = src.indexOf(`radipanId: "${radipanId}", css: `);
  if (keyPos === -1) {
    DEBUG &&
      console.error(
        "Failed to transpile ",
        transpileFileName,
        src,
        `radipanId: "${radipanId}", css: `
      );
    return false;
  }
  const classesStr = !className ? cssClasses : cx(cssClasses, className);
  const escapedClassStr = classesStr.replace(/"/g, '\\"');
  const replacement = `/* Radipan Transpiled */ className: "${escapedClassStr}"`;
  const end = findBalancedClosingBracketOrEol(src, keyPos + 24, "{", "}");
  if (end === -1) {
    DEBUG &&
      console.error(
        "Cannot find closing tag ",
        transpileFileName,
        src,
        keyPos + 24,
        replacement
      );
    return false;
  }
  const replaced =
    src.substring(0, keyPos) + replacement + src.substring(end + 1);
  TRANSPILED_FILES.set(transpileFileName, replaced);
  writeFileSync(transpileFileName, replaced);
  global.fileLock = "";
  DEBUG &&
    console.debug(
      "Transpiled component successfully: ",
      transpileFileName,
      // cssString,
      replaced
    );
  return true;
};

// Get index of balanced closing bracket, or get the index of end of line if
//  there's no bracket (variable assignment for example)
const findBalancedClosingBracketOrEol = (
  str: string,
  start: number,
  startBracket: string,
  endBracket: string
): number => {
  let balance = 0;
  let balanceChanged = false;
  for (let i = start; i < str.length; i++) {
    if (str[i] === startBracket) {
      balance++;
      balanceChanged = true;
    } else if (str[i] === endBracket) {
      if (!balanceChanged) {
        return i - 1;
      }
      balance--;
      balanceChanged = true;
    } else if ((str[i] === "," || str[i] === "\n") && !balanceChanged) {
      return i;
    }
    if (balance === 0 && balanceChanged) {
      return i;
    }
  }
  return -1;
};

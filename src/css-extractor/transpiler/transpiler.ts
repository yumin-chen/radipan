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

type Syntax = "JSX" | "HyperScript";

// Define the transpile function that does not take a syntax parameter
export const transpile = async (
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

  const jsxKeyString = `radipanId={"${radipanId}"} css={`;
  const hyperscriptKeyString = `radipanId: "${radipanId}", css: `;
  let keyPos = src.indexOf(jsxKeyString);
  let syntax: Syntax;
  if (keyPos === -1) {
    keyPos = src.indexOf(hyperscriptKeyString);
    if (keyPos === -1) {
      DEBUG &&
        console.error(
          "Failed to transpile ",
          transpileFileName,
          src,
          radipanId
        );
      return false;
    } else {
      syntax = "HyperScript";
    }
  } else {
    syntax = "JSX";
  }
  // Get the key string based on the syntax
  const keyString = syntax === "JSX" ? jsxKeyString : hyperscriptKeyString;
  const classesStr = !className ? cssClasses : cx(cssClasses, className);
  const escapedClassStr = classesStr.replace(/"/g, '\\"');
  // Use a ternary operator to get the replacement string based on the syntax
  const replacement = `/* Radipan Transpiled */ ${
    syntax === "JSX"
      ? `className={"${escapedClassStr}"}`
      : `className: "${escapedClassStr}",`
  }`;
  const end = findBalancedClosingBracketOrEol(
    src,
    keyPos + keyString.length,
    "{",
    "}"
  );
  if (end === -1) {
    DEBUG &&
      console.error(
        "Cannot find closing tag ",
        transpileFileName,
        src,
        keyPos + keyString.length,
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
    } else if (str[i] === "," && !balanceChanged) {
      return i + 1;
    } else if (str[i] === "\n" && !balanceChanged) {
      return i;
    }
    if (balance === 0 && balanceChanged) {
      return i + 1;
    }
  }
  return -1;
};

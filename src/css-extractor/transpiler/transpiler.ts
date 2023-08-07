import { outdir } from "../../cli/get-config";
import { cx } from "../../cli/get-design-system";
import { writeFileSync, readFileSync } from "fs";

const EXPORT_FOLDER = `node_modules/${outdir}/exported`;
const process = (typeof global !== "undefined" && global?.process) || {
  env: { DEBUG: false, fileLock: "", CSSGEN_FILE: "" },
};
const DEBUG = process?.env?.DEBUG;
const TRANSPILED_FILES = new Map();

process.env.fileLock = "";

type Syntax = "JSX" | "HyperScript";

export const transpile = async (
  radipanId: string,
  className: string,
  cssClasses: string
) => {
  const transpileFileName = `${EXPORT_FOLDER}/${process.env.CSSGEN_FILE}.lite.tsx`;
  while (process.env.fileLock !== "") {
    await new Promise(() => {});
  }
  process.env.fileLock = transpileFileName;
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
      process.env.fileLock = "";
      return false;
    } else {
      syntax = "HyperScript";
    }
  } else {
    syntax = "JSX";
  }
  const keyString = syntax === "JSX" ? jsxKeyString : hyperscriptKeyString;
  const classesStr = !className ? cssClasses : cx(cssClasses, className);
  const escapedClassStr = classesStr.replace(/"/g, '\\"');
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
    process.env.fileLock = "";
    return false;
  }
  const replaced =
    src.substring(0, keyPos) + replacement + src.substring(end + 1);
  TRANSPILED_FILES.set(transpileFileName, replaced);
  writeFileSync(transpileFileName, replaced);
  DEBUG &&
    console.debug(
      "Transpiled component successfully: ",
      transpileFileName,
      replaced
    );
  process.env.fileLock = "";
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

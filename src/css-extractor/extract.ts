import {
  existsSync,
  realpathSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "fs";
import { outdir } from "../cli/get-config";
import { preformat } from "./transpiler/preformatter";

const [, , srcFile, ...options] = process.argv;

try {
  const srcContent = readFileSync(realpathSync(`./${srcFile}`), "utf-8");
  if (!srcContent) {
    throw Error(`Failed to read file: ./${srcFile}`);
  }
  const dest = `node_modules/${outdir}/exported/${srcFile}.lite.tsx`;
  const preformatted = preformat(srcContent);
  if (!preformatted || preformatted.length < srcContent.length) {
    throw Error(`Failed to preformat file: ./${srcFile}`);
  }
  writeFileSync(dest, preformatted);
  writeFileSync(`./${srcFile}.init.tsx`, preformatted);
  const module = await import(`../../../../${srcFile}.init.tsx`);
  rmSync(`./${srcFile}.init.tsx`);
  const { default: exported } = module;
  if (typeof exported !== "function") {
    throw "Only function components are supported.";
  }
  process.env.DEBUG && console.debug(exported.toString());
  exported();
  console.log("Successfully extracted:", srcFile);
} catch (error) {
  console.log("Failed to process:", srcFile, error);
} finally {
  existsSync(`./${srcFile}.init.tsx`) && rmSync(`./${srcFile}.init.tsx`);
}

import { copyFileSync, realpathSync } from "fs";
import { outdir } from "radipan/radipan.config.json";

const [, , srcFile, ...options] = process.argv;

try {
  const module = await import(`../../../../${srcFile}`);
  const { default: exported } = module;
  if (typeof exported !== "function") {
    throw "Only function components are supported.";
  }
  copyFileSync(
    realpathSync(`./${srcFile}`),
    `node_modules/${outdir}/exported/${srcFile}.lite.tsx`
  );
  process.env.DEBUG && console.debug(exported.toString());
  exported();
} catch (error) {
  console.log("Failed to process:", srcFile, error);
}

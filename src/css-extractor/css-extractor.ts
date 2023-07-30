import fs from "fs";
import { appEntry, outdir } from "radipan/radipan.config.json";

fs.existsSync(`node_modules/${outdir}/exported`) &&
  fs.rmSync(`node_modules/${outdir}/exported`, { recursive: true });

fs.mkdirSync(`node_modules/${outdir}/exported/${appEntry}.out`, {
  recursive: true,
});

process.env.CSSGEN_FILE = appEntry;
console.log(`Processing app: ${appEntry}`);
import(`../../../../${appEntry}`)
  .then(module => {
    const exported = module.default;
    if (typeof exported !== "function") {
      throw "Only function components are supported.";
    }
    fs.copyFileSync(
      fs.realpathSync(`./${appEntry}`),
      `node_modules/${outdir}/exported/${appEntry}.lite.ts`
    );
    process.env.DEBUG && console.debug(exported.toString());
    exported();
    console.log("Successfully extracted:", appEntry);
  })
  .catch(err => {
    console.log("Failed to process:", appEntry, err);
  });

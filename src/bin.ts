import { execSync } from "child_process";

const [, , command, ...options] = process.argv;

console.log("Radipan:", command, ...options);

const readOptionContent = (
  options: string[],
  longCmd: string,
  shortCmd: string
) => {
  const index = options.findIndex(
    option => option === longCmd || option === shortCmd
  );
  return (
    (index >= 0 && options.length > index + 1 && options[index + 1]) || null
  );
};
const configPath =
  readOptionContent(options, "--config", "-c") || "radipan.config.ts";

switch (command) {
  case "css-extract": {
    if (options.includes("--watch")) {
      execSync(
        'CSSGEN=pregen npx tsx --watch --tsconfig "node_modules/radipan/extractor.tsconfig.json" "node_modules/radipan/dist/css-extractor/css-extractor.js"',
        { stdio: "inherit" }
      );
      break;
    }

    execSync(
      'CSSGEN=pregen npx tsx --tsconfig "node_modules/radipan/extractor.tsconfig.json" "node_modules/radipan/dist/css-extractor/css-extractor.js"',
      { stdio: "inherit" }
    );
    break;
  }
  case "cssgen": {
    if (options.includes("--watch")) {
      execSync(
        `npx radipan css-extract --watch & npx panda cssgen --config ${configPath} --watch`,
        { stdio: "inherit" }
      );
      break;
    }

    execSync(
      `npx radipan css-extract && npx panda cssgen --config ${configPath}`,
      { stdio: "inherit" }
    );
    break;
  }
  case "design": {
    execSync(`npx panda studio --config ${configPath}`, { stdio: "inherit" });
    break;
  }
  case "prepare": {
    execSync(
      `npx panda codegen --config ${configPath} && npx radipan cssgen --config ${configPath}`,
      {
        stdio: "inherit",
      }
    );
    break;
  }
}

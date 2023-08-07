import { execSync } from "child_process";

export const readOptionContent = (
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

export const extractCSS =
  'npx tsx --tsconfig "node_modules/radipan/extractor.tsconfig.json" "node_modules/radipan/dist/css-extractor/css-extractor.js"';

export const main = (execCommandSync: Function) => {
  const [, , command, ...options] = process.argv;

  console.log("Radipan:", command, ...options);

  const configPath =
    readOptionContent(options, "--config", "-c") || "radipan.config.ts";

  const execCommand = (cmd: string) => {
    try {
      execCommandSync(cmd, { stdio: "inherit" });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };

  switch (command) {
    case "css-extract": {
      if (options.includes("--watch")) {
        execCommand(`${extractCSS} --watch`);
        execCommand('npx tsx "node_modules/radipan/dist/copy-artifacts.js"');
        break;
      }

      execCommand(extractCSS);
      execCommand('npx tsx "node_modules/radipan/dist/copy-artifacts.js"');
      break;
    }
    case "cssgen": {
      if (options.includes("--watch")) {
        execCommand(
          `${extractCSS} --watch & npx panda cssgen --config ${configPath} --watch`
        );
        break;
      }

      execCommand(`${extractCSS} && npx panda cssgen --config ${configPath}`);
      break;
    }
    case "design": {
      execCommand(`npx panda studio --config ${configPath}`);
      break;
    }
    case "prepare": {
      execCommand(
        `npx panda codegen --config ${configPath} && npx radipan cssgen --config ${configPath}`
      );
      break;
    }
    default: {
      console.error("Invalid command:", command);
      process.exit(1);
    }
  }
};

process.env.NODE_ENV !== "test" && main(execSync);

export default main;

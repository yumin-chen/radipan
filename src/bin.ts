import { execSync } from 'child_process';


const [, , command, ...options] = process.argv;

console.log("Radipan command:", command, ...options)

switch (command) {
  case 'css-extract': {
    if (options.includes("--watch")) {
      execSync(
        'CSSGEN=pregen npx tsx --watch --tsconfig "node_modules/radipan/extractor.tsconfig.json" "node_modules/radipan/dist/css-extractor/css-extractor.js"',
        { stdio: 'inherit' }
      );
      break;
    }

    execSync(
      'CSSGEN=pregen npx tsx --tsconfig "node_modules/radipan/extractor.tsconfig.json" "node_modules/radipan/dist/css-extractor/css-extractor.js"',
      { stdio: 'inherit' }
    );
    break;
  }
  case 'cssgen': {
    if (options.includes("--watch")) {
      execSync('npx radipan css-extract --watch & npx panda cssgen --watch', { stdio: 'inherit' });
      break;
    }

    execSync(
      'npx radipan css-extract & npx panda cssgen',
      { stdio: 'inherit' }
    );
    break;
  }
  case 'design': {
    execSync('npx panda studio', { stdio: 'inherit' });
    break;
  }
  case 'prepare': {
    execSync('panda codegen & npx radipan cssgen', { stdio: 'inherit' });
    break;
  }
}

import { execSync } from 'child_process';

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

if (process.argv.length > 2 && process.argv[2] === 'css-extract') {
  execSync(
    'CSSGEN=pregen npx tsx --tsconfig "node_modules/radipan/extractor.tsconfig.json" "node_modules/radipan/dist/css-extractor/css-extractor.js"',
    { stdio: 'inherit' }
  );
}

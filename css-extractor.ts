import fs from 'fs';
import { appEntry } from 'radipan/radipan.config.json';

fs.existsSync('node_modules/styled-system/exported') &&
  fs.rmSync('node_modules/styled-system/exported', { recursive: true });

process.env.CSSGEN_FILE = appEntry;
console.log(`Processing app: ${appEntry}`);
import(`../../${appEntry}`)
  .then(module => {
    const exported = module.default;
    if (typeof exported !== 'function') {
      throw 'Only function components are supported.';
    }
    exported();
    console.log('Successfully extracted:', appEntry);
  })
  .catch(err => {
    console.log('Failed to process:', appEntry, err);
  });

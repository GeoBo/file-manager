import fs from "fs";
import path from "path"
import { stdin, stdout } from 'process';

import { getArgFromKey } from "./lib/argsOperations.mjs";


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// stdin.pipe(reverseText).pipe(stdout);

//stdin.pipe(stdout);

const userName = getArgFromKey('--username');

console.log(`Welcome to the File Manager, ${userName}!`);

stdin.on('data', data => {
  if (data.toString().trim() == '.exit') process.exit();
  stdout.write(data);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log(`Thank you for using File Manager, ${userName}, goodbye!`));



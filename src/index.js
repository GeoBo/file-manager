import { realpath } from "fs/promises";
import path from "path"
import os from "os";
import { stdin, stdout, cwd } from 'process';
import { getArgFromKey, checkArgsCount } from "./lib/argsOperations.mjs";
import { colorize } from "./lib/view.mjs";



const userName = getArgFromKey('--username') || 'Mr. Smith';

stdout.write(`Welcome to the File Manager, ${userName}!\n`);

process.chdir(os.homedir());
stdout.write(`You are currently in ${cwd()}>`);

stdin.setEncoding("utf-8");

stdin.on('data', async (data) => {
  const command = data.trim();
  if (command == '.exit') process.exit();
  await parseUserInput(command)
  //stdout.write(data);
  stdout.write(`\nYou are currently in ${cwd()}>`);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log(`\nThank you for using File Manager, ${userName}, goodbye!`));

async function parseUserInput(data) {
  stdout.write(data, data.split(' '));
  const command = data.split(' ')[0];
  const args = data.split(' ').slice(1);
  stdout.write(command, args);

  switch(command) {
    case 'up': upWorkDir(args);
      break;
    case 'cd': await setWorkDir(args);
      break;
    default:  stdout.write(colorize(91, 'Invalid input'));
  }
}

function upWorkDir(args) {
  if(!checkArgsCount(args, 0)) return;
  process.chdir(path.dirname(cwd()));
}

async function setWorkDir(args) {
  if(!checkArgsCount(args, 1)) return;
  
  const pathNoSpaces = args.toString().replace(/(\s+)/g, '\\$1');
  
  //stdout.write(args);
  const newPath = path.resolve(pathNoSpaces);

  try {
    const newRealPath = await realpath(newPath);
    process.chdir(newRealPath);
  } catch(e) {
    stdout.write(colorize(91, 'Operation failed'));
  } 
}
import { realpath } from "fs/promises";
import path from "path"
import os, { EOL } from "os";
import { stdin, stdout, cwd } from 'process';
import { getArgFromKey, checkArgsCount, parseInput } from "./lib/argsOperations.mjs";
import { getDirContent, readStreamFile, createEmptyFile, renameUserFile, 
  copyUserFile, removeUserFile, moveUserFile, getFileHash, 
  brotliFileCompress, brotliFileDecompress } from "./lib/fsOperations.mjs";
import { truncateString, sortFiles, getEOLSymbol, 
  showCPUS, printGreenText, printRedText } from "./lib/view.mjs";

//process.chdir(os.homedir());

process.chdir('D:\\');

const userName = getArgFromKey('--username') || 'Mr. Smith';
stdout.write(`Welcome to the File Manager, ${userName}!\n`);
stdout.write(`You are currently in ${cwd()}>`);
stdin.setEncoding("utf-8");


stdin.on('data', async (data) => {
  const command = data.trim();
  if (command == '.exit') process.exit();
  await parseUserInput(command)
  stdout.write(`${EOL}You are currently in ${cwd()}>`);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write(`${EOL}Thank you for using File Manager, ${userName}, goodbye!`));

async function parseUserInput(data) {

  const input = parseInput(data);
  const command = input[0];
  const args = input.slice(1);

  switch(command) {
    case 'up': upWorkDir(args);
      break;
    case 'cd': await setWorkDir(args);
      break;
    case 'ls': await showDirContent(args);
      break;
    case 'cat': await readFile(args);
      break;
    case 'add': await createFile(args);
      break;
    case 'rn': await renameFile(args);
      break;
    case 'cp': await copyFile(args);
      break;
    case 'rm': await removeFile(args);
      break;
    case 'mv': await moveFile(args);
      break;
    case 'os': getSystemInfo(args);
      break;
    case 'hash': await getHash(args);
      break; 
    case 'compress': await compressFile(args);
      break; 
    case 'decompress': await decompressFile(args);
      break; 
    default: printRedText('Invalid input');
  }
}

async function compressFile(args) {
  if(!checkArgsCount(args, 2)) return;
  const pathToFile = path.resolve(args[0]);
  const pathToNewDir = path.resolve(args[1]);
  await brotliFileCompress(pathToFile, pathToNewDir);
}

async function decompressFile(args) {
  if(!checkArgsCount(args, 2)) return;
  const pathToFile = path.resolve(args[0]);
  const pathToNewDir = path.resolve(args[1]);
  await brotliFileDecompress(pathToFile, pathToNewDir);
}

async function getHash(args) {
  if(!checkArgsCount(args, 1)) return;
  const pathToFile = path.resolve(args[0]);
  const hash = await getFileHash(pathToFile);
  printGreenText(hash);
}

function getSystemInfo(args) {
  if(!checkArgsCount(args, 1)) return;
  const cmd = args[0].slice(2);

  switch(cmd) {
    case 'EOL': printGreenText(getEOLSymbol());
      break;
    case 'cpus': showCPUS();
      break;
    case 'homedir': printGreenText(os.homedir());
      break;
    case 'username': printGreenText(os.userInfo().username);
      break;
    case 'architecture': printGreenText(os.arch());
      break;
    default: printRedText('Invalid input');
  }
}

async function removeFile(args) {
  if(!checkArgsCount(args, 1)) return;
  const pathToFile = path.resolve(args[0]);
  await removeUserFile(pathToFile);
}

async function moveFile(args) {
  if(!checkArgsCount(args, 2)) return;
  const pathToFile = path.resolve(args[0]);
  const pathToNewDir = path.resolve(args[1]);
  await moveUserFile(pathToFile, pathToNewDir);
}

async function copyFile(args) {
  if(!checkArgsCount(args, 2)) return;
  const pathToFile = path.resolve(args[0]);
  const pathToNewDir = path.resolve(args[1]);
  await copyUserFile(pathToFile, pathToNewDir);
}

async function renameFile(args) {
  if(!checkArgsCount(args, 2)) return;
  const oldPath = path.resolve(args[0]);
  const newPath = path.resolve(args[1]);
  await renameUserFile(oldPath, newPath);
}

async function createFile(args) {
  if(!checkArgsCount(args, 1)) return;
  await createEmptyFile(path.resolve(args[0]));
}

async function readFile(args) {
  if(!checkArgsCount(args, 1)) return;
  await readStreamFile(path.resolve(args[0]));
}

async function showDirContent(args) {
  if(!checkArgsCount(args, 0)) return;
  const files = await getDirContent(cwd())

  const list = files.map((file) => ({
    'Name': truncateString(file.name, 20),
    'Type': file.isDirectory() ? 'directory' : 'file',
  }));

  sortFiles(list);
  console.table(list);
}

function upWorkDir(args) {
  if(!checkArgsCount(args, 0)) return;
  process.chdir(path.dirname(cwd()));
}

async function setWorkDir(args) {
  if(!checkArgsCount(args, 1)) return;
  
  const newPath = path.resolve(args[0]);

  try {
    const newRealPath = await realpath(newPath);
    process.chdir(newRealPath);
  } catch(e) {
    printRedText('Operation failed');
  } 
}
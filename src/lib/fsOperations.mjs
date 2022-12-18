import { readdir, writeFile, access, rename, rm, readFile } from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { stdout } from 'process';
import { colorize } from "./view.mjs";
import path from "path"
import crypto from 'crypto';
import zlib from 'zlib';

async function getDirContent (destination) {
  try {
    const files = await readdir(destination, { withFileTypes: true });
    return files;
  } catch(err) {
    stdout.write(colorize(91, 'Operation failed'));
  };
};

async function readStreamFile (destination) {
  return new Promise((resolve) => {
    const stream = createReadStream(destination);
    
    stream.on('data', chunk => stdout.write(colorize(92, chunk)));
    stream.on('end', () => resolve());

    stream.on('error', (err) => {
      stdout.write(colorize(91, 'Operation failed'));
      resolve();
    });
  });
};

async function createEmptyFile (destination) {
  try {
    await writeFile(destination, '', { flag: 'wx', mode: 0o755 });
  } catch(err) {
    stdout.write(colorize(91, 'Operation failed'));
  };
};

async function renameUserFile (oldPath, newPath) {
  try {
      await access(newPath);
  } catch (e) {
      return rename(oldPath, newPath).catch(err => {
        stdout.write(colorize(91, 'Operation failed'));
      });
  }
  stdout.write(colorize(91, 'Operation failed'));
}

async function copyUserFile (pathToFile, pathToNewDir) {

  try {
    await access(pathToFile);
  } catch (e) {
    return stdout.write(colorize(91, 'Operation failed'));
  }

  return new Promise((resolve) => {
    const fileCopyPath = path.resolve(pathToNewDir, path.basename(pathToFile)) 
    
    const inputStream  = createReadStream(pathToFile, { flags: 'r'});
    const outputStream = createWriteStream(fileCopyPath, { flags: 'wx', mode: 0o755})

    inputStream.pipe(outputStream);

    outputStream.on('finish', () => resolve());
    outputStream.on('error', async () => {  
      stdout.write(colorize(91, 'Operation failed'));
      resolve();
    });
  });
}

async function moveUserFile (pathToFile, pathToNewDir) {
  try {
    await access(pathToFile);
  } catch (e) { 
    return stdout.write(colorize(91, 'Operation failed: access'));
  }

  return new Promise((resolve) => {
    const fileCopyPath = path.resolve(pathToNewDir, path.basename(pathToFile)) 
    
    const inputStream  = createReadStream(pathToFile);
    const outputStream = createWriteStream(fileCopyPath, { flags: 'wx', mode: 0o755 })
    inputStream.pipe(outputStream);

    outputStream.on('finish', async () => {
      inputStream.on('close', async () => {
        await rm(pathToFile).catch();  
        resolve();
      });
    });
    outputStream.on('error', async () => {  
      stdout.write(colorize(91, 'Operation failed: outputStream'));
      resolve();
    });
  });
}

async function removeUserFile (pathToFile) {
  try {
    await rm(pathToFile);
  } catch (e) {
    stdout.write(colorize(91, 'Operation failed'));
  }
}

async function getFileHash (destination) {
  try {
    const content = await readFile(destination, { encoding: 'utf8' });
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (e) {
    stdout.write(colorize(91, 'Operation failed'));
  } 
};

async function brotliFileCompress (pathToFile, pathToNewDir) {
  try {
    await access(pathToFile);
  } catch (e) {
    return stdout.write(colorize(91, 'Operation failed'));
  }

  return new Promise((resolve) => {
    //const newFileName = path.basename(pathToFile, path.extname(pathToFile)) + '.br';
    const newFileName = path.basename(pathToFile) + '.br';
    const fileCopyPath = path.resolve(pathToNewDir, newFileName) 
    
    const inputStream  = createReadStream(pathToFile, { flags: 'r'});
    const outputStream = createWriteStream(fileCopyPath, { flags: 'wx', mode: 0o755})
    const brotli = zlib.createBrotliCompress();

    inputStream.pipe(brotli).pipe(outputStream);

    outputStream.on('finish', () => resolve());
    outputStream.on('error', async () => {  
      stdout.write(colorize(91, 'Operation failed'));
      resolve();
    });
  });
}

async function brotliFileDecompress (pathToFile, pathToNewDir) {
  try {
    await access(pathToFile);
  } catch (e) {
    return stdout.write(colorize(91, 'Operation failed'));
  }

  return new Promise((resolve) => {
    // const newFileName = path.basename(pathToFile);
    const newFileName = path.basename(pathToFile, path.extname(pathToFile));
    const fileCopyPath = path.resolve(pathToNewDir, newFileName) 
    
    const inputStream  = createReadStream(pathToFile, { flags: 'r'});
    const outputStream = createWriteStream(fileCopyPath, { flags: 'wx', mode: 0o755})
    const brotli = zlib.createBrotliDecompress();

    inputStream.pipe(brotli).pipe(outputStream);

    outputStream.on('finish', () => resolve());
    outputStream.on('error', async () => {  
      stdout.write(colorize(91, 'Operation failed'));
      resolve();
    });
  });
}

export { getDirContent, readStreamFile, createEmptyFile, 
  renameUserFile, copyUserFile, removeUserFile, moveUserFile, getFileHash, brotliFileCompress, brotliFileDecompress };
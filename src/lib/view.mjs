
import os from "os";
import { EOL } from "os";
import { stdout } from "process";


function colorize(color, output) {
    return ['\x1b[', color, 'm', output, '\x1b[0m'].join('');
}

function truncateString(str, limit) {
    if (str.length > limit) {
      return str.slice(0, limit) + "...";
    } else {
      return str;
    }
}

function sortFiles(list) {
    list.sort(function (a, b) {
        if (a.Type > b.Type) return 1;
        if (a.Type < b.Type) return -1;

        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
    })
};

function getEOLSymbol() {
  return EOL.replace(/\n/g,'\\n').replace(/\t/,'\\t');
};

function showCPUS() {
  const cpus = os.cpus();
  printGreenText(`CPUS: ${cpus.length}${EOL}`);

  cpus.forEach((cpu) => {
    const text = `model: ${cpu.model.trim()}, clock rate: ${(cpu.speed / 1024).toFixed(4)} GHz${EOL}`;
    printGreenText(text);
  });
}

function printGreenText(text) {
  stdout.write(colorize(92, text));
}

function printRedText(text) {
  stdout.write(colorize(91, text));
}

export { colorize, truncateString, sortFiles, getEOLSymbol, 
  showCPUS, printGreenText, printRedText };

import os from "os";
import { printGreenText } from './view.mjs'

function showCPUS() {
  const cpus = os.cpus();
  printGreenText(`CPUS: ${cpus.length}${os.EOL}`);

  cpus.forEach((cpu) => {
    const text = `model: ${cpu.model.trim()}, clock rate: ${(cpu.speed / 1024).toFixed(4)} GHz${os.EOL}`;
    printGreenText(text);
  });
}

export default showCPUS;
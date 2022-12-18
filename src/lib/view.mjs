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

function printGreenText(text) {
  stdout.write(colorize(92, text));
}

function printRedText(text) {
  stdout.write(colorize(91, text));
}

export { colorize, truncateString, printGreenText, printRedText };

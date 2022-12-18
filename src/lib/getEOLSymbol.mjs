import { EOL } from "os";

function getEOLSymbol() {
  return EOL.replace(/\n/g,'\\n').replace(/\t/,'\\t');
};

export default getEOLSymbol;
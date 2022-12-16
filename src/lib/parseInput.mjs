function parseInput(myString) {
  const myRegexp = /[^\s"]+|"([^"]*)"/gi;
  const myArray = [];
  let match;

  do {
      match = myRegexp.exec(myString);
      if (match != null)
      {
          myArray.push(match[1] ? match[1] : match[0]);
      }
  } while (match != null);
  return myArray;
}

export default parseInput;
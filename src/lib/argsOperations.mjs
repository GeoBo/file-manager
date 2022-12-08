function getArgFromKey(flag) {

  const args = process.argv;

  for(let i = 2; i < args.length; i += 1) {
    const arg = args[i];
    if(arg.startsWith(flag)) {
        return arg.slice(flag.length + 1, arg.length);
    };
  }
  
  return null; 
}

export { getArgFromKey };

function colorize(color, output) {
    return ['\x1b[', color, 'm', output, '\x1b[0m'].join('');
}

export { colorize };

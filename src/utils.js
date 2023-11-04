const { promisify } = require("util");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = promisify(rl.question).bind(rl);
module.exports = { prompt };

const { promisify } = require("util");
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = promisify(rl.question).bind(rl);
const sleep = (ms) => new Promise((res) => setTimeout(res, ms))
module.exports = { prompt, sleep };

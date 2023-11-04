const { prompt, sleep } = require("./utils");
const { mainMenu } = require("./menu.js");

async function game(player, msg) {
  console.clear();
  const rounds = parseInt(await prompt(msg));
  if (isNaN(rounds)) {
    game(player, `Please type down a number!\n`);
    return;
  }
  console.log(`Okay! ${rounds} rounds it is! You can quit the game anytime by pressing the "enter" button without typing anything. Enjoy!`);
}

module.exports = { game };

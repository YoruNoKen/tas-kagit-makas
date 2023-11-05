const { prompt, sleep } = require("./utils");
const fs = require("fs");

const elementsObj = {
  0: "rock",
  1: "paper",
  2: "scissors",
};
const elementsArray = ["rock", "paper", "scissors"];

const beats = {
  rock: "scissors",
  paper: "rock",
  scissors: "paper",
};

async function game(player, msg, mainMenu) {
  console.clear();
  const rounds = parseInt(await prompt(msg));
  if (isNaN(rounds)) {
    game(player, `Please type down a number!\n`);
    return;
  }

  console.clear();
  await prompt(`Okay, ${rounds} rounds it is! Start the game by pressing "enter".\nYou can quit the game anytime by pressing the "enter" button without typing anything. Enjoy!`);
  console.clear();

  const roundResults = {
    victory: 0,
    loss: 0,
    draw: 0,
  };

  for (let i = 1; rounds >= i; i++) {
    console.log(`# Round ${i}\n`);
    const answer = parseInt(await prompt("What do you want to play?\n[0] Rock\n[1] Paper\n[2] Scissors\n"));
    if (isNaN(answer)) {
      saveResults(roundResults, player);
      mainMenu(player);
      return;
    }

    if (answer > 3 || answer < 0) {
      game(player, "Please ,.\n[0]Rock\n[1]Paper\n[2]Scissors\n");
      return;
    }

    const selectedElement = elementsObj[answer];
    const randomElement = elementsArray[Math.floor(Math.random() * elementsArray.length)];

    const beatsBool = beats[selectedElement] === randomElement || (selectedElement === randomElement ? "draw" : false);
    await prompt(`\nRound ${i} over!\nIt was: a ${beatsBool === "draw" ? "draw~" : beatsBool ? "victory!" : "loss.."}\n\nYour pick: ${selectedElement}\nOpponent's pick: ${randomElement}\n\nPress enter to progress into the next round.`);
    roundResults[beatsBool === "draw" ? "draw" : beatsBool ? "victory" : "loss"]++;
    console.clear();
  }
  saveResults(roundResults, player);

  await prompt(`Game over!\nYou won: ${roundResults.victory} rounds,\nLost ${roundResults.loss},\nand in ${roundResults.draw} of the rounds, it was a draw!\n\npress enter to return back to the main menu`);
  mainMenu(player);
}

function saveResults(results, player) {
  const existingResults = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));
  existingResults[player].victory += results.victory;
  existingResults[player].loss += results.loss;
  existingResults[player].draw += results.draw;

  fs.writeFileSync("./stats.json", JSON.stringify(existingResults, null, 2));
}

module.exports = { game };

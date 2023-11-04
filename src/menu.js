// most random thing ever
const { prompt, sleep } = require("./utils");
const { game } = require("./game");
const fs = require("fs");

let selectedPlayer = "";

const statsExists = () => fs.existsSync("./stats.json");
async function playerDoesntExist(msg) {
  const username = await prompt(msg);
  if (username.length === 0) {
    console.clear();
    playerDoesntExist("Please input a username:\n");
    return;
  }

  const user = {
    [username]: {
      loss: 0,
      victory: 0,
      draw: 0,
    },
  };

  fs.writeFileSync("./stats.json", JSON.stringify(user, null, 2), "utf-8");
  playerExists(username);
  return;
}

async function selectPlayer(msg, usersObject) {
  let users = "";
  for (let i in usersObject) {
    users += `[${i}] ${usersObject[i][0]}\n`;
  }

  const index = parseInt(await prompt(`${msg}\n${users}\n`));

  if (usersObject.length - 1 < index || isNaN(index)) {
    console.clear();
    return await selectPlayer("Please select a user:", usersObject);
  }

  let _newUsersObject = Object.entries(JSON.parse(await fs.promises.readFile("./stats.json", "utf-8")));

  return _newUsersObject[index][0];
}

async function playerExists(player) {
  console.clear();
  const usersJson = JSON.parse(await fs.promises.readFile("./stats.json", "utf-8"));

  const usersObject = player ? false : Object.entries(usersJson);
  if (Object.keys(usersJson).length > 1 && usersObject !== false) {
    selectedPlayer = await selectPlayer("Select a user you wish to play as:", usersObject);
    console.clear();
    return playerExists(selectedPlayer);
  }

  mainMenu(player || usersObject[0][0]);
}

function resetEverything() {
  console.clear();
  fs.unlinkSync("./stats.json");
  initializeGame();
}

async function viewStats(player) {
  console.clear();
  console.log(
    `\nHere are your stats, ${player}:\n` +
      Object.entries(JSON.parse(fs.readFileSync("./stats.json", "utf-8"))[player])
        .map(([key, value]) => `${key}: ${value}`)
        .join(", \n")
  );
  await prompt("\nPress enter to go back to the main menu!\n");
  mainMenu(player);
}

async function addPlayer(msg, player) {
  console.clear();
  const username = await prompt(msg);
  if (username.length === 0) {
    addPlayer("Please select a new name for the player:\n");
    return;
  }

  const usersJson = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));

  if (usersJson[username]) {
    addPlayer("That username already exists. Pick another one:\n");
    return;
  }

  usersJson[username] = {
    victory: 0,
    loss: 0,
    draw: 0,
  };

  fs.writeFileSync("./stats.json", JSON.stringify(usersJson, null, 2));
  console.log(`${username} added!`);
  await sleep(1000);
  mainMenu(player);
}

async function removePlayer(player) {
  console.clear();
  const userJson = JSON.parse(await fs.promises.readFile("./stats.json", "utf-8"));
  const usersObject = Object.entries(userJson);

  let users = "";
  for (let i in usersObject) {
    users += `[${i}] ${usersObject[i][0]} (${Object.entries(usersObject[i][1])
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")})\n`;
  }
  const answer = await prompt("What user do you want to remove? (enter to quit)\n" + users);
  const deletedUser = usersObject[answer][0];

  if (answer.length === 0) {
    mainMenu(player);
  }

  delete userJson[deletedUser];
  if (userJson.length === 0) {
    resetEverything();
  }
  fs.writeFileSync("./stats.json", JSON.stringify(userJson, null, 2));
  console.log(`Successfully removed ${deletedUser}!`);
  await sleep(1000);
  mainMenu(player);
}

async function mainMenu(player) {
  console.clear();
  console.log(`Welcome back, ${player}!`);
  console.log("What would you like to do?");
  const answer = await prompt("\n[0] Play rock paper scissors \n[1] Views stats\n[2] Select a player \n[3] Add a new player \n[4] Remove a player \n[5] Reset everything\n[6] Quit\n\n");
  switch (answer) {
    case "0":
      game(player, `Hello, ${player}! how many rounds do you want to play?\n`);
      break;
    case "1":
      viewStats(player);
      break;
    case "2":
      playerExists();
      break;
    case "3":
      addPlayer("Select a new name for the player:\n", player);
      break;
    case "4":
      removePlayer(player);
      break;
    case "5":
      resetEverything();
      break;
    case "6":
      console.clear();
      console.log("Thanks for playing!");
      process.exit();
    default:
      mainMenu(player);
      break;
  }
}

async function initializeGame() {
  console.clear();
  statsExists() ? await playerExists() : await playerDoesntExist("It seems like this is your first time playing, please enter your username:\n");
}
initializeGame();

module.exports = { mainMenu };

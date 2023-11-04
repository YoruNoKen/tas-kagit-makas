// most random thing ever
const { prompt } = require("./utils");
const fs = require("fs");

let selectedPlayer = "";

const statsExists = () => fs.existsSync("./stats.json");
async function playerDoesntExist(msg) {
  const username = await prompt(msg);
  if (username.length === 0) {
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

  await fs.promises.writeFile("./stats.json", JSON.stringify(user, null, 2), "utf-8");
  playerExists();
  return;
}

async function selectPlayer(msg, usersObject) {
  let users = "";
  for (let i in usersObject) {
    users += `[${i}] ${usersObject[i][0]}\n`;
  }

  const index = parseInt(await prompt(`${msg}\n${users}\n`));

  if (usersObject.length - 1 < index || isNaN(index)) {
    return await selectPlayer("Please select a user:", usersObject);
  }

  return usersObject[index][0];
}

async function playerExists(player) {
  const usersJson = JSON.parse(await fs.promises.readFile("./stats.json", "utf-8"));

  const usersObject = Object.entries(player ? usersJson[player] : usersJson);
  if (usersObject.length > 1 && selectedPlayer.length === 0) {
    selectedPlayer = await selectPlayer("Select a user you wish to play as:", usersObject);
    return playerExists(selectedPlayer);
  }

  viewStats(selectedPlayer);
  mainMenu();
}

const viewStats = (player) => {
  console.log(
    `\nHere are your stats, ${player}:\n` +
      Object.entries(JSON.parse(fs.readFileSync("./stats.json", "utf-8"))[player])
        .map(([key, value]) => `${key}: ${value}`)
        .join(", \n")
  );
};

function mainMenu() {}

async function initialize() {
  statsExists() ? await playerExists() : await playerDoesntExist("It seems like this is your first time playing, please enter your username:\n");
}
initialize();

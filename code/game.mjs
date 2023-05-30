//#region
import * as readlinePromises from "node:readline/promises";
const rl = readlinePromises.createInterface({
  input: process.stdin,
  output: process.stdout
});
//#endregion

const gameBoard = [
    [0,0,0],
    [0,0,0],
    [0,0,0],
];

const playerASymbol = "X";
const playerBSymbol = "O";

const playerAValue = 1;
const playerBValue = -1;

let continueGame = true;
let activePlayer = playerAValue;

let playerAName = "Player A";
let playerBName = "Player B";

showMainMenu();

async function showMainMenu()  {
    console.clear();
    console.log("=== Tic Tac Toe ===");
    console.log("1. Start Game");
    console.log("2. Change Player Names");
    console.log("3. Quit");
    const choice = await rl.question("Enter your choice: ");
  
    switch (choice)  {
      case "1":
        await startGame();
        break;
      case "2":
        await changePlayerNames();
        await showMainMenu();
        break;
      case "3":
        console.log("Goodbye!");
        process.exit(0);
      default:
        console.log("Invalid choice. Please try again.");
        await showMainMenu();
        break;
    }
}

async function changePlayerNames()  {
    playerAName = await rl.question("Enter Player A's name: ");
    playerBName = await rl.question("Enter Player B's name: ");
}

async function startGame()  {
    continueGame = true;

    while (continueGame) {
      console.clear();
      showGameBoard(gameBoard);
      const move = await askPlayerAboutMove(gameBoard);
  
    if (move === `menu`)  {
        continueGame = false;
    } else if (move === "reload")  {
        console.log("Starting a new game...");
        resetGame();
        continue;
    } else {
      const row = move[0];
      const column = move[1];
      gameBoard[row][column] = activePlayer;
  
      activePlayer = activePlayer * -1;
      let result = isThereWinner(gameBoard);
      if (result !== 0) {
        continueGame = false;
        console.clear();
        showGameBoard(gameBoard);
            console.log("Player " + 
            (result === playerAValue ? playerAName : playerBName) + 
            " won this round");
            
            }
        }
    }
    if (!continueGame)  {
        await showMainMenu();
        }
    }


function isThereWinner(gameBoard) {
    if (checkRows(gameBoard) === playerAValue)  { return playerAValue; }

    if (checkRows(gameBoard) === playerBValue)  { return playerBValue; }

    if (checkColumns(gameBoard) === playerAValue)  { return playerAValue; }
    
    if (checkColumns(gameBoard) === playerBValue) { return playerBValue; }

    if (checkDiagonals(gameBoard) === playerAValue) { return playerAValue; }

    if (checkDiagonals(gameBoard) === playerBValue) { return playerBValue; }
    
    return 0;
}
  
function checkRows(gameBoard) {
for (let rowPosition = 0; rowPosition < gameBoard.length; rowPosition++) {
    const row = gameBoard[rowPosition];
    let sum = 0;
    for (let columnPosition = 0; columnPosition < gameBoard.length; columnPosition++) {
    sum = sum + row[columnPosition];
    }

    if (sum === 3) {
        return playerAValue;
    } else if (sum === -3) {
        return playerBValue;
        }
    }
    return 0;
}

function checkColumns(gameBoard) {
for (let columnPosition = 0; columnPosition < gameBoard.length; columnPosition++) {
    let sum = 0;
    for (let rowPos = 0; rowPos < gameBoard.length; rowPos++) {
        let row = gameBoard[rowPos];
        sum = sum + row[columnPosition];
    }
    if (sum === 3) {
        return playerAValue;
    } else if (sum === -3) {
        return playerBValue;
        }
    }
    return 0;
}

function checkDiagonals(gameBoard) {
    const diagonalSum1 = gameBoard[0][0] + gameBoard[1][1] + gameBoard[2][2];
    const diagonalSum2 = gameBoard[0][2] + gameBoard[1][1] + gameBoard[2][0];

    if (diagonalSum1 === 3 || diagonalSum2 === 3) {
        return playerAValue;
    } else if (diagonalSum1 === -3 || diagonalSum2 === -3) {
       return playerBValue;
    }
    return 0;
}

async function askPlayerAboutMove(gameBoard)  {
    let move = [];

    do {
        console.log(`\n${activePlayer === playerAValue ? playerAName : playerBName}'s turn: `);
        let playerSelection = await rl.question(`Enter the row and column numbers (Example: "1 1" first row, first column): `);
        playerSelection = playerSelection.trim();

        if (playerSelection.toLowerCase() === `q`)  {
            console.log(`Game quit by ${activePlayer === playerAValue ? playerAName : playerBName}.`);
            process.exit(0);
        } else if (playerSelection.toLowerCase() === `r`)  {
            console.log(`Heading back to the main menu by ${activePlayer === playerAValue ? playerAName : playerBName}'s wishes.`);
            return `menu`;
        } else if (playerSelection.toLowerCase() === `reload`)  {
            return "reload";
        }

        move = playerSelection.split(" ");
        if (move.length !== 2)  {
            move = playerSelection.split(",");
        }
    } while (!isLegalMove(move, gameBoard))

    const row = parseInt(move[0]) -1;
    const column = parseInt(move[1]) -1;
    return [row, column];
}


function isLegalMove(move, gameBoard)  {
    if (move.length !== 2)  {
        return false;
    }

    const row = parseInt(move[0]) - 1;
    const column = parseInt(move[1]) - 1;

    if (row < 0 || row >= gameBoard.length || column < 0 || column >= gameBoard[0].length) {
        return false;
      }

    return gameBoard[row][column] === 0;
}


function showGameBoard(gameBoard) {
    const horizontalLine = "  +---+---+---+";
    console.log("    1   2   3")
    console.log(horizontalLine);
    for (let rowPos = 0; rowPos < gameBoard.length; rowPos++) {
        const row = gameBoard[rowPos];
        let rowDrawing = `${rowPos + 1} |`;
    for (let columnPosition = 0; columnPosition < row.length; columnPosition++) {
        const cellValue = row[columnPosition];
        const cellSymbol = cellValue === playerAValue ? playerASymbol : (cellValue === playerBValue ? playerBSymbol : " ");
        rowDrawing += ` ${cellSymbol} |`;
        }
    console.log(rowDrawing);
    console.log(horizontalLine);
    }
}

function resetGame() {
    gameBoard.forEach(row => row.fill(0));
    continueGame = true;
    activePlayer = playerAValue;
  }
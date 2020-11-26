"use strict";

// Initial variables
let turn = 1;
let xWins = 0;
let oWins = 0;
let turnsmade = 0;
let board = [];
let boardSize = 0;
let inactive = false;
let vsBot = false;

// Initial displays.
let boardDisp = document.getElementById("board");
let activePDisp = document.getElementById("activePlayer");
let turnDisp = document.getElementById("turn");
let xWinsDisp = document.getElementById("xwins");
let oWinsDisp = document.getElementById("owins");
let inputter = document.getElementById("boardSize");

// Stop users from changing board size with keyboard.
inputter.addEventListener("keydown", (event) => {
    event.preventDefault();
});

// Resetting the board.
function resetGame() {
    // Reset variables
    turn = 1;
    turnsmade = 0;
    board = [];
    inactive = false;
    
    // Check if the user is playing against a bot.
    if (document.getElementById("isBot").checked) {
        vsBot = true;
    } else {
        vsBot = false;
    }

    // Grab the requested size.
    boardSize = document.getElementById("boardSize").value;

    // Clear the boards html.
    boardDisp.innerHTML = "";

    // Generate the board array.
    for (let row = 1; row <= boardSize; row++) {
        // Generate each row.
        let genRow = [];
        for (let column = 1; column <= boardSize; column++) {
            genRow[column] = "";
        }
        board[row] = genRow;
    }

    // Add the grid class for proper display.
    boardDisp.classList.add("grid");

    // Change the style so the board displays properly.
    let boardStyleString = "";
    for (let i = 1; i <= boardSize; i++) {
        boardStyleString += "64px";
        if (i < boardSize) {
            boardStyleString += " ";
        }
    }
    boardDisp.style = `grid-template-columns: ${boardStyleString};`;

    // Display the generated board.
    updateBoard();
}

// Re-open config.
function newGame() {
    boardDisp.innerHTML = `
    <h1>Board Setup</h1>
    <p>Size: <input type="number" name="number" id="boardSize" step="1" min="3" max="10" value="3" onclick="this.blur"></p>
    `;

    if (vsBot) {
        boardDisp.innerHTML += `
        <p>Vs. bot? <input type="checkbox" name="" id="isBot" checked></p>`
    } else {
        boardDisp.innerHTML += `
        <p>Vs. bot? <input type="checkbox" name="" id="isBot"></p>`
    }

    boardDisp.innerHTML += `
    <input type="button" value="Start" onclick="resetGame();">`
    boardDisp.classList.remove("grid");
    document.getElementById("winnerdisplay").style.display = "none";
}

// Display the board.
function updateBoard() {
    // Reset the board.
    boardDisp.innerHTML = "";

    // For each column in each row, add a div to the board.
    for (let row = 1; row <= boardSize; row++) {
        for (let column = 1; column <= boardSize; column++) {
            if (board[row][column] == "") {
                boardDisp.innerHTML += `<div class="piece dark" id="${row}, ${column}" onclick="changePiece(${row}, ${column})">${board[row][column]}</div>`;
            } else {
                boardDisp.innerHTML += `<div class="piece" id="${row}, ${column}" onclick="changePiece(${row}, ${column})">${board[row][column]}</div>`;
            }
        }
    }

    // Check the score.
    if (turnsmade >= boardSize) {
        checkScore();
    }
}

// Change tile in array.
function changePiece(x=1, y=1) {
    if (!inactive) {
        // Check the piece, and if its blank, add the new piece.
        if (board[x][y] == "") {
            if (turn == 1) {
                board[x][y] = "O";
                turn = 0;
            } else {
                board[x][y] = "X";
                turn = 1;
            }
            turnsmade ++;
            // Play the placing sound...
            var audio = new Audio('wood.wav');
            audio.play();
        }

        // Run the bot.
        if (vsBot && turn == 0) {
            startArtificialIdiot();
        }

        updateBoard();
        updateNums();
    }
}

// Update all the displays with new data, if it exists.
function updateNums() {
    if (turn == 1) {
        // Who is playing now:
        activePDisp.innerText = `Player: O`;
    } else {
        // Who is playing now:
        activePDisp.innerText = `Player: X`;
    }

    // Win streaks:
    if (xWins == 1) {
        xWinsDisp.innerText = `X - ${xWins} Win`;
    } else {
        xWinsDisp.innerText = `X - ${xWins} Wins`;
    }
    if (oWins == 1) {
        oWinsDisp.innerText = `O - ${oWins} Win`;
    } else {
        oWinsDisp.innerText = `O - ${oWins} Wins`;
    }

    // How many turns.
    turnDisp.innerText = `Turn: ${turnsmade}`;
}

// Check the score.
function checkScore() {
    // FOR PLAYER ONE
    // Check rows (easiest)
    for (let row = 1; row <= boardSize; row++) {
        let counterO = 0;
        let counterX = 0;
        for (let column = 1; column <= boardSize; column++) {
            if (board[row][column] == "O") {
                counterO ++;
            } else if (board[row][column] == "X") {
                counterX ++;
            } else {
                continue;
            }
        }
        if (counterO == boardSize) {
            // Highlight row.
            for (let i = 1; i <= boardSize; i++) {
                document.getElementById(`${row}, ${i}`).classList.add("greenText");
            }
            p1Wins();
            return;
        }
        if (counterX == boardSize) {
            // Highlight row.
            for (let i = 1; i <= boardSize; i++) {
                document.getElementById(`${row}, ${i}`).classList.add("greenText");
            }
            p2Wins();
            return;
        }
    }
    // Check columns.
    for (let column = 1; column <= boardSize; column++) {
        let counterO = 0;
        let counterX = 0;
        for (let row = 1; row <= boardSize; row++) {
            if (board[row][column] == "X") {
                counterX ++;
            } else if (board[row][column] == "O") {
                counterO ++;
            } else {
                continue;
            }
        }
        if (counterO == boardSize) {
            // Highlight row.
            for (let i = 1; i <= boardSize; i++) {
                document.getElementById(`${i}, ${column}`).classList.add("greenText");
            }
            p1Wins();
            return;
        }
        if (counterX == boardSize) {
            for (let i = 1; i <= boardSize; i++) {
                document.getElementById(`${i}, ${column}`).classList.add("greenText");
            }
            p2Wins();
            return;
        }
    }
    // Check across. Left to Right
    let counterO = 0;
    let counterX = 0;
    for (let i = 1; i <= boardSize; i++) {
        if (board[i][i] == "X") {
            counterX ++;
        } else if (board[i][i] == "O") {
            counterO ++;
        } else {
            continue;
        }
        if (counterO == boardSize) {
            // Highlight row.
            for (let i = 1; i <= boardSize; i++) {
                document.getElementById(`${i}, ${i}`).classList.add("greenText");
            }
            p1Wins();
            return;
        }
        if (counterX == boardSize) {
            // Highlight row.
            for (let i = 1; i <= boardSize; i++) {
                document.getElementById(`${i}, ${i}`).classList.add("greenText");
            }
            p2Wins();
            return;
        }
    }
    // Check across. Right to Left
    counterO = 0;
    counterX = 0;
    for (let i = 1; i <= boardSize; i++) {
        if (board[i][(Number(boardSize)+1)-i] == "X") {
            counterX ++;
        } else if (board[i][(Number(boardSize)+1)-i] == "O") {
            counterO ++;
        } else {
            continue;
        }
        if (counterO == boardSize) {
            // Highlight row.
            for (let i = 1; i <= boardSize; i++) {
                document.getElementById(`${i}, ${(Number(boardSize)+1)-i}`).classList.add("greenText");
            }
            p1Wins();
            return;
        }
        if (counterX == boardSize) {
            // Highlight row.
            for (let i = 1; i <= boardSize; i++) {
                document.getElementById(`${i}, ${(Number(boardSize)+1)-i}`).classList.add("greenText");
            }
            p2Wins();
            return;
        }
    }
    // Check if its a stalemate.
    let staleCounter = 0;
    for (let row = 1; row <= boardSize; row++) {
        for (let column = 1; column <= boardSize; column++) {
            if (board[row][column] == "X" || board[row][column] == "O") {
                staleCounter ++;
            }
        }
    }
    if (staleCounter == boardSize**2) {
        stale();
        return;
    }
}

// If the players win:
function p1Wins() {
    document.getElementById("winnertext").innerText = "Player One Wins!";
    document.getElementById("winnerdisplay").style.display = "block";
    oWins ++;
    inactive = true;
    confetti.start();
}

function p2Wins() {
    document.getElementById("winnertext").innerText = "Player Two Wins!";
    document.getElementById("winnerdisplay").style.display = "block";
    xWins ++;
    inactive = true;
    confetti.start();
}

function stale() {
    document.getElementById("winnertext").innerText = "Stalemate.";
    document.getElementById("winnerdisplay").style.display = "block";
    inactive = true;
}









//
//
//
//       -BELOW IS THE CODE FOR THE AI. DONT STEAL IT OR ANYTHING BRO-
//                                    --
//                                   ----
//                           -SERIOUSLY, DON'T.-
//
//
//









// AI
function startArtificialIdiot() {
    let optimalPlay = [];
    let potentialMoves = [];

    // Add every possible move on the board to the potentialMoves array.
    for (let row = 1; row <= boardSize; row++) {
        for (let column = 1; column <= boardSize; column++) {
            potentialMoves.push([row, column]);
        }
    }

    let toDelete = [];

    // Loop through this array and remove every single move that would overwrite an already existing tile.
    for (let i = 0; i < potentialMoves.length; i++) {
        if (board[potentialMoves[i][0]][potentialMoves[i][1]] != "") {
            toDelete.push(potentialMoves[i]);
        }
    }

    // Remove everything.
    for (let i = 0; i < toDelete.length; i++) {
        potentialMoves.splice(potentialMoves.indexOf(toDelete[i]), 1);
        console.log(`Deleting: ${toDelete[i]}`);
    }

    // If there are no available moves, give up...
    if (potentialMoves.length == 0) {
        return;
    }

    console.log(potentialMoves);

    // Loop through and delete any moves that cause an issue using the validity checker.
    for (let i = 0; i < potentialMoves.length; i++) {
        // Generate a new version of the map for testing.
        let newBoard = board.slice();

        // Place a token and see what happens.
        newBoard[potentialMoves[i][0]][potentialMoves[i][1]] = "X";
        let valid = validity(newBoard);
        console.log(valid);
        if (valid == "win") {
            // If the move is a winning move, we place the piece and break.
            optimalPlay[0] = potentialMoves[i][0];
            optimalPlay[1] = potentialMoves[i][1];
            console.log("Optimal MOVE!");
            break;
        } else if (valid == "lose" || valid == "stale") {
            // If we lose or cause a stalemate we get rid of this potential move and try again.
            toDelete.push(potentialMoves[i]);
            continue;
        } else if (valid == "partial") {
            // If the piece is a partial move, meaning nothing happens, we continue...
            toDelete.push(potentialMoves[i]);
            continue;
        } else {
            console.error("Validity check error.");
            continue;
        }
    }

    // Remove everything.
    for (let i = 0; i < toDelete.length; i++) {
        potentialMoves.splice(potentialMoves.indexOf(toDelete[i]), 1);
        console.log(`Deleting during post: ${toDelete[i]}`);
    }

    // Play the optimal move.
    console.log("Optimal play: " + optimalPlay);
    console.log("BOT'S TURN IS OVER");
    changePiece(optimalPlay[0], optimalPlay[1]);
}

// Check the validity of an AI move.
function validity(bd=[]) {
    let boardLength = boardSize;
    // FOR PLAYER ONE
    // Check rows (easiest)
    for (let row = 1; row <= boardLength; row++) {
        let counterO = 0
        let counterX = 0;
        for (let column = 1; column <= boardLength; column++) {
            if (bd[row][column] == "O") {
                counterO ++;
            } else if (bd[row][column] == "X") {
                counterX ++;
            } else {
                continue;
            }
        }
        if (counterO == boardLength) {
            // Highlight row.
            for (let i = 1; i <= boardLength; i++) {
                document.getElementById(`${row}, ${i}`).classList.add("greenText");
            }
            return "lose";
        }
        if (counterX == boardLength) {
            // Highlight row.
            for (let i = 1; i <= boardLength; i++) {
                document.getElementById(`${row}, ${i}`).classList.add("greenText");
            }
            return "win";
        }
    }
    // Check columns.
    for (let column = 1; column <= boardLength; column++) {
        let counterO = 0;
        let counterX = 0;
        for (let row = 1; row <= boardLength; row++) {
            if (bd[row][column] == "X") {
                counterX ++;
            } else if (bd[row][column] == "O") {
                counterO ++;
            } else {
                continue;
            }
        }
        if (counterO == boardLength) {
            // Highlight row.
            for (let i = 1; i <= boardLength; i++) {
                document.getElementById(`${i}, ${column}`).classList.add("greenText");
            }
            return "lose";
        }
        if (counterX == boardLength) {
            for (let i = 1; i <= boardLength; i++) {
                document.getElementById(`${i}, ${column}`).classList.add("greenText");
            }
            return "win";
        }
    }
    // Check across. Left to Right
    let counterO = 0;
    let counterX = 0;
    for (let i = 1; i <= boardLength; i++) {
        if (bd[i][i] == "X") {
            counterX ++;
        } else if (bd[i][i] == "O") {
            counterO ++;
        } else {
            continue;
        }
        if (counterO == boardLength) {
            // Highlight row.
            for (let i = 1; i <= boardLength; i++) {
                document.getElementById(`${i}, ${i}`).classList.add("greenText");
            }
            return "lose";
        }
        if (counterX == boardLength) {
            // Highlight row.
            for (let i = 1; i <= boardLength; i++) {
                document.getElementById(`${i}, ${i}`).classList.add("greenText");
            }
            return "win";
        }
    }
    // Check across. Right to Left
    counterO = 0;
    counterX = 0;
    for (let i = 1; i <= boardLength; i++) {
        if (bd[i][(Number(boardLength)+1)-i] == "X") {
            counterX ++;
        } else if (bd[i][(Number(boardLength)+1)-i] == "O") {
            counterO ++;
        } else {
            continue;
        }
        if (counterO == boardLength) {
            // Highlight row.
            for (let i = 1; i <= boardLength; i++) {
                document.getElementById(`${i}, ${(Number(boardLength)+1)-i}`).classList.add("greenText");
            }
            return "lose";
        }
        if (counterX == boardLength) {
            // Highlight row.
            for (let i = 1; i <= boardLength; i++) {
                document.getElementById(`${i}, ${(Number(boardLength)+1)-i}`).classList.add("greenText");
            }
            return "win";
        }
    }
    // Check if its a stalemate.
    let staleCounter = 0;
    for (let row = 1; row <= boardLength; row++) {
        for (let column = 1; column <= boardLength; column++) {
            if (bd[row][column] == "X" || bd[row][column] == "O") {
                staleCounter ++;
            }
        }
    }
    if (staleCounter == boardLength**2) {
        return "stale";
    }

    return "partial";
}
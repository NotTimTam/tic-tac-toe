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

    // Turn off the bot if the board is bigger than a 3x3.
    if (boardSize > 3) {
        
    }

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
            // Run the bot.
            if (turn == 0 && vsBot) {
                let move = getBestPlayForBot();
                board[move[0]][move[1]] = "X";
                turn = 1;
            } else {
                if (turn == 0) {
                    board[x][y] = "X";
                    turn = 1;
                }
                else if (turn == 1) {
                    board[x][y] = "O";
                    turn = 0;
                }
            }

            turnsmade ++;
            
            // Play the placing sound...
            var audio = new Audio('wood.wav');
            audio.play();
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
function getBestPlayForBot() {
    let potentialMoves = [];
    let optimalMove = [];

    for (let row = 1; row <= boardSize; row++) {
        for (let column = 1; column <= boardSize; column++) {
            potentialMoves.push([row, column]);
        }
    }

    // Loop through and delete any moves that cause an issue using the validity checker.
    for (let i = 0; i < potentialMoves.length; i++) {
        // Generate a new version of the map for testing.
        let newBoard = board.slice();

        console.log(potentialMoves[i]);

        // Place a token and see what happens.
        newBoard[potentialMoves[i][0]][potentialMoves[i][1]] = "X";
        
        if (validity(newBoard) == "win") {
            optimalMove = [potentialMoves[i][0], potentialMoves[i][1]];
            break;
        } else {
            console.log(`I for that one loop: ${i}`);
            continue;
        }
    }

    if (optimalMove == []) {
        optimalMove = potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
        console.log("Im an idiot so Im playing randomly now.")
    }

    return optimalMove;
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
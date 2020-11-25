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

    console.log(`Creating board of size ${boardSize}.`)

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

    console.log(`Generated board:`);
    console.log(board);

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

    // Run the bot.
    if (vsBot && turn == 0) {
        startArtificialIdiot();
    }
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
    console.log("Player one wins!");
    document.getElementById("winnertext").innerText = "Player One Wins!";
    document.getElementById("winnerdisplay").style.display = "block";
    oWins ++;
    inactive = true;
    confetti.start();
}

function p2Wins() {
    console.log("Player two wins!");
    document.getElementById("winnertext").innerText = "Player Two Wins!";
    document.getElementById("winnerdisplay").style.display = "block";
    xWins ++;
    inactive = true;
    confetti.start();
}

function stale() {
    console.log("Stalemate.");
    document.getElementById("winnertext").innerText = "Stalemate.";
    document.getElementById("winnerdisplay").style.display = "block";
    inactive = true;
}

// AI
function startArtificialIdiot() {
    // General analytical skills.
    // First the bot will look for open rows, once it finds one it will check adjacent columns, and diagonals for the best play...
    let optimalPlay = [];
    let safeRows = [];

    // Generate row css.
    for (let row = 1; row <= boardSize; row++) {
        safeRows.push(row);
    }

    console.log(safeRows)

    // Loop through and remove rows that have player one's tile in them, or are full.
    rows: 
    for (let checkedRow = 1; checkedRow <= boardSize; checkedRow++) {
        // Go through each row, and check if all columns are empty.
        let columnsFull = 0;
        for (let column = 1; column <= boardSize; column++) {
            // If a row is occupied, we te add to the columnsFull counter.
            if (board[checkedRow][column] != "") {
                columnsFull ++;
            }
        }

        // If this row is full, then we remove it from the list.
        if (columnsFull == boardSize) {
            console.warn(`AI: Row ${checkedRow} is full. Deleting it from the list.`);
            safeRows.splice(safeRows.indexOf(checkedRow), 1);
        }
    }

    // If we can't find a good play we safely abort with a random play.
    if (safeRows.length == 0) {
        console.warn("AI: Playing randomly because I can't find a good place to play...");
        changePiece(Math.ceil(Math.random()*boardSize), Math.ceil(Math.random()*boardSize));
    }

    // Temporarily randomly play in one of the safe rows.
    let rowPick = safeRows[Math.floor(Math.random() * safeRows.length)];
    console.warn(`AI: Moving to row ${rowPick} from ${safeRows}`);
    changePiece(rowPick, Math.ceil(Math.random()*boardSize));

    console.log(safeRows);
}
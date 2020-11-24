// Initial variables
let turn = 1;
let xWins = 0;
let oWins = 0;
let turnsmade = 0;
let board = [];
let boardSize = 0;
let inactive = false;

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
        <input type="button" value="Start" onclick="resetGame();">`;
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
function changePiece(x=0, y=0) {
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
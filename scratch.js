// TODO, ADD FUNCTIONALITY FOR GAME OVER
const Player = (first, last, piece) => {
    const getFirst = () => first;
    const getLast = () => last;
    const getPiece = () => piece;
    const getFullName = () => `${first} ${last}`

    return { getFirst, getLast, getPiece, getFullName };
}



const Board = (() => {
    let board = new Array(9);

    const setField = (index, piece) => {
        board[index] = piece;
    }

    const getField = (index) => {
        return board[index];
    }

    const getBoard = () => {
        return board
    }

    const resetBoard = () => {
        board = []
    }

    return { setField, getField, getBoard, resetBoard};

})();



const AI = (() => {
    /* Returns random unfilled field */
    const getRandomField = () => {
        let board = Board.getBoard()
        while (true) {
            let random = getRandomNum()
            if (!board[random]) {
                console.log(random)
                return random
            }
        }
    }

    const getRandomNum = () => {
        return Math.floor(Math.random() * 8)
    }

    return {getRandomField}
})()



const gameController = (() => {
    const player = Player("Bill", "Simple", "X")
    const computer = Player("Computer", "AI", "O")
    currentTurn = player.getPiece()
    let turnCount = 0;
    let gameOver = false;
    let wins = [
        /* Horizontal */
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        /* Vertical */
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        /* Diagonal */
        [2, 4, 6],
        [0, 4, 8]
    ]


    const playRound = (field, allFields) => {
        playerTurn(field)
        computerTurn(allFields)
    }

    const playerTurn = (field) => {
        const index = Number(field.target.dataset.index);
        Board.setField(index, currentTurn)
        field.target.textContent = currentTurn
        checkForGameOver(index)
    }

    const computerTurn = (allFields) => {
        if (turnCount < 8) {
            // const index = AI.getRandomField()
            // Board.setField(index, currentTurn)
            // allFields[index].textContent = currentTurn
            // checkForGameOver(index)
            // let winning = winners()
            let winning = wins 
            let board = Board.getBoard()
            
            // seperates all taken positions
            xPos = []
            oPos = []
            board.forEach((i, index) => (i === "X") ? xPos.push(index) : (i === "O") ? oPos.push(index) : {})

            // looks for x postions in wins list
            let possibleWinning = winning.filter(arr => arr.some(num => xPos.includes(num)))

            if (xPos.length === 1) {
                index = AI.getRandomField();
                Board.setField(index, currentTurn)
                allFields[index].textContent = currentTurn
                checkForGameOver(index)
            } else {
                console.log("X ", xPos)
                console.log("O ", oPos)
                console.log("WINNING ", possibleWinning)
                
                let winningXMoves = []
                // for i in possiblewinning array
                for (let i = 0; i < possibleWinning.length; i++) {
                    // start count for how many numbers are in x and winPosib
                    var count = 0;
                    // numbers in each sub array
                    for (let j = 0; j < possibleWinning[i].length; j++) {
                        currentNum = possibleWinning[i][j]
                        // for x in xPos
                        for (let x = 0; x < xPos.length; x++) {
                            if (xPos[x] === currentNum) {
                                count += 1;
                            }

                            // if 2 items in winPos that are in Xpos
                            if (count === 2) {
                                winningXMoves.push(possibleWinning[i])
                            }

                        }
                    }
                }
                // remove duplicates
                winningXMoves = winningXMoves.map(JSON.stringify).filter((e,i,a) => i === a.indexOf(e)).map(JSON.parse)
                // filter Possible winning x postions for o positions
                let filteredX = winningXMoves.filter(i => !i.some(value => oPos.includes(value)))
                // get o postitions that block x
                const oOptions = filteredX.flat().filter( x => !xPos.includes(x))
                
                console.log(oOptions)

                // if no blocking move can be found choose random field
                if (oOptions.length === 0) {
                    index = AI.getRandomField()
                } else {
                    index = oOptions[0]
                }

                // place piece
                Board.setField(index, currentTurn)
                allFields[index].textContent = currentTurn
                checkForGameOver(index)

            }


        }
    }
    
    const checkForGameOver = (index) => {
        if (winningMove(index)) {
            gameOver = true
            displayController.displayMessage(`${currentTurn} wins!`)
            displayController.showReset()
        } 

        turnCount += 1;

        if (turnCount === 9) {
            gameOver = true
            displayController.displayMessage("Cat's Game!")
            displayController.showReset()
        }

        currentTurn = currentTurn === player.getPiece() ? computer.getPiece() : player.getPiece();

        return; 
    }

    const resetGame = () => {
        currentTurn = player.getPiece();
        turnCount = 0;
        gameOver = false;
    }

    const getGameOver = () => {
        return gameOver
    }

    const winningMove = (index) => {
        // const winners = [
        //     /* Horizontal */
        //     [0, 1, 2],
        //     [3, 4, 5],
        //     [6, 7, 8],
        //     /* Vertical */
        //     [0, 3, 6],
        //     [1, 4, 7],
        //     [2, 5, 8],
        //     /* Diagonal */
        //     [2, 4, 6],
        //     [0, 4, 8]
        // ]

        //winners
        // Long way in scratch.js
        return wins.filter(row => row.includes(index))
            .some(item => item.every(
                (piece) => Board.getField(piece) === currentTurn
            ))
    }
    // added winners temp function
    return { playRound, getGameOver, winningMove, resetGame}
})();



const displayController = (() => {
    // buttons
    const login = document.getElementById("login")
    const submit = document.querySelector("#submit")
    const resetBtn = document.querySelector("#reset")

    const nav = document.querySelector("nav")
    const form = document.querySelector(".form-container")
    const box = document.querySelectorAll(".box");
    let messageElem = document.querySelector(".message-container")


    box.forEach(item => item.addEventListener("click", (e) => {
        if (e.target.textContent === "" && !gameController.getGameOver()) {
            gameController.playRound(e, box)
        }
    }));

    resetBtn.onclick = () => resetBoard();

    submit.onclick = (e) => getPlayer(e);

    const displayMessage = (message) => {
        let text = messageElem.querySelector("#message")
        text.textContent = message
        messageElem.style.visibility = "visible"
        hideDisplayMessage()
    }

    const hideDisplayMessage = () => {
        return setTimeout(() => {
            messageElem.style.visibility = "hidden"
        }, 1500)
    }

    const showReset = () => {
        resetBtn.style.visibility = "visible";
    }


    const resetBoard = () => {
        Board.resetBoard()
        box.forEach(i => i.textContent = "")
        gameController.resetGame()
        resetBtn.style.visibility = "hidden"
    }
    
    const setBox = (index, piece) => {
        return box[index].textContent = piece
    }

    return { displayMessage, showReset, setBox}

})();



    /* POP UP FORM */
    // let playerNumber = 0;
    // let player1;
    // let player2;

    // login.onclick = () => showForm();

    // const getPlayer = (e) => {
    //     e.preventDefault()
    //     const first = document.querySelector("#firstName").value;
    //     const last = document.querySelector("#lastName").value; 
    //     const piece = document.querySelector("#piece").value;

    //     (playerNumber === 0) ? player1 = Player(first, last, piece) : player2 = Player(first, last, piece);
    //     console.log(player1.getFullName())
    // }

    // const showForm = () => {
    //     form.style.visibility = "visible";
    //     nav.style.position = "static"
    // }

    // const hidForm = () => {
    //     form.style.visibility = "hidden"
    //     nav.style.position = "fixed"
    // }




    // const computerTurn = (allFields) => {
    //     if (turnCount < 8) {
    //         // const index = AI.getRandomField()
    //         // Board.setField(index, currentTurn)
    //         // allFields[index].textContent = currentTurn
    //         // checkForGameOver(index)
    //         // let winning = winners()
    //         let winning = wins 
    //         let index;
    //         let board = Board.getBoard()
            
    //         // seperates all taken positions
    //         xPos = []
    //         oPos = []
    //         board.forEach((i, index) => (i === "X") ? xPos.push(index) : (i === "O") ? oPos.push(index) : {})

    //         // looks for x postions in wins list
    //         let possibleWinning = winning.filter(arr => arr.some(num => xPos.includes(num)))
    //         // checks to see if x is 1 turn away from win
    //         const winPositions = possibleWinning.filter(i => xPos.every(value => i.includes(value)))
    //         if (winPositions.length === 0) {
    //             index = AI.getRandomField()
    //         } else {
    //             oTurn = []
    //             for (let i = 0; i < winPositions.length; i++) {
    //                 oTurn.push(winPositions[i].filter(item => xPos.indexOf(item) == -1))
    //             }
    //             // gets position that x will win with
    //             index = (oTurn.length > 1) ? oTurn[Math.floor(Math.random(oTurn.length))][0] : oTurn[0][0]
    //             removeWinner(winPositions[0])
    //         }
    //         Board.setField(index, currentTurn)
    //         allFields[index].textContent = currentTurn
    //         checkForGameOver(index)

    //     }
    // }
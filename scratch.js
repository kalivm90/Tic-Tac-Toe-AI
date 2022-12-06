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


const gameController = (() => {
    let player = Player("Anonymous", "Boi", "X")
    const computer = Player("Computer", "AI", "O")
    let winCount = totalCount = loseCount = 0;
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
        _playerTurn(field)
        _computerTurn(allFields)
    }

    const _playerTurn = (field) => {
        const index = Number(field.target.dataset.index);
        Board.setField(index, currentTurn)
        field.target.textContent = currentTurn
        _checkForGameOver(index)
    }

    const _computerTurn = (allFields) => {
        if (turnCount < 8) {
            let winning = wins 
            let board = Board.getBoard()
            
            // sort all filled fields
            xPos = []
            oPos = []
            board.forEach((i, index) => (i === "X") ? xPos.push(index) : (i === "O") ? oPos.push(index) : {})

            // looks for x postions in possible wins array
            let possibleWinning = winning.filter(arr => arr.some(num => xPos.includes(num)))

            if (xPos.length === 1) {
                index = _getRandomField()
            } else {                
                let winningXMoves = []
                // looks in possibleWinning to see if X is 1 move away from winning
                for (let i = 0; i < possibleWinning.length; i++) {
                    // count that checks for 2 position X has that exist in winning positions
                    var count = 0;
                    // looping through each value in possible winning
                    for (let j = 0; j < possibleWinning[i].length; j++) {
                        currentNum = possibleWinning[i][j]
                        // looping through x's position array
                        for (let x = 0; x < xPos.length; x++) {
                            if (xPos[x] === currentNum) {
                                count += 1;
                            }

                            // if 2 items in winPos that are in Xpos append to array
                            if (count === 2) {
                                winningXMoves.push(possibleWinning[i])
                            }

                        }
                    }
                }
                // remove duplicates that are created by loops
                winningXMoves = winningXMoves.map(JSON.stringify).filter((e,i,a) => i === a.indexOf(e)).map(JSON.parse)
                // filter Possible winning X postions for O positions
                let filteredX = winningXMoves.filter(i => !i.some(value => oPos.includes(value)))
                // get valid O postitions that block x
                const oOptions = filteredX.flat().filter( x => !xPos.includes(x))
                
                // if no blocking move can be found choose random field
                if (oOptions.length === 0) {
                    index = _getRandomField()
                } else {
                    index = oOptions[0]
                }

            }
            // place piece
            Board.setField(index, currentTurn)
            allFields[index].textContent = currentTurn
            _checkForGameOver(index)
        }
    }

    const _checkForGameOver = (index) => {
        if (turnCount === 8) {
            gameOver = true
            totalCount += 1
            displayController.displayMessage("Cat's Game!")
            displayController.showReset()
        }

        if (_winningMove(index)) {
            gameOver = true
            displayController.displayMessage(`${currentTurn} wins!`);

            if (currentTurn === player.getPiece()) {
                if (turnCount === 8) {
                    winCount += 1
                } else {
                    winCount += 1;
                    totalCount += 1;
                }   
            } else {
                if (turnCount === 8) {
                    loseCount += 1
                } else {
                    loseCount += 1;
                    totalCount += 1;
                }
            }

            displayController.showReset()
        } 

        turnCount += 1;

        currentTurn = currentTurn === player.getPiece() ? computer.getPiece() : player.getPiece();
        displayController.updateScoreboard(totalCount, winCount, loseCount)

        return; 
    }

    const _getRandomField = () => {
        let board = Board.getBoard()
        while (true) {
            let random = Math.floor(Math.random() * 8)
            if (!board[random]) {
                return random
            }
        }
    }

    const resetGame = () => {
        currentTurn = player.getPiece();
        turnCount = 0;
        gameOver = false;
    }

    const getGameOver = () => {
        return gameOver
    }

    const _winningMove = (index) => {
        return wins.filter(row => row.includes(index))
            .some(item => item.every(
                (piece) => Board.getField(piece) === currentTurn
            ))
    }
    
    const _updatePlayer = (playerInfo) => {
        player = playerInfo
        console.log(player.getFullName())
    }


    return { playRound, getGameOver, resetGame, _updatePlayer}
})();



const displayController = (() => {
    // buttons
    const login = document.getElementById("login")
    const submit = document.querySelector("#submit")
    const resetBtn = document.querySelector("#reset")

    // const nav = document.querySelector("nav")
    const name = document.querySelector("#name-title")
    const mainContent = document.querySelector("main")
    const form = document.querySelector(".form-container")
    const box = document.querySelectorAll(".box");
    let messageElem = document.querySelector(".message-container")


    box.forEach(item => item.addEventListener("click", (e) => {
        if (e.target.textContent === "" && !gameController.getGameOver()) {
            gameController.playRound(e, box)
        }
    }));

    resetBtn.onclick = () => _resetBoard();
    submit.onclick = (e) => getPlayer(e);
    login.onclick = () => _showForm();

    const displayMessage = (message) => {
        let text = messageElem.querySelector("#message")
        text.textContent = message
        messageElem.style.visibility = "visible"
        _hideDisplayMessage()
    }

    const _hideDisplayMessage = () => {
        return setTimeout(() => {
            messageElem.style.visibility = "hidden"
        }, 1500)
    }

    const showReset = () => {
        resetBtn.style.visibility = "visible";
    }


    const _resetBoard = () => {
        Board.resetBoard()
        box.forEach(i => i.textContent = "")
        gameController.resetGame()
        resetBtn.style.visibility = "hidden"
    }
    
    const setBox = (index, piece) => {
        return box[index].textContent = piece
    }

    const getPlayer = (e) => {
        e.preventDefault()
        const first = document.querySelector("#firstName").value;
        const last = document.querySelector("#lastName").value; 
        const piece = document.querySelector("#piece").value;

        const player = Player(first, last, piece)
        gameController._updatePlayer(player)
        _updateName(player.getFirst())
        _hideForm()
    }

    const _updateName = (nameInfo) => {
        name.textContent = `Hello, ${nameInfo}`
    }

    const _showForm = () => {
        mainContent.style.visibility = "hidden"
        mainContent.style.display = "none"
        form.style.visibility = "visible";
        form.style.display = "flex"

    }

    const _hideForm = () => {
        document.querySelector("#info").remove()
        form.style.visibility = "hidden"
        form.style.display = "none"
        mainContent.style.visibility = "visible"
        mainContent.style.display = "flex"
    }

    const updateScoreboard = (totalCount, winCount, loseCount) => {
        const total = document.querySelector("#total");
        const wins = document.querySelector("#wins");
        const loses = document.querySelector("#loses");

        total.textContent = totalCount
        wins.textContent = winCount
        loses.textContent = loseCount
    }

    return { displayMessage, showReset, setBox, updateScoreboard}

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

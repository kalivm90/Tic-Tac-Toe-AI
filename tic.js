// TODO, ADD FUNCTIONALITY FOR GAME OVER
const Player = (first, last, piece) => {
    const getFirst = () => first;
    const getLast = () => last;
    const getPiece = () => piece;
    const getFullName = () => `${first} ${last}`

    return { getFirst, getLast, getPiece, getFullName };
}

const Board = (() => {
    let board = [];

    const setField = (index, piece) => {
        board[index] = piece;
    }

    const getField = (index) => {
        return board[index];
    }

    const print = () => {
        console.log(board);
    }

    return { setField, getField, print };

})();

const gameController = (() => {
    const player1 = Player("Bill", "Simple", "X")
    const player2 = Player("Shirley", "Temple", "O")
    currentTurn = player1.getPiece()
    let turnCount = 0;
    let gameOver = false;

    const playRound = (field) => {
        const index = Number(field.target.dataset.index);
        Board.setField(index, currentTurn)
        field.target.textContent = currentTurn
        console.log(currentTurn)

        if (winningMove(index)) {
            gameOver = true
            displayController.displayMessage(`${currentTurn} wins!`)
            displayController.reset()
        } else if (turnCount === 9) {
            gameOver = true
            displayController.displayMessage("Cat's Game!")
            displayController.reset()
        }

        currentTurn = (currentTurn === player1.getPiece()) ? player2.getPiece() : player1.getPiece();
        turnCount += 1;
    }

    const getGameOver = () => {
        return gameOver
    }

    const winningMove = (index) => {
        const winners = [
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

        // Long way in scratch.js
        return winners.filter(row => row.includes(index))
            .some(item => item.every(
                (piece) => Board.getField(piece) === currentTurn
            ))
    }

    return { playRound, getGameOver, winningMove }
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
        if (e.target.textContent === "" && !gameController.getGameOver()) gameController.playRound(e)
    }));

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

    const reset = () => {
        resetBtn.style.visibility = "visible";
    }
    
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

    return { displayMessage, reset}

})();



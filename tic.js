var Board = (newBoard) => {
    let board = new Array(newBoard);
    // this runs everytime an instance is instantiated
    const setBoard = () => {
        let main = new Array();
        for (let i = 0; i < newBoard.length; i+=3) {
            let temp = new Array()
            temp.push(newBoard[i], newBoard[i+1], newBoard[i+2])
            main.push(temp)
        }
        return main;
    }

    const updateBoard = (xCord, yCord, piece) => {
        board[xCord][yCord] = piece
    }

    // defining setBoard right here because of initialization issues
    // NOT SURE IF IM USING THIS OR NOT
    // let board = setBoard(newBoard)

    return {board, updateBoard, setBoard}
}

const Player = (firstName, lastName, piece) => {
    const getPiece = () => piece;
    const getName = () => `${firstName} ${lastName}`;

    return {getPiece, getName}
};


const Game = (person, array) => {
    let gameBoard = Board(array);
    let player = person;
    let turn = player.getPiece()
    let currentEvent;

    const start = () => {
        for (let i = 0; i < gameBoard.board.length; i++) {
            let current = gameBoard.board[i]
            current.forEach(item => item.onclick = event => getEvent(event))
        }
    }

    const getEvent = (event) => {
        currentEvent = event
    };

    return {start}
}

const Render = (() => {
    const submit = document.querySelector("#submit");
    const navbar = document.querySelector("nav")
    const login = document.querySelector("#login")
    const header = document.querySelector("header")
    var intro = document.querySelector(".intro p")
    const scoreboard = document.querySelector(".scoreboard");
    const board = document.querySelector(".gameBoard");
    var box = board.querySelectorAll(".box")

    let sticky = navbar.offsetTop;
    let player;
    let game;

    const run = () => {
        window.onscroll = () => stickyNav();
        login.onclick = () => showHeader()
        submit.onclick = e => getPlayer(e);
    };

    const getPlayer = (e) => {
        e.preventDefault();
        // form selectors
        const firstName = document.querySelector("#firstName").value;
        const lastName = document.querySelector("#lastName").value;
        const letter = document.querySelector("#letter").value;

        /* you also need to show scoreboard and board in here as well, make new function and show and hide all of it there */
        showBoard(firstName)
        hideHeader()

        player = Player(firstName, lastName, letter)
        game = Game(player, box)
        game.start()
        sticky = 0
    };

    const showBoard = (firstName) => {
        intro.innerHTML = `<span id="welcome">Welcome,</span> ${firstName}`;
        board.style.visibility = "visible"
        board.style.display = "grid"
    }

    const hideHeader = () => {
        header.style.visibility = "hidden";
        header.style.display = "none";
    }

    const showHeader = () => {
        header.style.visibility = "visible";
        header.style.display = "flex";
        sticky += header.offsetHeight
        navbar.classList.remove("sticky")
    }
    // navbar functionality
    const stickyNav = () => {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky")
        } else {
            navbar.classList.remove("sticky")
        }
    }

    return {run}

})();

Render.run()



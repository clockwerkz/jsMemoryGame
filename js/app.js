/*
 * Udacity's Front End Developer Course
 * Project 2: The Javascript Memory Game
 * by Carlos Fins
 */

/* Timer Object */
const timer = (function() {
    const timerDisplays = [...document.querySelectorAll(".timer")];
    let clock = 0;
    let clockRunning=null;
    let isClockRunning = false;

    function updateDisplays() {
        for (let timerDisplay of timerDisplays) {
            timerDisplay.innerHTML = clock;
        }
    }

    function startClock() {
        if (!isClockRunning) {
            resetClock();
            isClockRunning = true;
            clockRunning = setInterval(()=>{
                clock++;
                updateDisplays();
            }, 1000);
        }
    }

    function stopClock() {
        if (clockRunning) clearInterval(clockRunning);
        isClockRunning = false;
        clockRunning = null;
    }

    function resetClock() {
        clock = 0;
        updateDisplays();
    }

    return {
        resetClock : resetClock,
        startClock : startClock,
        stopClock : stopClock,
        isClockRunning : isClockRunning
    }
})();


/* Game Object */
const game = (function() {
    const cardList = ["diamond", "paper-plane-o","anchor", "bolt", "cube", "bomb","leaf","bicycle","diamond", "paper-plane-o","anchor", "bolt", "cube", "bomb","leaf","bicycle",];
    const gameBoard = document.querySelector(".deck");
    const gameOverModal = document.getElementById('game-over-modal');
    const moves = document.getElementById("moves");
    const stars = [...document.querySelectorAll("i.fa.fa-star")];

    let moveCounter, piecesMatched, canSelectAgain, firstSelection;


    // Clears and re-populates the gameboard cards
    function createGameBoard() {
        gameBoard.innerHTML = "";
        for (let i=0; i<cardList.length; i++) {
            let cardHolder = document.createElement("li");
            let card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute('data-value', i);  
            let cardFront = document.createElement("div");
            cardFront.classList.add("card-front");
            let cardBack = document.createElement("div");
            cardBack.classList.add("card-back");
            let cardIcon = document.createElement("i");
            cardIcon.classList.add("fa");
            cardBack.appendChild(cardIcon);
            cardFront.appendChild(cardBack);
            card.appendChild(cardFront);
            cardHolder.appendChild(card);
            gameBoard.appendChild(cardHolder);
        }
    }

    /* MAIN GAME LOOP FUNCTION */
    function setClickEvent(e) {
        let card = e.target;
        /* This is the main game "loop" - Check for the following three criteria:
         * 1- That the event target (saved as a variable "card") is an actual card,
         * 2- That the game is not currently in a time penalty for not correctly selection (canSelectAgain),
         * 3- And that the card target has not already been previously matched.
        */
        if (card.classList.contains("card") && (canSelectAgain) && (!card.classList.contains("match"))) {
            //Update moveCounter both counter and on the gameboard, and check to see if we need to decrement
            //A star at the moment.
            moveCounter++;
            updateMoveCounter();
            checkStarRating();
            if (!timer.isClockRunning) timer.startClock();
            /* Capture the data-value from the selected card to obtain the matching icon symbol from the array.
             * Instead of actually having the font awesome symbols on the i tags of the cards, I'm shuffling
            /* the array and using the data-value attribute on each card as an index to access the shuffled array.
            */
            let cardIcon = cardList[parseInt(card.dataset.value)];
            //Reveal selected card
            revealCard(card, cardIcon);
            //If a card has already been selected, then compare the current selection with the firstSelection card.
            if (firstSelection) {
                compareCurrent(card, cardIcon);
            } else {
             //if no other cards are currently queued as a selection, make this card the firstSelection card
              firstSelection = card;
            }
        }
        //If the piecesMatched equals the length of the cardList array, all cards have been revealed (game over)
        if (cardList.length <= piecesMatched) {
           gameOver();
        }
    }

    function shuffle(arr) {
        for (let i=0; i<arr.length; i++){
          let randomIndex = (Math.floor(Math.random() * arr.length));
            [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
        }
    }

    function gameOver() {
         timer.stopClock();
         let finalStarRating = gameOverModal.querySelector('ul.stars');
         for (let star of stars) {
             let newStar = document.createElement('i');
             newStar.classList = star.classList;
             finalStarRating.appendChild(newStar);
         }
         gameOverModal.classList.add('reveal');
    }

    // Starts the Game and resets all the game variables
    function startGame() {
        timer.stopClock();
        timer.resetClock();
        resetStars();
        piecesMatched = 0;
        canSelectAgain = true;
        firstSelection = null;
        moveCounter = 0;
        updateMoveCounter();
        shuffle(cardList);
        createGameBoard();
    }

    function resetStars () {
        for (let star of stars) {
            star.classList.add("on");
        }
    }
    
    
    function checkStarRating() {
        if (moveCounter > 25) stars[2].classList.remove("on");
        if (moveCounter > 40) stars[1].classList.remove("on");
    }
    
    
    function updateMoveCounter() {
        moves.innerHTML = moveCounter;
    }
    
    
    function revealCard(card, cardIcon) {
        card.classList.add("open","show", "disable");
        card.querySelector("i").classList.add(`fa-${cardIcon}`);
    }
    
    function hideCard(card, cardIcon) {
        card.classList.remove("open","show", "disable");
        card.querySelector("i").classList.remove(`fa-${cardIcon}`);
    }
    
    
    function compareCurrent(card, cardIcon) {
        let firstSelectionIcon = cardList[parseInt(firstSelection.dataset.value)];
        if ((cardIcon === firstSelectionIcon) && (card !== firstSelection)) {
            firstSelection.classList.add("match");
            card.classList.add("match");
            piecesMatched+= 2;
            firstSelection = null;
        } else {
            canSelectAgain = false;
            setTimeout(()=> {
                hideCard(firstSelection, firstSelectionIcon);
                hideCard(card, cardIcon);
                firstSelection = null;
                canSelectAgain = true;
            }, 1000);
        }
    }

    function clearModal() {
        gameOverModal.querySelector('ul.stars').innerHTML = '';
        gameOverModal.classList.remove('reveal');
    }


    return {
        gameBoard : gameBoard,
        startGame : startGame,
        clearModal : clearModal,
        setClickEvent : setClickEvent
    }
})();

game.startGame();


/* Click/Touch Events for the gameboard cards */
game.gameBoard.addEventListener("click", game.setClickEvent);
// game.gameBoard.addEventListener("touchstart", game.setClickEvent);

/* Click Event for the Yes button on the game over modal */
document.getElementById("playAgain").addEventListener("click", (e)=>{
    e.preventDefault;
    game.clearModal();
    game.startGame();
});

document.querySelector(".restart").addEventListener("click", (e)=> {
    game.startGame();
});
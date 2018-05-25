/*
 * Udacity's Front End Developer Course
 * Project 2: The Javascript Memory Game
 * by Carlos Fins
 */
const cardList = ["diamond", "paper-plane-o","anchor", "bolt", "cube", "bomb","leaf","bicycle","diamond", "paper-plane-o","anchor", "bolt", "cube", "bomb","leaf","bicycle",];
const gameBoard = document.querySelector(".deck");
const gameOverModal = document.getElementById('game-over-modal');
const moves = document.getElementById("moves");
const stars = [...document.querySelectorAll("i.fa.fa-star")];

let moveCounter, piecesMatched, canSelectAgain, firstSelection;



/* Timer Object */
const timer = (function() {
    const timerDisplays = [...document.querySelectorAll(".timer")];
    let clock = 0;
    let clockRunning=null;

    function restart() {
        clock = 0;
        updateDisplays();

    }

    function updateDisplays() {
        for (let timerDisplay of timerDisplays) {
            timerDisplay.innerHTML = clock;
        }
    }

    function startClock() {
        console.log("starting clock again");
        if (!clockRunning) {
            console.log("running clock");
            resetClock();
            clockRunning = setInterval(()=>{
                clock++;
                updateDisplays();
            }, 1000);
        }
    }

    function stopClock() {
        if (clockRunning) clearInterval(clockRunning);
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
    }
})();


startGame();

/*
 * Starts the Game and resets all the game variables
*/
function startGame() {
    timer.stopClock();
    timer.resetClock();
    resetStars();
    piecesMatched = 0;
    canSelectAgain = true;
    firstSelection = null;
    moveCounter = 0;
    updateMoveCounter();
    countdown = null;
    shuffle(cardList);
    createGameBoard();
}


function shuffle(arr) {
    for (let i=0; i<arr.length; i++){
      let randomIndex = (Math.floor(Math.random() * arr.length));
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
}

function createGameBoard() {
    gameBoard.innerHTML = "";
    for (let i=0; i<cardList.length; i++) {
        let cardHolder = document.createElement("li");
        let card = document.createElement("div");
        card.classList.add("card");
        card.setAttribute('data-value', i);
        // I'm creating each individual card in this code. I think just having the structure inside of a string 
        // is a bit more readable than having all these element declarations and then adding the classes and appending
        // the children.
        // let cardIcon = document.createElement("i");
        // card.innerHTML = `<div class="card-front"></div>
        //                     <div class="card-back">
        //                         <i class="fa"></i>
        //                     </div>`;     
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
    gameBoard.addEventListener("click", setClickEvent);
}

document.getElementById("playAgain").addEventListener("click", (e)=>{
    e.preventDefault;
    gameOverModal.classList.remove('reveal');
    startGame();
});

document.querySelector(".restart").addEventListener("click", (e)=> {
    startGame();
});



/*
 * Event Listener Function logic:
 * 
 * Capture the element that was clicked on the board.
 * 
 * Then, test for 3 things:
 *  - If the element selected was a card (has class .card),
 *  - If it is possible to select a new card and not on a wrong answer cooldown (canSelectAgain)
 *  - And last, if the card selected hasn't already been matched (has class .match)
 * If the game clock hasn't started, start it. (Not thrilled with the idea that it's testing to check the clock for every move)
 * 
 * Increment the move counter and update display
 * 
 * Update the star ranking based on the move counter value
 * 
 * Capture the data-value of the card selected to match to the array of card values.
 * 
 * Show the card selected
 * 
 * If this is the first selection the player makes, save the card in firstSelection.
 * Otherwise, compare the current card selected with the firstSelection.
 * 
 * Finally, check to make sure the number of piecesMatched is still less than the cardList length.
 * If equals, then all pairs have been matched and it's game over.
*/
function setClickEvent(e) {
    let card = e.target;
    console.log(card);
    if (card.classList.contains("card") && (canSelectAgain) && (!card.classList.contains("match"))) {
        moveCounter++;
        updateMoveCounter();
        checkStarRating();
        timer.startClock();
        let cardIcon = cardList[parseInt(card.dataset.value)];
        revealCard(card, cardIcon);
        if (firstSelection) {
            compareCurrent(card, cardIcon);
        } else {
          firstSelection = card;
        }
    }
    if (cardList.length <= piecesMatched) {
        /*  Game Over functionality - could be moved to it's own function */
        timer.stopClock();
        let finalStarRating = gameOverModal.querySelector('ul.stars');
        for (star of stars) {
            finalStarRating.appendChild(star);
        }
        gameOverModal.classList.add('reveal');

    }
}

function resetStars () {
    for (star of stars) {
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
    card.classList.add("open","show");
    card.querySelector("i").classList.add(`fa-${cardIcon}`);
}

function hideCard(card, cardIcon) {
    card.classList.remove("open","show");
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



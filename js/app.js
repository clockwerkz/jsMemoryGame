/*
 * Create a list that holds all of your cards
 */
const cardList = ["diamond", "paper-plane-o","anchor", "bolt", "cube", "bomb","leaf","bicycle","diamond", "paper-plane-o","anchor", "bolt", "cube", "bomb","leaf","bicycle",];
const gameBoard = document.querySelector(".deck");
const timer = document.getElementById("timer");
let countdown;
let canSelectAgain = true;
let piecesMatched = 0;
let firstSelection = null;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

shuffle(cardList);
createGameBoard();

function startCountDown() {
    countdown = setInterval(()=>{
        timer.innerHTML = parseInt(timer.innerHTML)+1;
    }, 1000);
}

function stopCountDown() {
    clearInterval(countdown);
}

function shuffle(arr) {
    for (let i=0; i<arr.length; i++){
      let randomIndex = (Math.floor(Math.random() * arr.length));
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
}

function createGameBoard() {
    timer.innerHTML="0";
    gameBoard.innerHTML = "";
    for (let i=0; i<cardList.length; i++) {
        let cardIcon = document.createElement("i");
        cardIcon.classList.add("fa");
        let card = document.createElement("li");
        card.classList.add("card");
        card.setAttribute('data-value', i);
        card.appendChild(cardIcon);
        gameBoard.appendChild(card);
    }
    gameBoard.addEventListener("click", setGameEvents);
}


function setGameEvents(e) {
    let card = e.target;
    if (card.classList.contains("card") && (canSelectAgain) && (!card.classList.contains("match"))) {
        if (!countdown) startCountDown();
        let cardIcon = cardList[parseInt(card.dataset.value)];
        revealCard(card, cardIcon);
        if (firstSelection) {
            compareCurrent(card, cardIcon);
        } else {
          firstSelection = card;
        }
    }
    if (cardList.length <= piecesMatched) {
        stopCountDown();
        console.log("Game is Over");
        setTimeout(createGameBoard, 3000);
    }
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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


/*
 * Udacity's Front End Developer Course
 * Project 2: The Javascript Memory Game
 * by Carlos Fins
 */
const cardList = ["diamond", "paper-plane-o","anchor", "bolt", "cube", "bomb","leaf","bicycle","diamond", "paper-plane-o","anchor", "bolt", "cube", "bomb","leaf","bicycle",];
const gameBoard = document.querySelector(".deck");
const timer = document.getElementById("timer");
let countdown;
let canSelectAgain = true;
let piecesMatched = 0;
let firstSelection = null;


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
    gameBoard.addEventListener("click", setClickEvent);
}

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


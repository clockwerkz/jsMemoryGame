# Udacity's Memory Game Project

* [Live Project](https://clockwerkz.github.io/jsMemoryGame/)


## How To Play

This is the classic Memory Game. A player starts with all cards faced down. Each turn, the player selects two cards. If they match, they remain face up. If they don't, they are turned back over. After all cards are matched, the game is over. The star Scoring is evaluated based on the number of "moves" used in the game. The lesser amount of moves, the better the star rating. Good luck!

## Game Design

Early on, I noticed that if I used Google Chrome tools, I could "see" all of the card icons by inspecting them. In order to get around this, my cards do not have their font awesome icons labeled in the cards at the start. Instead, I've assigned data-values of numbers from 0-15, and I use those data-values to index the array of card icons. So every time a player clicks on a card and reveals it, I'm applying the icon class to the i tag using the array value at that card's data-value index. If they match, play continues and the cards remain revealed. However, if they do not match, my code "removes" the icon from the i tag when flipping them back over.

## TODO

- [x] Write a function that will create the game board
- [X] Implement a timer that starts when the first card is clicked
- [X] Implement a Move Counter
- [X] Have the cards "flip" when clicked using css animations
- [X] Implement the reset button 
- [ ] Make the board responsive
- [ ] Style the Game Over Modal
- [X] Implement the scoring system; A star rating that is based on player performance (basic rating system)
- [X] Create a "Game Over" modal that shows the Final Score and a "Start a New Game"
- [X] Write a function that will reset the board and game variables to start a new game
- [ ] Refactor Javascript code to the modular pattern


## Wistlist
- Refactor JS code and model after MVC pattern
- Give the board a new styling - Better title display
- Have a complete game system, with a Start Game Button and an instructions modal
- Create keyboard inputs for the game: I had an idea about using WASD to move a "Cursor" between the various cards on the board, and use the spacebar to reveal the currently selected card.
- LEADERBOARD! I would love to have a leaderboard in the game. The project description mentions using local storage, but I would love to create an API that can keep track of player scores. So at the end of the game, a player who is, say, top 10, can enter their name in a form box and be added to the High School Leaderboard.


const gameContainer = document.getElementById("game-card-display");
const startGameBtn = document.getElementById("start-game");
const instructionsDisplay = document.getElementById("instructions");
const scoreDisplay = document.getElementById("score");
const gameRestartBtn = document.getElementById("game-restart-button");

let currentScore = 0;
let lowestScore = JSON.parse(localStorage.getItem("lowestScore")) || null;
let clickingDisabled = false;
let card1 = null;
let card2 = null;
let cardsFlipped = 0;

const COLORS = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "red",
    "blue",
    "green",
    "orange",
    "purple"
];

function updateScore() {
    const displayLowestScore = lowestScore === null ? "--" : lowestScore;
    scoreDisplay.innerText = `Lowest Score: ${displayLowestScore} | Current Score: ${currentScore}`;
}

function updateLowestScore() {
    if (lowestScore === null || currentScore < lowestScore) {
        lowestScore = currentScore;
        localStorage.setItem("lowestScore", lowestScore);
    }
}

function finishGame() {
    updateLowestScore();

    if (lowestScore === null || currentScore < lowestScore) {
        instructionsDisplay.innerText = `New record! You won in ${currentScore} turns!`;
    } else {
        instructionsDisplay.innerText = `You won in ${currentScore} turns!`;
    }

    updateScore();
}


function restartGame() {
    gameContainer.innerHTML = "";
    clickingDisabled = false;
    instructionsDisplay.innerText = "";
    card1 = null;
    card2 = null;
    cardsFlipped = 0;
    document.getElementById("game-restart-container").classList.add("hidden");
    startGameBtn.classList.remove("hidden");
    currentScore = 0;
    updateScore();
}

function startGame() {
    startGameBtn.classList.add("hidden");
    document.getElementById("game-restart-container").classList.remove("hidden");
    createDivsForColors(COLORS);
    instructionsDisplay.innerText = "Match the color pairs!";
    scoreDisplay.classList.remove("hidden");
    currentScore = 0;
    updateScore();
}

function shuffle(array) {
    let counter = array.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function createDivsForColors(colorArray) {
    let shuffledColors = shuffle(colorArray);
    for (let color of shuffledColors) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("game-card");
        newDiv.classList.add(color);
        gameContainer.append(newDiv);
    }
    gameContainer.addEventListener("click", handleCardClick);
}

function handleCardClick(event) {
    if (clickingDisabled || !event.target.classList.contains("game-card") || event.target.classList.contains("flipped")) {
        return;
    }

    let currentCard = event.target;
    currentCard.style.backgroundColor = currentCard.classList[1];

    if (!card1 || !card2) {
        currentCard.classList.add("flipped");
        card1 = card1 || currentCard;
        card2 = currentCard === card1 ? null : currentCard;
    }

    if (card1 && card2) {
        clickingDisabled = true;

        if (card1.className === card2.className) {
            cardsFlipped += 2;
            card1.removeEventListener("click", handleCardClick);
            card2.removeEventListener("click", handleCardClick);
            card1 = null;
            card2 = null;
            clickingDisabled = false;
        } else {
            setTimeout(function () {
                card1.style.backgroundColor = "";
                card2.style.backgroundColor = "";
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                card1 = null;
                card2 = null;
                clickingDisabled = false;
            }, 1000);
        }
        currentScore++;
        updateScore();
    }
    if (cardsFlipped === COLORS.length) {
        finishGame();
    }
}

import { backend } from "declarations/backend";

let currentWord = "";
let attempts = 5;
let usedLetters = new Set();
let gameActive = false;

const wordDisplay = document.getElementById("wordDisplay");
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const attemptsDisplay = document.getElementById("attemptsDisplay");
const feedback = document.getElementById("feedback");
const usedLettersElement = document.getElementById("usedLetters");
const newGameButton = document.getElementById("newGameButton");
const loadingSpinner = document.getElementById("loadingSpinner");

async function startNewGame() {
    showLoading(true);
    attempts = 5;
    usedLetters.clear();
    updateUsedLetters();
    attemptsDisplay.textContent = attempts;
    feedback.innerHTML = "";
    guessInput.value = "";
    guessInput.disabled = false;
    guessButton.disabled = false;
    
    try {
        currentWord = await backend.startGame();
        wordDisplay.textContent = currentWord;
        gameActive = true;
    } catch (error) {
        console.error("Error starting new game:", error);
        feedback.innerHTML = '<div class="alert alert-danger">Error starting game</div>';
    }
    showLoading(false);
}

async function makeGuess() {
    if (!gameActive) return;
    
    const guess = guessInput.value.toUpperCase();
    if (guess.length !== currentWord.length) {
        feedback.innerHTML = '<div class="alert alert-warning">Please enter a 5-letter word</div>';
        return;
    }

    showLoading(true);
    try {
        const result = await backend.checkGuess(guess);
        
        // Add used letters
        [...guess].forEach(letter => usedLetters.add(letter));
        updateUsedLetters();

        // Display feedback
        let feedbackHtml = "";
        for (let i = 0; i < result.feedback.length; i++) {
            const letterClass = result.feedback[i] === "1" ? "correct" : "incorrect";
            feedbackHtml += `<span class="letter ${letterClass}">${guess[i]}</span>`;
        }
        
        feedback.innerHTML = `<div class="guess-feedback">${feedbackHtml}</div>` + feedback.innerHTML;

        if (result.correct) {
            gameWon();
        } else {
            attempts--;
            attemptsDisplay.textContent = attempts;
            
            if (attempts <= 0) {
                gameLost();
            }
        }

        guessInput.value = "";
    } catch (error) {
        console.error("Error checking guess:", error);
        feedback.innerHTML = '<div class="alert alert-danger">Error checking guess</div>';
    }
    showLoading(false);
}

function updateUsedLetters() {
    usedLettersElement.innerHTML = Array.from(usedLetters)
        .sort()
        .map(letter => `<span class="used-letter">${letter}</span>`)
        .join("");
}

async function gameWon() {
    gameActive = false;
    guessInput.disabled = true;
    guessButton.disabled = true;
    feedback.innerHTML = '<div class="alert alert-success">Congratulations! You won!</div>' + feedback.innerHTML;
}

async function gameLost() {
    gameActive = false;
    guessInput.disabled = true;
    guessButton.disabled = true;
    const word = await backend.getCurrentWord();
    feedback.innerHTML = `<div class="alert alert-danger">Game Over! The word was: ${word}</div>` + feedback.innerHTML;
}

function showLoading(show) {
    loadingSpinner.classList.toggle("d-none", !show);
    guessButton.disabled = show;
    newGameButton.disabled = show;
}

// Event Listeners
guessButton.addEventListener("click", makeGuess);
newGameButton.addEventListener("click", startNewGame);
guessInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") makeGuess();
});

// Start first game
startNewGame();

// wordle.JS - Implements a Wordle-style game to verify human users before accessing the games page

// Global arrays for valid answers and allowed guesses
let answersList = [];
let allowedGuesses = [];
let solution = "";  // The randomly chosen solution

// Global game state variables for tracking user input
let currentRow = 0;
let currentCol = 0;
let isGameOver = false;

/* --- Load valid answers from "wordle-answers-alphabetical.txt" --- */
fetch("wordle-answers-alphabetical.txt")
  .then(response => response.text())
  .then(text => {
    // Remove BOM if present, then split into lines and filter for exactly 5-letter words
    text = text.replace(/^\uFEFF/, "");
    answersList = text
      .split(/\r?\n/)
      .map(line => line.trim().toLowerCase())
      .filter(line => line.length === 5);

    // Choose a random word as the solution
    solution = answersList[Math.floor(Math.random() * answersList.length)];
    console.log("Solution (debug):", solution);
  })
  .catch(error => console.error("Error loading answers list:", error));

/* --- Load allowed guesses from "wordle-allowed-guesses.txt" --- */
fetch("wordle-allowed-guesses.txt")
  .then(response => response.text())
  .then(text => {
    text = text.replace(/^\uFEFF/, "");
    allowedGuesses = text
      .split(/\r?\n/)
      .map(line => line.trim().toLowerCase())
      .filter(line => line.length === 5);

    console.log("Allowed guesses loaded:", allowedGuesses.length);
  })
  .catch(error => console.error("Error loading allowed guesses:", error));

/* --- Keyboard event listener for physical keyboard input --- */
document.addEventListener("keydown", (e) => {
  if (isGameOver) return;
  if (e.key === "Enter") {
    checkRow();
  } else if (e.key === "Backspace") {
    deleteLetter();
  } else if (/^[a-z]$/i.test(e.key)) {
    addLetter(e.key.toLowerCase());
  }
});

// Set up click event listeners for the on-screen keyboard keys
const keys = document.querySelectorAll(".key");
keys.forEach((key) => {
  key.addEventListener("click", () => {
    if (isGameOver) return;
    const keyValue = key.textContent.toLowerCase();

    if (key.id === "enter") {
      checkRow();
    } else if (key.id === "backspace") {
      deleteLetter();
    } else {
      addLetter(keyValue);
    }
  });
});

/* --- Function to add a letter to the current guess --- */
function addLetter(letter) {
  if (currentCol < 5 && currentRow < 6) {
    const tile = document.getElementById(`${currentRow}-${currentCol}`);
    tile.textContent = letter;
    currentCol++;
  }
}

/* --- Function to delete the last letter in the current guess --- */
function deleteLetter() {
  if (currentCol > 0) {
    currentCol--;
    const tile = document.getElementById(`${currentRow}-${currentCol}`);
    tile.textContent = "";
  }
}

/* --- Function to check the current row guess against the solution --- */
function checkRow() {
  // Ensure the solution has loaded
  if (!solution) {
    setMessage("Please wait, loading word list...");
    return;
  }

  if (currentCol < 5) {
    setMessage("Not enough letters!");
    return;
  }

  // Construct the guess string from the current row of tiles
  let guess = "";
  for (let c = 0; c < 5; c++) {
    guess += document.getElementById(`${currentRow}-${c}`).textContent;
  }
  guess = guess.toLowerCase();

  // Validate guess: must be in allowedGuesses or answersList
  if (!allowedGuesses.includes(guess) && !answersList.includes(guess)) {
    setMessage("Word not in list!");
    return;
  }

  // Split guess and solution into arrays for comparison
  const guessArray = guess.split("");
  const solutionArray = solution.split("");

  // Count frequency of each letter in the solution
  const solutionLetterCount = {};
  solutionArray.forEach(letter => {
    solutionLetterCount[letter] = (solutionLetterCount[letter] || 0) + 1;
  });

  // First pass: mark correct letters (green)
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    const letter = guessArray[i];
    if (solutionArray[i] === letter) {
      tile.classList.add("correct");
      solutionLetterCount[letter]--;
    }
  }

  // Second pass: mark present (yellow) or absent (gray) letters
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    const letter = guessArray[i];
    if (!tile.classList.contains("correct")) {
      if (solutionLetterCount[letter]) {
        tile.classList.add("present");
        solutionLetterCount[letter]--;
      } else {
        tile.classList.add("absent");
      }
    }
  }

  // If guess matches the solution, notify user and redirect after a delay
  if (guess === solution) {
    setMessage("Good Job, transferring you to the games page!");
    isGameOver = true;
    setTimeout(() => {
      window.location.href = "games.html";
    }, 3000);
  } else {
    // If last row has been used without success, display failure message with a link
    if (currentRow >= 5) {
      setMessage(`You Suck! The word was "${solution}". You must now click the loser link in order to see the games page.`);
      isGameOver = true;
      const linkPara = document.getElementById("gamesLinkParagraph");
      linkPara.innerHTML = '<a href="games.html">LOSER LINK</a>';
    } else {
      // Otherwise, move to the next row for another guess
      currentRow++;
      currentCol = 0;
    }
  }
}

/* --- Function to display a message to the user --- */
function setMessage(msg) {
  const messageEl = document.getElementById("message");
  messageEl.style.opacity = 1;
  messageEl.textContent = msg;

  // Fade out error messages after 1 second if still unchanged
  if (msg === "Word not in list!" || msg == "Not enough letters!") {
    setTimeout(() => {
      if (messageEl.textContent === msg) {
        messageEl.style.opacity = 0;
      }
    }, 1000);
  }
}

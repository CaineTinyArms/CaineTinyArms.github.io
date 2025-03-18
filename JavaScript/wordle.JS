// wordle.js

// Arrays loaded from text files
let answersList = [];      // Will hold valid answers from wordle-answers-alphabetical.txt
let allowedGuesses = [];   // Will hold valid guesses from wordle-allowed-guesses.txt
let solution = "";         // Randomly chosen from answersList

// Game state
let currentRow = 0;
let currentCol = 0;
let isGameOver = false;

/* --- 1) Load answers from "wordle-answers-alphabetical.txt" --- */
fetch("wordle-answers-alphabetical.txt")
  .then(response => response.text())
  .then(text => {
    // Remove a possible BOM
    text = text.replace(/^\uFEFF/, "");
    // Split on newlines, trim, lowercase, and filter for exactly 5 letters
    answersList = text
      .split(/\r?\n/)
      .map(line => line.trim().toLowerCase())
      .filter(line => line.length === 5);

    // Pick a random solution from answersList
    solution = answersList[Math.floor(Math.random() * answersList.length)];
    console.log("Solution (debug):", solution);
  })
  .catch(error => console.error("Error loading answers list:", error));

/* --- 2) Load allowed guesses from "wordle-allowed-guesses.txt" --- */
fetch("wordle-allowed-guesses.txt")
  .then(response => response.text())
  .then(text => {
    // Remove a possible BOM
    text = text.replace(/^\uFEFF/, "");
    // Split on newlines, trim, lowercase, and filter for exactly 5 letters
    allowedGuesses = text
      .split(/\r?\n/)
      .map(line => line.trim().toLowerCase())
      .filter(line => line.length === 5);

    console.log("Allowed guesses loaded:", allowedGuesses.length);
  })
  .catch(error => console.error("Error loading allowed guesses:", error));

/* --- Keyboard Events --- */
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

/* --- Add a Letter to the Current Tile --- */
function addLetter(letter) {
  if (currentCol < 5 && currentRow < 6) {
    const tile = document.getElementById(`${currentRow}-${currentCol}`);
    tile.textContent = letter;
    currentCol++;
  }
}

/* --- Delete a Letter from the Current Tile --- */
function deleteLetter() {
  if (currentCol > 0) {
    currentCol--;
    const tile = document.getElementById(`${currentRow}-${currentCol}`);
    tile.textContent = "";
  }
}

/* --- Check the User's Guess --- */
function checkRow() {
  // If the solution hasn't loaded yet, we can't proceed
  if (!solution) {
    setMessage("Please wait, loading word list...");
    return;
  }

  if (currentCol < 5) {
    setMessage("Not enough letters!");
    return;
  }

  // Gather the guess from the current row
  let guess = "";
  for (let c = 0; c < 5; c++) {
    guess += document.getElementById(`${currentRow}-${c}`).textContent;
  }
  guess = guess.toLowerCase();

  // Validate guess: it must be in allowedGuesses OR answersList
  if (!allowedGuesses.includes(guess) && !answersList.includes(guess)) {
    setMessage("Word not in list!");
    return;
  }

  // Evaluate guess against the solution
  const guessArray = guess.split("");
  const solutionArray = solution.split("");

  // Track how many times each letter appears in the solution
  const solutionLetterCount = {};
  solutionArray.forEach(letter => {
    solutionLetterCount[letter] = (solutionLetterCount[letter] || 0) + 1;
  });

  // Mark correct letters (green)
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    const letter = guessArray[i];
    if (solutionArray[i] === letter) {
      tile.classList.add("correct");
      solutionLetterCount[letter]--;
    }
  }

  // Mark present (yellow) or absent (gray)
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

  // Check if user guessed the solution
  if (guess === solution) {
    setMessage("Good Job, transferring you to the games page!");
    isGameOver = true;
    setTimeout(() => {
      window.location.href = "games.html";
    }, 3000);
  } else {
    // If out of rows, game over
    if (currentRow >= 5) {
      setMessage(`You Suck! The word was "${solution}". You must now click the loser link in order to see the games page.`);
      isGameOver = true;
      const linkPara = document.getElementById("gamesLinkParagraph");
      linkPara.innerHTML = '<a href="games.html">LOSER LINK</a>';
    } else {
      // Move to next row
      currentRow++;
      currentCol = 0;
    }
  }
}

/* --- Display a Message to the User --- */
function setMessage(msg) {
  const messageEl = document.getElementById("message");
  
  // Show the message at full opacity
  messageEl.style.opacity = 1;
  messageEl.textContent = msg;

  // If it's specifically "Word not in list!", fade out after 2 seconds
  if (msg === "Word not in list!") {
    setTimeout(() => {
      // Only fade out if the message is still the same
      if (messageEl.textContent === msg) {
        messageEl.style.opacity = 0;
      }
    }, 2000);
  }
}


// wordle.JS - Implements a Wordle-style game to verify human users before accessing the games page

// Global arrays for valid answers and allowed guesses
let answersList = [];
let allowedGuesses = [];
let solution = "";  // The randomly chosen solution

// Global game state variables for tracking user input
let currentRow = 0;
let currentCol = 0;
let isGameOver = false;
let wordsCompleted = 0; // Track how many words the player has completed

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
    selectNewWord();
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

/* --- Function to select a new word --- */
function selectNewWord() {
  solution = answersList[Math.floor(Math.random() * answersList.length)];
  console.log("Solution (debug):", solution);
}

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

/**
 * --- Function: Update keyboard key colors based on guess results ---
 * This function updates the on-screen keyboard to visually show which letters
 * have been tried and their statuses (correct, present, absent)
 * 
 * @param {string} letter - The letter that needs its keyboard key updated
 * @param {string} status - The status of the letter: "correct", "present", or "absent"
 */
function updateKeyboardColors(letter, status) {
  // Find all keys with this letter (should be only one per letter)
  const keys = document.querySelectorAll(`.key`);
  keys.forEach((key) => {
    // Only update keys that match the current letter
    if (key.textContent.toLowerCase() === letter) {
      // Only upgrade the key status (absent → present → correct), never downgrade
      // This follows the original Wordle behavior, where the highest status "wins"
      if (status === "correct") {
        // Correct (green) is the highest status, always apply it
        key.className = "key correct";
      } else if (status === "present" && !key.classList.contains("correct")) {
        // Present (yellow) is the middle status, apply if not already correct
        key.className = "key present";
      } else if (status === "absent" && 
                !key.classList.contains("correct") && 
                !key.classList.contains("present")) {
        // Absent (gray) is the lowest status, apply only if no status yet
        key.className = "key absent";
      }
      
      // Preserve the wide-key class for enter and backspace keys
      if (key.id === "enter" || key.id === "backspace") {
        key.classList.add("wide-key");
      }
    }
  });
}

/* --- Function to reset the game board for a new word --- */
function resetGame() {
  // Reset game state variables
  currentRow = 0;
  currentCol = 0;
  isGameOver = false;
  
  // Clear all tiles
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 5; col++) {
      const tile = document.getElementById(`${row}-${col}`);
      tile.textContent = "";
      tile.className = "tile";
    }
  }
  
  // Reset keyboard colors
  keys.forEach((key) => {
    if (key.id === "enter" || key.id === "backspace") {
      key.className = "key wide-key";
    } else {
      key.className = "key";
    }
  });
  
  // Clear any message
  setMessage("");
  
  // Select a new word
  selectNewWord();
}

/* --- Function to check the current row guess against the solution --- */
function checkRow() {
  // Ensure the solution has loaded
  if (!solution) {
    setMessage("Please wait, loading word list...");
    return;
  }

  // Validate the guess has enough letters
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
  // This helps handle duplicate letters correctly
  const solutionLetterCount = {};
  solutionArray.forEach(letter => {
    solutionLetterCount[letter] = (solutionLetterCount[letter] || 0) + 1;
  });

  // First pass: mark correct letters (green)
  // We do this in a separate pass to prioritize exact matches when handling duplicates
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    const letter = guessArray[i];
    if (solutionArray[i] === letter) {
      // Add the correct class to the tile
      tile.classList.add("correct");
      
      // Update the corresponding keyboard key to green
      updateKeyboardColors(letter, "correct");
      
      // Decrement the letter count to handle duplicates correctly
      solutionLetterCount[letter]--;
    }
  }

  // Second pass: mark present (yellow) or absent (gray) letters
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    const letter = guessArray[i];
    
    // Skip letters already marked as correct in the first pass
    if (!tile.classList.contains("correct")) {
      // If the letter is in the solution and we haven't used up all occurrences
      if (solutionLetterCount[letter] && solutionLetterCount[letter] > 0) {
        tile.classList.add("present");
        
        // Update the corresponding keyboard key to yellow
        updateKeyboardColors(letter, "present");
        
        // Decrement the letter count to handle duplicates correctly
        solutionLetterCount[letter]--;
      } else {
        // Letter is not in the solution or all occurrences were already accounted for
        tile.classList.add("absent");
        
        // Update the corresponding keyboard key to gray
        updateKeyboardColors(letter, "absent");
      }
    }
  }

  // If guess matches the solution, congratulate user and prepare for next word
  if (guess === solution) {
    wordsCompleted++;
    setMessage(`Correct! That's ${wordsCompleted} word${wordsCompleted > 1 ? 's' : ''} solved. Next word coming up!`);
    isGameOver = true;
    
    // Set a timer to reset the game with a new word
    setTimeout(() => {
      resetGame();
    }, 3000);
  } else {
    // If last row has been used without success, display failure message and offer restart
    if (currentRow >= 5) {
      setMessage(`The word was "${solution}". Click "Try Again" for a new word.`);
      isGameOver = true;
      
      // Create and display a "Try Again" button
      const messageEl = document.getElementById("message");
      const tryAgainButton = document.createElement("button");
      tryAgainButton.textContent = "Try Again";
      tryAgainButton.style.marginLeft = "10px";
      tryAgainButton.addEventListener("click", resetGame);
      messageEl.appendChild(tryAgainButton);
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
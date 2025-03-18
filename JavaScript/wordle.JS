// wordle.js

const WORDS = [
  "abate", "adopt", "abode", "aware", "badge", "bicep", "bluff", "board", "build", "bring",
  "brash", "brush", "campy", "cheek", "chest", "chalk", "clown", "crate", "crane", "crook",
  "ditch", "dwell", "faint", "fetch", "ferry", "float", "fresh", "fruit", "grade", "glass",
  "grain", "horse", "harsh", "alive", "alarm", "alpha", "amuse", "agile", "alone", "alley",
  "align", "onion", "minus", "month", "might", "night", "proxy", "scaly", "shady", "shelf",
  "shift", "shrug", "slyly", "smile", "spare", "spice", "spree", "stack", "stage", "stale",
  "start", "steak", "steel", "steep", "sneer", "swirl", "toxic", "twist", "token", "trace",
  "today", "until", "voice", "watch", "weird", "witty", "yield", "young", "yearn", "zesty",
  "admit", "quilt", "quick", "agent", "again", "spore", "share", "shame", "media", "mania",
  "llama", "short", "phone", "realm", "petty", "nails", "slice", "slick", "totem", "unify",
  "fable", "truce", "vivid", "noble", "spiky", "trend", "crisp", "frost", "gloom", "flame",
  "flare", "grape", "vixen", "charm", "cloak", "mirth", "panic", "plush", "pride", "quest",
  "siren", "sunny", "tease", "tidal", "torso", "vapor", "whisk", "wager", "wound", "zebra",
  "brave", "climb", "drape", "eager", "elite", "envoy", "fancy", "flick", "glare", "haste",
  "humor", "ivory", "jolly", "jumbo", "latch", "lemon", "lyric", "mango", "mercy", "motto",
  "nudge", "ocean", "pearl", "phase", "quirk", "radar", "rifle", "rocky", "scoop", "shade",
  "spine", "table", "thorn", "trend", "valve", "verge", "vocal", "waver", "witty", "zesty",
  "candy", "dizzy", "furry", "grand", "hover", "icily", "jumpy", "kayak", "lunar", "mirth",
  "nifty", "ozone", "perch", "quack", "risky", "silky", "tulip", "vixen", "woven", "xerox",
  "amber", "beast", "crash", "dream", "eagle", "flock", "grasp", "hazel", "icing", "jazzy",
  "koala", "latch", "meaty", "nerdy", "olive", "plume", "quilt", "raven", "shiny", "torch",
  "ultra", "vivid", "whale", "xenon", "yacht", "zebra", "azure", "blaze", "cloud", "daisy",
  "ember", "froze", "glide", "hover", "inlet", "joust", "kiosk", "lobby", "mirth", "nudge",
  "opera", "proud", "quirk", "rider", "spade", "truly", "vapor", "whisk", "yield", "zesty",
  "alien", "bluff", "chore", "dandy", "elbow", "flare", "grape", "hotel", "ivory", "jolly",
  "knock", "leech", "mango", "novel", "oasis", "peace", "query", "ranch", "serum", "tiger",
  "udder", "velar", "witty", "xylem", "youth", "zephyr", "bloom", "creek", "diver", "eager",
  "fence", "globe", "honor", "infer", "japan", "kneel", "lemon", "mirth", "noble", "onset",
  "prism", "quiet", "rusty", "swarm", "throb", "vital", "wound", "xeric", "yummy", "zonal"
];

// Choose the secret word from WORDS
const solution = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log("Solution (for debugging):", solution);

let currentRow = 0;
let currentCol = 0;
let isGameOver = false;

// Global variable to hold allowed guesses loaded from external file
let allowedGuesses = [];

// Load allowed guesses from "wordle-allowed-guesses.txt"
fetch('wordle-allowed-guesses.txt')
  .then(response => response.text())
  .then(text => {
    allowedGuesses = text
      .split(/\r?\n/)
      .map(word => word.trim())
      .filter(word => word.length === 5);
    console.log("Allowed guesses loaded: " + allowedGuesses.length);
    // Optionally, enable user input here once the list is loaded.
  })
  .catch(error => console.error("Error loading allowed guesses:", error));

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

function addLetter(letter) {
  if (currentCol < 5 && currentRow < 6) {
    const tile = document.getElementById(`${currentRow}-${currentCol}`);
    tile.textContent = letter;
    currentCol++;
  }
}

function deleteLetter() {
  if (currentCol > 0) {
    currentCol--;
    const tile = document.getElementById(`${currentRow}-${currentCol}`);
    tile.textContent = "";
  }
}

function checkRow() {
  if (currentCol < 5) {
    setMessage("Not enough letters!");
    return;
  }

  let guess = "";
  for (let c = 0; c < 5; c++) {
    guess += document.getElementById(`${currentRow}-${c}`).textContent;
  }

  // Accept the guess if it is in the allowed guesses file OR in WORDS.
  if (!allowedGuesses.includes(guess) && !WORDS.includes(guess)) {
    setMessage("Word not in list!");
    return;
  }

  const guessArray = guess.split("");
  const solutionArray = solution.split("");

  const solutionLetterCount = {};
  solutionArray.forEach((letter) => {
    solutionLetterCount[letter] = (solutionLetterCount[letter] || 0) + 1;
  });

  // Mark correct letters (right letter in the right position)
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    const letter = guessArray[i];
    if (solutionArray[i] === letter) {
      tile.classList.add("correct");
      solutionLetterCount[letter]--;
    }
  }

  // Mark present/absent letters
  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`${currentRow}-${i}`);
    const letter = guessArray[i];
    if (!tile.classList.contains("correct")) {
      if (solutionLetterCount[letter] && solutionLetterCount[letter] > 0) {
        tile.classList.add("present");
        solutionLetterCount[letter]--;
      } else {
        tile.classList.add("absent");
      }
    }
  }

  // Check win or move to next row
  if (guess === solution) {
    setMessage("Good Job, transferring you to the games page!");
    isGameOver = true;
    setTimeout(() => {
      window.location.href = "games.html";
    }, 3000);
  } else {
    if (currentRow >= 5) {
      setMessage(`You Suck! The word was "${solution}". You must now click the loser link in order to see the games page.`);
      isGameOver = true;
      const linkPara = document.getElementById("gamesLinkParagraph");
      linkPara.innerHTML = '<a href="games.html">LOSER LINK</a>';
    } else {
      currentRow++;
      currentCol = 0;
    }
  }
}

function setMessage(msg) {
  document.getElementById("message").textContent = msg;
}

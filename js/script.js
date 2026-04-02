/**
 * List of words loaded from JSON file.
 * Each word contains { word, tip }.
 */
let words = [];

/** Index of the current word in the words array */
let currentWordIndex = 0;

/** The actual word the player is guessing */
let secretWord = "";

/** Array representing the current guessed state (e.g. ["A", "_", "C"]) */
let display = [];

/** Number of remaining lives */
let lives = 7;

/**
 * Fetch words from external JSON file and initialize the game.
 */
fetch("words.json")
  .then(response => response.json())
  .then(data => {
      words = data;

      createLetters();
      startNewRound();
      updateLives();
  })
  .catch(error => console.error("Error loading words:", error));

/**
 * Updates the displayed word on screen.
 */
function updateWord()
{
    document.getElementById("word").innerText = display.join(" ");
}

/**
 * Creates alphabet buttons (A-Z) for user input.
 */
function createLetters()
{
    let container = document.getElementById("letters");

    for(let i = 65; i <= 90; i++)
    {
        let letter = String.fromCharCode(i);

        let btn = document.createElement("button");
        btn.innerText = letter;

        btn.onclick = function()
        {
            handleGuess(letter);
            btn.disabled = true;
        };

        container.appendChild(btn);
    }
}

/**
 * Displays the hint for the current word.
 */
function showTip()
{
    document.getElementById("tip").innerText =
        "Hint: " + words[currentWordIndex].tip;
}

/**
 * Starts a new round:
 * - Resets lives
 * - Picks a random word
 * - Resets UI and buttons
 */
function startNewRound()
{
    lives = 7;

    currentWordIndex = Math.floor(Math.random() * words.length);

    if(currentWordIndex >= words.length)
    {
        currentWordIndex = 0;
    }

    secretWord = words[currentWordIndex].word;
    display    = Array(secretWord.length).fill("_");

    updateWord();
    showTip();
    updateLives();

    document.getElementById("status").innerText            = "";
    document.getElementById("stand").style.display         = "block";
    document.getElementById("ui").style.display            = "block";
    document.getElementById("gameOverPopup").style.display = "none";
    document.getElementById("wait").style.display          = "none";
    document.getElementById("cheer").style.display         = "none";
    document.getElementById("loseChar").style.display      = "none";
    document.getElementById("playAgain").style.display     = "none";

    // Reset all letter buttons
    document.querySelectorAll("#letters button").forEach(btn =>
    {
        btn.disabled         = false;
        btn.style.visibility = "visible";
    });

    document.getElementById("word").style.visibility = "visible";

    document.getElementById("game").style.backgroundImage =
        "url('images/back-alley-background2.png')";

    loseChar.classList.remove("show");
}

/**
 * Checks if the player has successfully guessed the word.
 */
function status()
{
    if(display.join("") === secretWord)
    {
        document.getElementById("status").innerText = "Amazing guess!";
        setTimeout(startNewRound, 2000);
    }
}

/**
 * Handles a player's letter guess.
 *
 * @param {string} letter - The guessed letter
 */
function handleGuess(letter)
{
    let found = false;

    // Check if guessed letter exists in word
    for(let i = 0; i < secretWord.length; i++)
    {
        if(secretWord[i] === letter)
        {
            display[i] = letter;
            found = true;
        }
    }

    updateWord();
    status();

    if(found)
    {
        // Correct guess visuals
        document.getElementById("cheer").style.display  = "block";
        document.getElementById("stand").style.display  = "none";
        document.getElementById("wait").style.display   = "none";
        document.getElementById("status").innerText     = "That's right!";
    }
    else
    {
        // Incorrect guess
        lives--;

        document.getElementById("cheer").style.display = "none";
        document.getElementById("status").innerText    = "Wrong guess!";
        document.getElementById("wait").style.display  = "block";
        document.getElementById("stand").style.display = "none";

        // Game over condition
        if(lives === 0)
        {
            document.getElementById("status").innerText      = "You failed...";
            document.getElementById("word").style.visibility = "hidden";
            document.getElementById("ui").style.display      = "none";

            document.getElementById("wait").style.display  = "none";
            document.getElementById("stand").style.display = "none";
            document.getElementById("cheer").style.display = "none";

            document.getElementById("loseChar").style.display = "block";

            document.getElementById("game").style.backgroundImage =
                "url('images/zoom-background.gif')";

            document.getElementById("gameOverPopup").style.display = "block";
            document.getElementById("playAgain").style.display     = "block";

            // Trigger animation
            setTimeout(() => {
                loseChar.classList.add("show");
            }, 10);

            // Disable all buttons
            document.querySelectorAll("#letters button").forEach(btn =>
            {
                btn.disabled         = true;
                btn.style.visibility = "hidden";
            });
        }
    }

    updateLives();
}

/**
 * Updates the lives display using heart icons.
 */
function updateLives()
{
    let hearts = "❤️".repeat(lives);
    document.getElementById("lives").innerText =
        "Incorrect guesses: " + hearts;
}

/**
 * Restarts the game when "Play Again" is clicked.
 */
function playAgain()
{
    startNewRound();
}
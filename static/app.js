const boggleWords = new Set();
let score = 0;
let secs = 60;

let timer = setInterval(countdown, 100);

/* Displays word valitady status */ 
function showMessage(msg) {
    $(".msg").text(msg);
}

/* Displays current score in HTML */ 
function showScore() {
    $(".score").text(score);
}
/* Displays Timer in HTML */ 
function showTimer() {
    $(".timer").text(secs);
}
/* Increments secs down by 1 and displays*/ 
function countdown() {
    secs -= 1;
    showTimer();

    if (secs === 0) {
        clearInterval(timer);
        finalScore();
    }
}

$(".guess").on("submit", handleSubmit);

/***** Handles submition of guessed word. Checks for duplicate words. Shows and updates score *****/
async function handleSubmit(evt) {
    evt.preventDefault();
    const $word = $(".word");
    const word = $word.val();

    if (!word) {
        return;
    }

    if (boggleWords.has(word)) {
        showMessage("Word already found");
        return;
    }

    const res = await axios.get("/valid-word", { params: { word: word } });

    if (res.data.result === "not-word") {
        showMessage(`${word} is not a valid word`);
    } else if (res.data.result === "not-on-board") {
        showMessage(`${word} is not a valid word on board`);
    } else {
        boggleWords.add(word);
        showMessage("Valid word");
        score += word.length;
        showScore();
    }
}
/* Ends Game. Sends score to server. Shows final score */ 
async function finalScore() {
    $("#game-container").hide();
    const res = await axios.post("/final-score", { score: score });
    if (res.data.brokeRecord) {
        showMessage(`New Highscore: ${score}`);
    } else {
        showMessage(`Final Score: ${score}`);
    }
}

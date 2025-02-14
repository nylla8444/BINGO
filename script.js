// THIS IS FOR TOGGLE:

document.getElementById("toggleButton").addEventListener("click", function () {
    let contentToToggle = document.getElementById("contentToToggle");

    // Toggle the visibility of the content
    if (
        contentToToggle.style.display === "none" ||
        contentToToggle.style.display === ""
    ) {
        contentToToggle.style.display = "block";
    } else {
        contentToToggle.style.display = "none";
    }
});

/**
 * Web API - SpeechSynthesis
 * https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
 * https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
 *
 *
 *
 *
 *  CREDITS TO: https://codepen.io/Milleus/pen/abQvmdr
 *  FOR THE TEXT TO SPEECH CODE
 */

const supportedText = document.querySelector("#support");
const messageInput = document.querySelector("#message");
const voiceSelect = document.querySelector("#voice");
const rateInput = document.querySelector("#rate");
const pitchInput = document.querySelector("#pitch");
const volumeInput = document.querySelector("#volume");
const startStopButton = document.querySelector("#start-stop");
const pauseResumeButton = document.querySelector("#pause-resume");
const currentWord = document.querySelector("#current-word");
const elapsedTime = document.querySelector("#elapsed-time");

supportedText.innerHTML = isSupported()
    ? "Your browser <strong>supports</strong> speech synthesis."
    : "Your browser <strong>does not support</strong> speech synthesis.";

// Firefox loads voices up front and does not trigger "voiceschanged" event.
setVoiceOptions();

// Chrome/Safari does not load voices up front thus we rely on "voiceschanged" event.
window.speechSynthesis.onvoiceschanged = () => {
    setVoiceOptions();
};

/**
 * Display selected values for range inputs.
 */
rateInput.addEventListener("input", function () {
    this.nextElementSibling.value = Number(this.value).toFixed(1);
});
pitchInput.addEventListener("input", function () {
    this.nextElementSibling.value = Number(this.value).toFixed(1);
});
volumeInput.addEventListener("input", function () {
    this.nextElementSibling.value = Number(this.value).toFixed(1);
});

/**
 * Handle start and stop.
 */
startStopButton.addEventListener("click", function () {
    if (!isSupported || messageInput.value.length <= 0) {
        return;
    }

    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        startStopButton.innerHTML = "Start";
        pauseResumeButton.innerHTML = "Pause";
    } else {
        const options = {
            pitch: parseFloat(pitchInput.value),
            rate: parseFloat(rateInput.value),
            // text: messageInput.value,
            text: currentCallVal.textContent,
            voice: window.speechSynthesis
                .getVoices()
                .find((voice) => voice.name === voiceSelect.value),
            volume: parseFloat(volumeInput.value),
        };

        speak(options);
        startStopButton.innerHTML = "Stop";
    }
});

/**
 * Handle pause and resume.
 */
pauseResumeButton.addEventListener("click", function () {
    if (!isSupported) {
        return;
    }

    if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        pauseResumeButton.innerHTML = "Pause";
    } else {
        window.speechSynthesis.pause();
        pauseResumeButton.innerHTML = "Resume";
    }
});

/**
 * Check if speech synthesis is supported.
 */
function isSupported() {
    if (typeof window === "undefined" || !window.speechSynthesis) {
        return false;
    }

    return true;
}

/**
 * Set voice options to voice select element.
 */
function setVoiceOptions() {
    if (!isSupported()) {
        return;
    }

    const voices = window.speechSynthesis.getVoices();

    voices.forEach((voice) => {
        const option = document.createElement("option");

        option.value = voice.name;
        option.innerHTML = voice.name;

        voiceSelect.appendChild(option);
    });
}

/**
 * Trigger speaking based on speech options selected.
 */
function speak(options) {
    const utterance = new SpeechSynthesisUtterance();

    utterance.onstart = () => {
        elapsedTime.innerHTML = "";
    };
    utterance.onend = () => {
        startStopButton.innerHTML = "Start";
        pauseResumeButton.innerHTML = "Pause";
    };
    utterance.onboundary = (event) => {
        currentWord.innerHTML = event.utterance.text
            .substr(event.charIndex)
            .match(/^.+?\b/)[0];
        elapsedTime.innerHTML = `${event.elapsedTime} seconds.`;
    };

    utterance.pitch = options.pitch;
    utterance.rate = options.rate;
    utterance.text = options.text;
    utterance.voice = options.voice;
    utterance.volume = options.volume;

    window.speechSynthesis.speak(utterance);
}

/*     ==================== FOR BINGO CARD ===========================  */

function updateBingoCard() {
    const patternSelector = document.getElementById("patternSelector");
    const selectedPattern = patternSelector.value;
    const bingoCard = document.getElementById("bingoCard");

    // Clear previous content
    bingoCard.innerHTML = "";

    // Define the cells based on the selected pattern
    let cells;
    switch (selectedPattern) {
        case "horizontal":
            cells = [1, 2, 3, 4, 5];
            break;
        case "vertical":
            cells = [1, 6, 11, 16, 21];
            break;
        case "diagonal":
            cells = [1, 7, 13, 19, 25];
            break;
        case "fourCorners":
            cells = [1, 5, 21, 25];
            break;
        case "fullCard":
            cells = Array.from({ length: 25 }, (_, i) => i + 1);
            break;
        case "letterT":
            cells = [1, 2, 3, 4, 5, 8, 13, 18, 23];
            break;
        case "letterX":
            cells = [1, 5, 7, 9, 13, 17, 19, 21, 25];
            break;
        case "postageStamp":
            cells = [1, 2, 6, 7];
            break;
        case "outsideFrame":
            cells = [1, 2, 3, 4, 5, 6, 11, 16, 21, 25, 20, 15, 10, 22, 23, 24];
            break;
        case "insideFrame":
            cells = [7, 8, 9, 12, 13, 14, 17, 18, 19];
            break;
        case "diamond":
            cells = [3, 7, 8, 9, 11, 12, 13, 14, 15, 17, 18, 19, 23];
            break;
        case "pyramid":
            cells = [3, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            break;
        case "arrow":
            cells = [3, 4, 5, 9, 10, 15, 13, 17, 21];
            break;
        case "topBottomLines":
            cells = [1, 2, 3, 4, 5, 21, 22, 23, 24, 25];
            break;
        case "leftRightLines":
            cells = [1, 6, 11, 16, 21, 5, 10, 15, 20, 25];
            break;
        case "doubleDiagonal":
            cells = [1, 3, 5, 7, 9, 13, 11, 15, 17, 19, 21, 23, 25];
            break;
        case "heart":
            cells = [2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 23];
            break;
        case "cross":
            cells = [3, 8, 13, 18, 23, 11, 12, 13, 14, 15];
            break;
        case "rectangle":
            cells = [6, 7, 8, 9, 10, 11, 15, 16, 17, 18, 19, 20];
            break;
        default:
            cells = [];
    }

    // Populate the bingo card with cells
    for (let i = 1; i <= 25; i++) {
        const cell = document.createElement("div");
        cell.classList.add("bingo-cell");
        cell.textContent = i;
        if (cells.includes(i)) {
            cell.classList.add("highlight");
        }
        bingoCard.appendChild(cell);
    }
}

/* ======== CALLER CARD ========= */
let currentCallVal = document.querySelector(".call-value");

const letters = ["B", "I", "N", "G", "O"];
let drawnNumbers = { B: [], I: [], N: [], G: [], O: [] };

// DRAW
function drawNumber() {
    const letterIndex = Math.floor(Math.random() * letters.length);
    const number = generateRandomNumber(letterIndex);
    const selectedNumber = letters[letterIndex] + number;

    if (!drawnNumbers[letters[letterIndex]].includes(number)) {
        drawnNumbers[letters[letterIndex]].push(number);
        updateBoard(letters[letterIndex], number);

        // Introduce a 1-second delay before starting speech synthesis
        setTimeout(() => {
            // Set the number of repetitions you want
            const repetitions = 2;

            for (let i = 0; i < repetitions; i++) {
                const delay = i === 0 ? 1000 : 0; // 1-second delay after the first repetition
                setTimeout(() => {
                    const options = {
                        pitch: parseFloat(pitchInput.value),
                        rate: parseFloat(rateInput.value),
                        text: selectedNumber, // You can customize this to use the desired text
                        voice: window.speechSynthesis
                            .getVoices()
                            .find((voice) => voice.name === voiceSelect.value),
                        volume: parseFloat(volumeInput.value),
                    };

                    speak(options);
                    startStopButton.innerHTML = "Stop";
                }, delay);
            }
        }, 1000);
    } else {
        drawNumber(); // Redraw if the number is already drawn
    }
}

function generateRandomNumber(letterIndex) {
    const min = letterIndex * 15 + 1;
    const max = min + 14;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateBoard(letter, number) {
    const column = document.getElementById(letter);
    const numberElement = document.createElement("div");
    // UPDATES THE CURRENT CALL EVERY DRAW
    currentCallVal.textContent = letter + number;

    numberElement.textContent = letter + number;
    numberElement.classList.add("number", "drawn", "glow");
    column.appendChild(numberElement);

    // Remove the glow class after 2 seconds
    setTimeout(() => {
        numberElement.classList.remove("glow");
    }, 2000);
}

function resetSheet() {
    currentCallVal.textContent = " ";
    const board = document.getElementById("bingoCallerSheet");
    letters.forEach((letter) => {
        const column = document.getElementById(letter);
        column.innerHTML = "";
        drawnNumbers[letter] = [];
    });
}

// DRAW AND RESET BUTTON
let drawBtn = document.querySelector("#draw");
drawBtn.addEventListener("click", drawNumber);

let resetBtn = document.querySelector("#reset");
resetBtn.addEventListener("click", resetSheet);


let drawInterval = null;

function startAutoDraw() {
    drawBtn.disabled = true;
    drawInterval = setInterval(drawNumber, 5000);
}

function stopAutoDraw() {
    clearInterval(drawInterval);
    drawBtn.disabled = false;
    drawInterval = null;
}

// Add auto-draw toggle button
let autoDrawBtn = document.createElement('button');
autoDrawBtn.textContent = 'Start Auto Draw';
autoDrawBtn.addEventListener('click', function () {
    if (drawInterval === null) {
        startAutoDraw();
        autoDrawBtn.textContent = 'Stop Auto Draw';
    } else {
        stopAutoDraw();
        autoDrawBtn.textContent = 'Start Auto Draw';
    }
});

// Insert the auto-draw button next to existing buttons
drawBtn.parentNode.insertBefore(autoDrawBtn, resetBtn);

// Update reset function to stop auto-draw
function resetSheet() {
    stopAutoDraw();
    autoDrawBtn.textContent = 'Start Auto Draw';
    currentCallVal.textContent = " ";
    const board = document.getElementById("bingoCallerSheet");
    letters.forEach((letter) => {
        const column = document.getElementById(letter);
        column.innerHTML = "";
        drawnNumbers[letter] = [];
    });
}
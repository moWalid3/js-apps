//
// I got json file contain words ==> if you want to adds any features
//  and you can fix if the letter is written 2 times one in correct place and another one in another place so this place mustn't colored green because he used it.
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By <span>M.W</span>`;

// game options
let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// manage words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();

function generateInputs() {
  const inputsContainer = document.querySelector(".inputs");

  // create tries and inputs
  for (let i = 1; i <= numberOfTries; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    for (let j = 1; j <= numberOfLetters; j++) {
      let input = document.createElement("input");
      input.id = `guess-${i}-letter-${j}`;
      input.type = "text";
      input.setAttribute("maxlength", "1");
      tryDiv.append(input);
    }

    inputsContainer.append(tryDiv);
  }

  // Disable all inputs Except the first one
  inputsContainer.children[0].children[1].focus();
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => (input.disabled = "true"));

  // manage moving with inputs
  let inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      let nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });

    input.addEventListener("keydown", function (event) {
      let currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        let nextIndex = currentIndex + 1;
        inputs[nextIndex].focus();
      }
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        let perviousIndex = currentIndex - 1;
        inputs[perviousIndex].focus();
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );

    const letter = inputField.value.toLowerCase();
    if (wordToGuess[i - 1] == letter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  if (successGuess) {
    guessButton.disabled = true;
    hintButton.disabled = true;
    let message = document.querySelector(".message");
    message.style.display = "block";
    message.innerHTML = `You Win The Word Is <span>${wordToGuess}</span>`;
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
  } else if (currentTry === numberOfTries) {
    guessButton.disabled = true;
    hintButton.disabled = true;
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    let message = document.querySelector(".message");
    message.style.display = "block";
    message.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
  } else {
    let currentTryElement = document.querySelector(`.try-${currentTry}`);
    currentTryElement.classList.add("disabled-inputs");
    [...currentTryElement.children].forEach((inp) => (inp.disabled = true));

    currentTry++;

    currentTryElement.nextElementSibling.classList.remove("disabled-inputs");
    [...currentTryElement.nextElementSibling.children].forEach((ele, index) => {
      index !== 0 && (ele.disabled = false);
      index === 1 && ele.focus();
    });
    guessButton.addEventListener("click", handleGuesses);
  }
}

// manage hints
document.querySelector(".hint span").innerHTML = numberOfHints;
let hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", getHint);

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }

  if (numberOfHints === 0) {
    hintButton.disabled = true;
  }

  let enabledInputs = document.querySelectorAll("input:not([disabled])");
  let emptyInputs = Array.from(enabledInputs).filter(
    (input) => input.value == false
  );

  if (emptyInputs.length > 0) {
    let randomEmptyInput =
      emptyInputs[Math.floor(Math.random() * emptyInputs.length)];
    let indexToFill = Array.from(enabledInputs).indexOf(randomEmptyInput);
    randomEmptyInput.value = wordToGuess[indexToFill].toUpperCase();
    randomEmptyInput.classList.add("yes-in-place");
    randomEmptyInput.disabled = true;
  }
}

document.addEventListener("keydown", handleBackspace);

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const currentInputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(currentInputs).indexOf(
      document.activeElement
    );

    if (currentIndex > 0) {
      currentInputs[currentIndex].value = "";
      currentInputs[currentIndex - 1].value = "";
      currentInputs[currentIndex - 1].focus();
    }
  }
}

window.onload = () => {
  generateInputs();
};

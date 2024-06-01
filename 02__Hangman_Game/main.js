//

let letters = "abcdefghijklmnopqrstuvwxyz";
let lettersContainer = document.querySelector(".letters");

createChosenLetters();
function createChosenLetters() {
  let lettersArr = Array.from(letters);
  lettersContainer.innerHTML = "";
  lettersArr.forEach((letter) => {
    let span = document.createElement("span");
    span.append(document.createTextNode(letter));
    span.classList.add("letter-box");

    lettersContainer.append(span);
  });
}

const words = {
  programming: [
    "php",
    "javascript",
    "go",
    "scala",
    "angular",
    "mysql",
    "react",
    "python",
  ],
  clubs: [
    "Liverpool",
    "Manchester City",
    "Barcelona",
    "Chelsea",
    "Newcastle United",
    "Real Madrid",
  ],
  players: ["Mandy", "Kudos", "Kareem Benzema", "Frank", "Gondogan"],
  countries: ["Syria", "Palestine", "Yemen", "Iraq", "Qatar", "Lebanon"],
};

let randomCategory = "",
  randomValue = "";
createRandomCatAndVal();
function createRandomCatAndVal() {
  randomCategory =
    Object.keys(words)[Math.trunc(Math.random() * Object.keys(words).length)];
  randomValue =
    words[randomCategory][
      Math.trunc(Math.random() * words[randomCategory].length)
    ];

  document.querySelector(".category span").innerHTML = randomCategory;
}

let valueArr = [];
createTheTargetLettersSpansAndStart();
function createTheTargetLettersSpansAndStart() {
  valueArr = [...randomValue];
  let container = document.querySelector(".letters-guess");
  container.innerHTML = "";
  valueArr.forEach((letter) => {
    let span = document.createElement("span");
    if (letter === " ") {
      span.classList.add("space");
    }
    container.append(span);
  });

  clickOnLetters();
}

function clickOnLetters() {
  let lettersElements = [...lettersContainer.children];
  lettersElements.forEach((ele) => {
    ele.addEventListener("click", () => {
      ele.classList.add("clicked");

      checkCorrectLetter(ele.innerHTML);
    });
  });
}

function checkCorrectLetter(letter) {
  let spansGuessed = Array.from(
    document.querySelectorAll(".letters-guess span")
  );
  let found = false;
  valueArr.forEach((ele, i) => {
    if (ele.toLowerCase() == letter.toLowerCase()) {
      document.querySelector("audio.success").play();
      spansGuessed[i].innerHTML = ele;
      if (checkToWin(spansGuessed)) {
        win();
      }
      found = true;
    }
  });

  if (!found) {
    document.querySelector("audio.fail").play();
    draw();
  }
}

function draw() {
  let hangmanDraw = document.querySelector(".hangman-draw");
  for (let i = 1; i <= 8; i++) {
    if (!hangmanDraw.classList.contains(`wrong-${i}`)) {
      hangmanDraw.classList.add(`wrong-${i}`);
      break;
    }
  }
  if (hangmanDraw.classList.contains("wrong-8")) {
    lose();
  }
}

function checkToWin(spansGuessed) {
  return spansGuessed.every((ele) => ele.innerHTML != "");
}

function win() {
  document.querySelector("audio.win").play();
  addPopupToBody(`Congratulation`);
}

function lose() {
  document.querySelector("audio.lose").play();
  addPopupToBody(`Game Over<br>The Correct Word:<span> ${randomValue}</span>`);
}

function addPopupToBody(word) {
  let div = document.createElement("div");
  div.classList.add("popup");
  div.innerHTML = `
    ${word} 
    <button>Play Again</button>
  `;
  document.body.prepend(div);
  playAgain();
}

function playAgain() {
  document.querySelector(".popup button").onclick = function () {
    document.querySelectorAll(".letters span").forEach((span) => {
      span.classList.remove("clicked");
    });
    // document.querySelector(".hangman-draw").className = "hangman-draw";
    for (let i = 0; i <= 8; i++) {
      document.querySelector(".hangman-draw").classList.remove(`wrong-${i}`);
    }
    createChosenLetters();
    createRandomCatAndVal();
    createTheTargetLettersSpansAndStart();

    this.parentElement.remove();
  };
}

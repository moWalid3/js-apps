//
document.querySelector(".start-box button").parentElement.classList.add("show");
let duration = 10000;
let numOfQuestions = 10;

let quizBox = document.querySelector(".quiz-box");

document.querySelector(".start-box p .num-q").innerHTML = numOfQuestions;
document.querySelector(".start-box p .duration").innerHTML =
  duration / 1000 + "s";
document
  .querySelector(".start-box button")
  .addEventListener("click", function () {
    this.parentElement.classList.add("finish");

    quizBox.classList.remove("finish");
    quizBox.classList.add("show");
  });

fetch("json/questions.json")
  .then((response) => response.json())
  .then((data) => {
    let questionsObjectsArray = [];

    getRandomObjectsFromData();
    function getRandomObjectsFromData() {
      questionsObjectsArray = [];
      while (questionsObjectsArray.length < numOfQuestions) {
        let randomObj = data[Math.trunc(Math.random() * data.length)];
        if (!questionsObjectsArray.includes(randomObj)) {
          questionsObjectsArray.push(randomObj);
        }
      }
    }

    createQuestions();
    function createQuestions() {
      let questionsBox = document.querySelector(".questions-box");
      questionsBox.innerHTML = "";
      for (let i = 0; i < questionsObjectsArray.length; i++) {
        let question = document.createElement("div");
        if (i === 0) {
          question.classList.add("show");
        }
        question.classList.add("question-content");
        question.innerHTML = `
          <div class="question-and-time">
            <h3 class="question">${questionsObjectsArray[i].question}</h3>
            <div class="time">00:<span>${duration / 1000}</span></div>
          </div>
          <div class="choices">
            <div data-choice="A" class="choice">${
              questionsObjectsArray[i].A
            }</div>
            <div data-choice="B" class="choice">${
              questionsObjectsArray[i].B
            }</div>
            <div data-choice="C" class="choice">${
              questionsObjectsArray[i].C
            }</div>
            <div data-choice="D" class="choice">${
              questionsObjectsArray[i].D
            }</div>
          </div>
        `;
        questionsBox.append(question);
      }
    }

    let counterOfQuestions = 0;
    let questionsElements = Array.from(
      document.querySelectorAll(".question-content")
    );
    let submitBtn = document.querySelector(".quiz-box .submit-btn");

    manageTheFirstQuestion();
    function manageTheFirstQuestion() {
      document.querySelector(".quiz-box .info h2 span").innerHTML =
        counterOfQuestions + 1;

      document
        .querySelector(".start-box button")
        .addEventListener("click", () => {
          // generate tomorrow ==> set time for each ques and solve this Spaghetti Code
          manageTime();

          // add color for the first span
          document
            .querySelectorAll(".info .indicators span")
            [counterOfQuestions].classList.add("active");

          manageChoices();
        });

      manageSubmitClick();
    }

    function manageSubmitClick() {
      submitBtn.addEventListener("click", () => {
        if (counterOfQuestions + 1 == questionsElements.length) {
          // finish
          manageEndBoxAndShowResult();
        } else {
          manageTime();
          manageAndGetNextQuestion();
        }
      });
    }

    function manageTime() {
      let counter = setInterval(() => {
        let span =
          questionsElements[counterOfQuestions].firstElementChild
            .lastElementChild.firstElementChild;

        span.innerHTML = `0${span.textContent - 1}`;
        submitBtn.addEventListener("click", () => clearInterval(counter));
        if (span.innerHTML == "00") {
          submitBtn.click();
          clearInterval(counter);
        }
      }, duration / 10);
    }

    function manageAndGetNextQuestion() {
      // set dynamic number of question and color spans
      document.querySelector(".quiz-box .info h2 span").innerHTML =
        counterOfQuestions + 2;
      document
        .querySelectorAll(".info .indicators span")
        [counterOfQuestions + 1].classList.add("active");

      // get next question
      questionsElements[counterOfQuestions].classList.add("finish");
      questionsElements[counterOfQuestions].classList.remove("show");
      counterOfQuestions++;
      questionsElements[counterOfQuestions].classList.add("show");

      // allow to choose
      manageChoices(questionsElements, counterOfQuestions);
    }

    function manageChoices() {
      let choices = Array.from(
        questionsElements[counterOfQuestions].lastElementChild.children
      );

      choices.forEach((ch) => {
        ch.addEventListener("click", () => {
          choices.forEach((ele) => ele.classList.remove("chosen"));
          ch.classList.add("chosen");
        });
      });
    }

    function manageAnswersAndReturnCountSuccess() {
      let countSuccess = 0;
      questionsElements.forEach((ele, i) => {
        let choices = Array.from(ele.lastElementChild.children);
        let correctAnswer = questionsObjectsArray[i].answer;
        let isThereChosen = false;
        choices.forEach((ch, i) => {
          if (ch.dataset.choice === correctAnswer) {
            ch.classList.add("true");
          }
          if (ch.classList.contains("chosen")) {
            isThereChosen = true;
            if (ch.dataset.choice === correctAnswer) {
              countSuccess++;
              ch.classList.add("true");
            } else {
              ch.classList.add("false");
            }
          } else if (!isThereChosen && i == choices.length - 1) {
            choices.forEach((choice) => {
              if (!choice.classList.contains("true")) {
                choice.classList.add("false");
              }
            });
          }
        });
      });
      return countSuccess;
    }

    function manageEndBoxAndShowResult() {
      // manage end-box
      quizBox.classList.remove("show");
      quizBox.classList.add("finish");
      let endBox = document.querySelector(".end-box");
      endBox.classList.add("show");

      // manage final result
      let countSuccess = manageAnswersAndReturnCountSuccess(questionsElements);
      document.querySelector(".end-box .correct .number").innerHTML =
        countSuccess;
      document.querySelector(".end-box .wrong .number").innerHTML =
        numOfQuestions - countSuccess;

      showResult();
      restartQuiz();
    }
    function showResult() {
      document
        .querySelector(".end-box .btns .show-answers")
        .addEventListener("click", () => {
          let resultBox = document.querySelector(".results-box");
          resultBox.style.display = "block";
          let questionsWithAnswers = document
            .querySelector(".questions-box")
            .cloneNode(true);
          questionsWithAnswers.className = "questions-box-result";
          [...questionsWithAnswers.children].forEach((ele) => {
            ele.className = "question-content-result";
          });

          resultBox.append(questionsWithAnswers);
        });
    }

    function restartQuiz() {
      // document
      //   .querySelector(".end-box .restart")
      //   .addEventListener("click", function () {
      //     let startBtn = document.querySelector(".start-box button");
      //     startBtn.parentElement.classList.remove("finish");
      //     startBtn.parentElement.classList.add("show");
      //     this.parentElement.classList.add("finish");
      //     resetToPlayAgain();
      //   });
    }

    // this function need to fix
    function resetToPlayAgain() {
      // getRandomObjectsFromData();
      // createQuestions();
      // counterOfQuestions = 0;
      // questionsElements = Array.from(
      //   document.querySelectorAll(".question-content")
      // );
      // submitBtn = document.querySelector(".quiz-box .submit-btn");
      // submitBtn.removeEventListener("click", ()=>{});
      // document.querySelectorAll(".info .indicators span").forEach((span) => {
      //   span.classList.remove("active");
      // });
      // manageTheFirstQuestion();
    }
  });

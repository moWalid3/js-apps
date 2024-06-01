//
let duration = 1000;
let blocksContainer = document.querySelector(".memory-game-blocks");
let blocks = [...blocksContainer.children];
let orderRange = [...Array(blocks.length).keys()];

document.querySelector(".control-buttons button").onclick = function () {
  let yourName = this.nextElementSibling.value || "Unknown";
  this.nextElementSibling.setAttribute("value", yourName);
  document.querySelector(".name span").innerHTML = yourName;
  this.parentElement.style.display = "none";
};

shuffle(orderRange);
blocks.forEach((ele, index) => {
  ele.style.order = orderRange[index];
  ele.addEventListener("click", () => {
    flipBlock(ele);
  });
});

function flipBlock(selectedBlock) {
  selectedBlock.classList.add("is-flipped");
  let allFlippedBlocks = blocks.filter((ele) =>
    ele.classList.contains("is-flipped")
  );

  if (allFlippedBlocks.length === 2) {
    manageClicking();
    checkMatching(allFlippedBlocks[0], allFlippedBlocks[1]);
    checkAllMatching();
  }
}

function manageClicking() {
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

function checkMatching(firstBlock, secondBlock) {
  if (firstBlock.dataset.tec === secondBlock.dataset.tec) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
    document.querySelector(".success").play();
  } else {
    let triesEle = document.querySelector(".tries span");
    triesEle.innerHTML = +triesEle.innerHTML + 1;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);
    document.querySelector(".fail").play();
  }
}

function checkAllMatching() {
  let allMatch = blocks.every((ele) => ele.classList.contains("has-match"));
  if (allMatch) {
    document.querySelector(".win").play();
    let control = document.querySelector(".control-buttons");
    control.style.display = "block";
    control.children[0].innerHTML = "Play Again";
    document.querySelector(".tries span").innerHTML = 0;

    shuffle(orderRange);

    blocks.forEach((ele, index) => {
      ele.classList.remove("has-match");
      ele.style.order = orderRange[index];
      ele.addEventListener("click", () => {
        flipBlock(ele);
      });
    });
  }
}

function shuffle(array) {
  let current = array.length;
  let random;

  while (current > 0) {
    random = Math.trunc(Math.random() * current);
    current--;
    [array[current], array[random]] = [array[random], array[current]]; // swap
  }

  return array;
}

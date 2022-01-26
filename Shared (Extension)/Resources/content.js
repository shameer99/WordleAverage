
// callback executed when popup is opened.
function popupShown(popupContainer) {
  const averageGuesses = getAverageGuesses(popupContainer).toFixed(2);
  var averageStatElement = document.createElement("div");
  averageStatElement.classList.add("statistic-container");

  var averageStatValueElement = document.createElement("div")
  averageStatValueElement.classList.add("statistic");
  averageStatValueElement.innerHTML = averageGuesses;
  averageStatElement.appendChild(averageStatValueElement);

  var averageStatLabelElement = document.createElement("div")
  averageStatLabelElement.classList.add("label");
  averageStatLabelElement.innerHTML = "Avg.<br>Guesses"
  averageStatElement.appendChild(averageStatLabelElement);

  popupContainer.querySelector("#statistics").appendChild(averageStatElement);
  waitForPopupToClose().then(() => waitForPopup().then(p => popupShown(p)));
}


function getAverageGuesses(popupContainer) {
  const numGuessesElements = popupContainer.querySelectorAll(".num-guesses");
  var weightedSum = 0;
  var gamesPlayed = 0;
  for (let numGuesses = 1; numGuesses <= 6; numGuesses++) {
    const frequency = parseInt(numGuessesElements[numGuesses - 1].innerText);
    weightedSum += frequency * numGuesses;
    gamesPlayed += frequency;
  }
  return weightedSum / gamesPlayed;
}

function rafAsync() {
  return new Promise(resolve => {
    requestAnimationFrame(resolve); //faster than set time out
  });
}

function waitForPopup() {
  var gameApp = document.querySelector("game-app");
  if (gameApp == null || gameApp.shadowRoot == null) {
    return rafAsync().then(() => waitForPopup());
  }

  var gameStats = gameApp.shadowRoot.querySelector("game-theme-manager #game game-modal game-stats");
  if (gameStats == null || gameStats.shadowRoot == null) {
    return rafAsync().then(() => waitForPopup());
  }

  var popupContainer = gameStats.shadowRoot.querySelector(".container");

  if (popupContainer) {
    return Promise.resolve(popupContainer);
  }
  return rafAsync().then(() => waitForPopup());
}

function waitForPopupToClose() {
  var gameApp = document.querySelector("game-app");
  if (gameApp == null || gameApp.shadowRoot == null) {
    return Promise.resolve();
  }

  var gameStats = gameApp.shadowRoot.querySelector("game-theme-manager #game game-modal game-stats");
  if (gameStats == null || gameStats.shadowRoot == null) {
    return Promise.resolve();
  }

  var popupContainer = gameStats.shadowRoot.querySelector(".container");

  if (popupContainer) {
    return rafAsync().then(() => waitForPopupToClose());
  }
  return Promise.resolve();
}

waitForPopup().then(p => popupShown(p));
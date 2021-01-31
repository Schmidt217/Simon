// sets variables for each button

const h3 = $('h3');
const arrowUp = $('#btn-up');
const arrowLeft = $('#btn-left');
const arrowDown = $('#btn-down');
const arrowRight = $('#btn-right');
const repeatPatternBtn = $('#repeat-pattern-btn');

//loads the audio files and sets the variables

const audioUp = new Audio(`/sounds/arrow-up.mp3`);
const audioLeft = new Audio(`/sounds/arrow-left.mp3`);
const audioDown = new Audio(`/sounds/arrow-down.mp3`);
const audioRight = new Audio(`/sounds/arrow-right.mp3`);
const audioError = new Audio(`/sounds/wrong.mp3`);

//beginning of the game, empty array pattern

let pattern = [];
let userPositionInPattern = 0;

//Looks for direction on either mouse click or keydown, sets variable of direction

function getDirectionFromInput(data) {
  let direction = undefined;
  switch (data) {
    case 38:
    case 'btn-up': {
      direction = 'up';
      break;
    }
    case 37:
    case 'btn-left': {
      direction = 'left';
      break;
    }
    case 40:
    case 'btn-down': {
      direction = 'down';
      break;
    }
    case 39:
    case 'btn-right': {
      direction = 'right';
      break;
    }
    default: {
      console.error(`Idk what this is: ${data}`);
    }
  }
  return direction;
}

//assigns a random number to each direction; generates random number thereby making a random direction

function generateRandomDirection() {
  const number = Math.random();
  let key = 'left';
  if (number <= 0.25) {
    key = 'up';
  }
  if (number > 0.25 && number <= 0.5) {
    key = 'left';
  }
  if (number > 0.5 && number <= 0.75) {
    key = 'down';
  }
  if (number > 0.75) {
    key = 'right';
  }
  return key;
}

//uses the variable of direction from above and animates the button for 150 ms and plays sound from the corresponding button

function emphasizeKeyPress(direction) {
  switch (direction) {
    case 'up': {
      arrowUp.addClass('pressed');
      audioUp.currentTime = 0;
      audioUp.play();
      setTimeout(() => {
        arrowUp.removeClass('pressed');
      }, 150);
      break;
    }
    case 'left': {
      arrowLeft.addClass('pressed');
      audioLeft.currentTime = 0;
      audioLeft.play();
      setTimeout(() => {
        arrowLeft.removeClass('pressed');
      }, 100);
      break;
    }
    case 'down': {
      arrowDown.addClass('pressed');
      audioDown.currentTime = 0;
      audioDown.play();
      setTimeout(() => {
        arrowDown.removeClass('pressed');
      }, 100);
      break;
    }
    case 'right': {
      arrowRight.addClass('pressed');
      audioRight.currentTime = 0;
      audioRight.play();
      setTimeout(() => {
        arrowRight.removeClass('pressed');
      }, 100);
      break;
    }
  }
}

//confused about this one. It makes an array of the play pattern but I'm not sure what the timeout does.

function playPattern(array) {
  const interval = 333 * 1/(array.length * 0.2);
  for (let i = 0; i < array.length; ++i) {
    setTimeout(() => {
      emphasizeKeyPress(array[i]);
    }, (i + 1) * interval);
  }
}

//This changes the level of h3 to the length of the pattern array.It calls on the generateRandomDirection function and pushes it into the pattern array thereby making the next sequence.

function incrementLevel() {
  h3.text(`Level ${pattern.length}`);
  const direction = generateRandomDirection();
  pattern.push(direction);
  patternIndex = 0;
  setTimeout(() => {
    playPattern(pattern);
  }, 500);
}

//sees if the direction clicked or pressed equals the pattern that the computer randomly generated.

function isInputCorrect(direction) {
  return direction === pattern[patternIndex];
}

//This shows the game over error. Resets the pattern array. Note: gave over at level should be pattern.length -1 to be at the correct level, otherwise it adds one level to the game over.

function showGameOver() {
  audioError.currentTime = 0;
  audioError.play();
  $(document.body).addClass('game-over');
  h3.html(`Game over at level ${pattern.length - 1}!<br/>Select any direction to start over.`);
  pattern = [];
}

//shows what happens when a level is completed; adds level-completed class for 250 ms

function showLevelCompleted() {
  $(document.body).addClass('level-completed');
  setTimeout(() => {
    $(document.body).removeClass('level-completed');
  }, 250);
}

//calls showGameOver if isInputCorrect is not correct, if it is correct with the correct number of inputs in shows level completed then calls on incrementLevel to advance in the game. I don't understand why 'return' is at the end of every if statement.

//Not sure what patternIndex += 1 does; does it increase the pattern index ny 1? and if it does why not write paternIndex++ ?

function registerSelection(direction) {
  emphasizeKeyPress(direction);

  if (pattern.length === 0) {
    $(document.body).removeClass('game-over');
    showLevelCompleted();
    pattern = [direction];
    incrementLevel();
    return;
  }

  const correct = isInputCorrect(direction);
  if (!correct) {
    showGameOver();
    return;
  }

  if (pattern.length - 1 === patternIndex) {
    showLevelCompleted();
    incrementLevel();
    return;
  }

  patternIndex += 1;
}

//These two link the button ID to get the direction button or keydown pressed and runs it through the registeredSelection function. I have never seen .which before but I'm guess it is selection which key was pressed?

$('.btn').click(function (e) {
  const htmlId = $(this).attr('id');
  const direction = getDirectionFromInput(htmlId);
  if (direction) {
    registerSelection(direction);
  }
});

$(document).on('keydown', function (e) {
  const keyId = e.which;
  const direction = getDirectionFromInput(keyId);
  if (direction) {
    registerSelection(direction);
  }
});

//This repeats the playPatter when pushing the button at the end. I added disabling the button after two clicks. Clicking it plays the pattern of the current level (pattern)

let count = 0
repeatPatternBtn.click(function () {
    if(count < 2){
        count ++;
        playPattern(pattern);
    }else{
        repeatPatternBtn.disabled=true;
        alert("You can only use this button twice!")
    }
});
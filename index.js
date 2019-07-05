var parentElement = document.getElementById('wrapper');
var allImages = ['img/dog1.jpg', 'img/dog2.jpg', 'img/dog3.jpg', 'img/dog4.jpg', 'img/dog5.jpg', 'img/dog6.jpg', 'img/dog7.jpg', 'img/dog8.jpg'];
var levels = {
  'easy': {
    'pairs': 4,
    'attempts': 8
  },
  'medium': {
    'pairs': 6,
    'attempts': 10
  },
  'hard': {
    'pairs': 8,
    'attempts': 12
  }
};
var buttons = document.querySelectorAll(".buttonLevel");
var easyButton = document.querySelector(".easy");
var mediumButton = document.querySelector(".medium");
var hardButton = document.querySelector(".hard");
var restart = document.querySelector(".newGame");
var pairs = document.querySelector(".matches");
var attempts = document.querySelector(".attempts");
var left = document.querySelector(".counter span");
var scoreSpan = document.querySelector(".score span");
var body = document.querySelector('body');
var img2src = 'img/cover.jpg';
var submessage = 'Click anywhere to continue';
var winMessage = 'Congratulations';
var loseMessage = 'Sorry. Try again';
var activeLevel = '#ad2727';
var inactiveLevels = 'grey';


var currentLevel = 'medium';
var images = allImages.slice(0, levels[currentLevel].pairs)
var board;
var tiles;
var leftCounter = levels[currentLevel].attempts;
var score = 0;
var wasClicked = false;
var firstTile, secondTile;
var lockBoard = false;

createAll();

buttons.forEach(function(btn) {
  btn.addEventListener("click", function(e) {
    buttons.forEach(function(btn) {
      btn.style.background = inactiveLevels;
    });
    this.style.background = activeLevel;
    currentLevel = e.target.dataset.level;
    console.log(currentLevel);
    images = allImages.slice(0, levels[currentLevel].pairs);
    updateTitle(levels[currentLevel].pairs, levels[currentLevel].attempts);
    resetBoard();
    createAll();
  })
})

restart.addEventListener("click", createAll);

function addFlip() {
  tiles.forEach(function(tile) {
    tile.addEventListener("click", flip);
  })
}

function resetCounters() {
  score = 0;
  scoreSpan.innerText = score;
  leftCounter = levels[currentLevel].attempts;
  updateSubtitle();
}

function addScore() {
  score++;
  scoreSpan.innerText = score;
}

function calcTiles() {
  return tiles = images.concat(images);
}

function updateTitle(pair, attempt) {
  pairs.innerText = pair;
  attempts.innerText = attempt;
}

function updateSubtitle() {
  left.innerText = leftCounter;
}

function decreaseAttempts() {
  leftCounter--;
  updateSubtitle();
}

function disableTilesAddScore() {
  firstTile.removeEventListener("click", flip);
  secondTile.removeEventListener("click", flip);
  resetBoard();
  addScore();
};

function resetBoard() {
  [lockBoard, wasClicked] = [false, false];
  [firstTile, secondTile] = [null, null];
}

function flip() {
  if (lockBoard === true) {
    return;
  }
  if (this === firstTile) {
    return;
  }
  this.classList.add('flip');
  if (!wasClicked) {
    wasClicked = true;
    firstTile = this;
  } else {
    wasClicked = false;
    secondTile = this;
    check();
  }
}

function unflipAll() {
  tiles.forEach(function(tile) {
    tile.classList.remove('flip');
  })
}

function unflipTiles() {
  if (firstTile) {
    firstTile.classList.remove("flip");
    secondTile.classList.remove("flip");
    if (leftCounter > 0) {
      setTimeout(resetBoard, 400);
    }
  }
}

function check() {
  decreaseAttempts();
  lockBoard = true;
  if (firstTile.firstChild['src'] == secondTile.firstChild['src']) {
    disableTilesAddScore();
    if (score == levels[currentLevel].pairs) {
      setTimeout(createPopUp, 400, winMessage);
    }
  } else {
    setTimeout(unflipTiles, 600);
  }
  if (leftCounter == 0 && score != levels[currentLevel].pairs) {
    setTimeout(createPopUp, 400, loseMessage);
  }
}

function createPopUp(message) {
  lockBoard = true;
  popUp = document.createElement('DIV');
  popUp.classList.add('popUp');
  popUp.innerHTML = '<h2 class=\'message\'>' + message + '<br><span class=\'submessage\'>' + submessage + '</span></h2>';
  body.appendChild(popUp);
  popUp.addEventListener("click", function() {
    this.remove();
  })
}

// board manipulation
function createAll() {
  if (board != undefined) {
    removeAll()
  };
  calcTiles();
  shuffle();
  board = document.createElement('div');
  board.classList.add('board');
  parentElement.appendChild(board);
  tiles.forEach(function(source) {
    var div = document.createElement('div');
    div.classList.add('tile');
    board.appendChild(div);
    var img = document.createElement('img');
    img.classList.add('front');
    img['src'] = source;
    var img2 = document.createElement('img');
    img2.classList.add('back');
    img2['src'] = img2src;
    var appendImg = div.appendChild(img);
    var appendImg2 = div.appendChild(img2);
  });
  tiles = document.querySelectorAll('.tile');
  resetCounters()
  resetBoard();
  addFlip();
}

function removeAll() {
  board.remove();
  board = undefined;
}

function shuffle() {
  var currentIndex = tiles.length;
  var randomIndex;
  var tempValue;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    tempValue = tiles[currentIndex];
    tiles[currentIndex] = tiles[randomIndex];
    tiles[randomIndex] = tempValue;
  }
  return tiles;
}

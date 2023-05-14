const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// getContext() method will return a drawing context of canvas, which is CanvasRenderingContext2D interface (part of Canvas API).
// a drawing context can be used to draw objects on canvas.
const unit = 20;
const row = canvas.height / unit; // 320 / 20 = 16
const column = canvas.width / unit; // 320 / 20 = 16

let snake = [];
// each element in an array is an object.
// an object records snake body's x an y coordinations.

// initiate snake body
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overLapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overLapping = true;
          //   console.log("overlapping");
          return;
        } else {
          overLapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      //   console.log("Possible new position: ", new_x, new_y);
      checkOverlap(new_x, new_y);
    } while (overLapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// initial settings
createSnake();
let newFruit = new Fruit();

window.addEventListener("keydown", changeDirection);

let d = "Right"; // deault direction is right.

function changeDirection(e) {
  //   console.log(e);
  if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  }

  // to avoid changing direction 180˚ quickly between each FPS, e.g. d = righ -> up -> left; snake can eat itself.
  // program doesn't allow any keydown event untill next draw() is invoked.
  // this concept can prevent the failure from snake's logical suicide.
  window.removeEventListener("keydown", changeDirection);
}

let scores = 0;
let highestScore;
loadHighestScore(); // inital score
document.getElementById("score").innerHTML = "Scores: " + scores;
document.getElementById("highestScore").innerHTML =
  "Highest Scores: " + highestScore;

function draw() {
  // Checking snake eats itself or not
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(Game);
      alert("Game over!");
      return;
    }
  }

  // setting the canvas backgroud in black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Drawing Fruit
  newFruit.drawFruit();

  // Drawing snake
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";

    // setting snake can pass through the walls
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    // x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // filled background
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); // border
  }

  // Use current direction 'd' to decide the next movement placed at which coordination.
  let snakeX = snake[0].x; // snake[0] is an object, but snake[0].x is a number.
  let snakeY = snake[0].y;
  switch (d) {
    case "Left":
      snakeX -= unit;
      break;
    case "Up":
      snakeY -= unit;
      break;
    case "Right":
      snakeX += unit;
      break;
    case "Down":
      snakeY += unit;
      break;
    default:
      break;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // check snake eats a fruit
  if (snake[0].x == newFruit.x && snake[0].y == newFruit.y) {
    newFruit.pickALocation(); // re-draw a fruit at random position
    scores++; // renew scores
    setHighestScore(scores);
    document.getElementById("score").innerHTML = "Scores: " + scores;
    document.getElementById("highestScore").innerHTML =
      "Highest Scores: " + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let Game = setInterval(draw, 100); // execute draw function per 0.1s

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}

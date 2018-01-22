/* 
 Justin VanderBerg
 December 19, 2017
 This is a snake game
 */
var canvas = document.getElementById("myCanvas");
var ctx;
var mainUser;
var food;
hasMoved = true;
//function to draw a rectangle, often used for background of canvas
//or the scene
function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}
Snake = function (squareSize) {
    this.xPos = [300];
    this.yPos = [300];
    this.size = squareSize;
    this.xSpeed = 20;
    this.ySpeed = 0;
    this.numLoops = 0;
    this.hit = false;
    this.untilLoop = 6;
};
Snake.prototype.drawSnake = function () {
    ctx.lineWidth = 1;
    for (var i = 0; i < this.xPos.length; i++) {
        ctx.fillStyle = "#FF0000";
        rect(this.xPos[i], this.yPos[i], this.size, this.size);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(this.xPos[i], this.yPos[i], this.size, this.size);
    }
};
Snake.prototype.addLength = function () {
    if (this.ySpeed > 0 && this.xSpeed === 0) {
        this.yPos[this.yPos.length] = this.yPos[this.yPos.length - 1] + this.size;
        this.xPos[this.xPos.length] = this.xPos[this.xPos.length - 1];
    } else if (this.ySpeed < 0 && this.xSpeed === 0) {
        this.yPos[this.yPos.length] = this.yPos[this.yPos.length - 1] - this.size;
        this.xPos[this.xPos.length] = this.xPos[this.xPos.length - 1];
    } else if (this.xSpeed > 0 && this.ySpeed === 0) {
        this.xPos[this.xPos.length] = this.xPos[this.xPos.length - 1] + this.size;
        this.yPos[this.yPos.length] = this.yPos[this.yPos.length - 1];
    } else if (this.xSpeed < 0 && this.ySpeed === 0) {
        this.xPos[this.xPos.length] = this.xPos[this.xPos.length - 1] - this.size;
        this.yPos[this.yPos.length] = this.yPos[this.yPos.length - 1];
    }
    if (this.xPos.length > 10) {
        this.untilLoop = 5;
    } else if (this.xPos.length > 20) {
        this.untilLoop = 4;
    }
};
Snake.prototype.moveLength = function () {
    var origLength = this.xPos.length;
    for (var i = origLength - 1; i > 0; i--) {
        this.xPos[i] = this.xPos[i - 1];
        this.yPos[i] = this.yPos[i - 1];
    }
    this.xPos[0] += this.xSpeed;
    this.yPos[0] += this.ySpeed;
    hasMoved = true;
};
Snake.prototype.checkDeath = function () {
    for (var i = 0; i < this.xPos.length; i++) {
        for (var j = 0; j < this.xPos.length; j++) {
            if (j !== i) {
                if (this.xPos[i] === this.xPos[j] && this.yPos[i] === this.yPos[j]) {
                    this.hit = true;
                }
            }
        }
    }
    if (this.xPos[0] < 0 || this.xPos[0] >= 1000) {
        this.hit = true;
    }
    if (this.yPos[0] < 0 || this.yPos[0] >= 560) {
        this.hit = true;
    }
};
Snake.prototype.directionMoving = function (xSpeed, ySpeed) {
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
};
Snake.prototype.drawFood = function () {
    ctx.fillStyle = "#FFFFFF";
    rect(this.foodX, this.foodY, this.size, this.size);
};
Snake.prototype.getNewFood = function () {
    food = true;
    var oldFoodX = this.foodX, oldFoodY = this.foodY;
    this.foodX = (Math.floor(Math.random() * 50)) * 20;
    this.foodY = (Math.floor(Math.random() * 28)) * 20;
    while (this.foodX === oldFoodX && this.foodY === oldFoodY) {
        this.foodX = (Math.floor(Math.random() * 50)) * 20;
        this.foodY = (Math.floor(Math.random() * 28)) * 20;
    }
    //check if placing block on snake
    for (var i = 0; i < this.xPos.length; i++) {
        while (this.foodX === this.xPos[i] && this.foodY === this.yPos[i]) {
            this.foodX = (Math.floor(Math.random() * 50)) * 20;
            this.foodY = (Math.floor(Math.random() * 28)) * 20;
            i = 0;
        }
    }
};
Snake.prototype.eatFood = function () {
    if (this.xPos[0] === this.foodX) {
        if (this.yPos[0] === this.foodY) {
            mainUser.addLength();
            food = false;
        }
    }
};
Snake.prototype.shouldMove = function () {
    this.numLoops += 1;
    if (this.numLoops === this.untilLoop) {
        this.numLoops = 0;
        return true;
    } else {
        return false;
    }
};
function instructionButton() {
    window.alert("User \"wasd\" keys to move. Avoid hitting the walls, as well as yourself. Try to collect the white food squares");
}
function startGame() {
    mainUser = new Snake(20);
    var x = document.getElementsByClassName("buttonStart");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "block";
    }
    food = false;
    window.removeEventListener("keydown", keyPressed, false);
    ctx = canvas.getContext("2d");
    HEIGHT = ctx.canvas.height;
    WIDTH = ctx.canvas.width;
    ctx.fillStyle = "#000000";
    rect(0, 0, WIDTH, HEIGHT);
    document.title = "Snake";
    //Draw the title of the document
    ctx.fillStyle = "#76EE00"; //green
    //draw text
    ctx.font = "100px Verdana";
    ctx.fillText("SNAKE", 310, 100);
    mainUser.directionMoving(20, 0);
}
function startButton() {
    var x = document.getElementsByClassName("buttonStart");
    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    window.addEventListener("keydown", keyPressed, false);
    requestAnimationFrame(gameLoop);
}
function animation() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#000000";
    rect(0, 0, WIDTH, HEIGHT);
    if (mainUser.shouldMove()) {
        mainUser.checkDeath();
        mainUser.eatFood();
        mainUser.moveLength();
    }
    mainUser.drawSnake();
    mainUser.drawFood();
}
//Function to deal with any key presses
function keyPressed(evt) {
    if (evt.key === "w" && mainUser.ySpeed <= 0 && hasMoved === true) {
        hasMoved = false;
        console.log("Moving up");
        mainUser.directionMoving(0, -20);
    } else if (evt.key === "a" && mainUser.xSpeed <= 0 && hasMoved === true) {
        hasMoved = false;
        mainUser.directionMoving(-20, 0);
    } else if (evt.key === "d" && mainUser.xSpeed >= 0 && hasMoved === true) {
        hasMoved = false;
        mainUser.directionMoving(20, 0);
    } else if (evt.key === "s" && mainUser.ySpeed >= 0 && hasMoved === true) {
        mainUser.directionMoving(0, 20);
        hasMoved = false;

    }
}
function gameLoop() {
    if (mainUser.hit) {
        startGame();
    } else {
        animation();
        if (food === false) {
            mainUser.getNewFood();
        }
        requestAnimationFrame(gameLoop);
    }

}
window.addEventListener("load", startGame, false);
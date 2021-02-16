// the size of one snake ceil
const CEIL_SIZE = 20;

// canvas width and height
const WIDTH = CEIL_SIZE * 40, HEIGHT = CEIL_SIZE * 30;

// initial size of the snake
const INITIAL_SNAKE_SIZE = 5;

// get canvas and 2d context
let canvas = document.querySelector('#gameField');
let ctx = canvas.getContext('2d');

// game score
let score = 0;
let scoreText = document.querySelector('#scoreNumber');

// set canvas width and height
canvas.width = WIDTH;
canvas.height = HEIGHT;

// create the snake
let snake = [];

// create apple
let apple = {x: 0, y: 0}

// snake velocity
let dx, dy;

// keyboard input
document.addEventListener('keydown', updateInput);
document.addEventListener('keydown', function(){
    if(newGame){
        newGame = false;
        changeGameText();
        update();
    }
});

let newGame = true;
let isOver = false;
let changingDirection = false;

main();

// FUNCTIONS

function drawSnakeHead(){
    // set yellow color
    ctx.fillStyle = '#FFFF00';
    ctx.strokeStyle = '#888800';

    // draw the head
    ctx.fillRect(snake[0].x, snake[0].y, CEIL_SIZE, CEIL_SIZE);
    ctx.strokeRect(snake[0].x, snake[0].y, CEIL_SIZE, CEIL_SIZE);
}

function drawSnake(){
    // set appropriate colors
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';

    // draw all ceils except head
    for(let i = 1; i < snake.length; i++){
        
        ctx.fillRect(snake[i].x, snake[i].y, CEIL_SIZE, CEIL_SIZE);
        ctx.strokeRect(snake[i].x, snake[i].y, CEIL_SIZE, CEIL_SIZE);
    }

    drawSnakeHead();
}

function updateSnake(){
    // new head position
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // if snake is out of bounds, restart the game
    if(head.x >= WIDTH || head.x < 0 || head.y >= HEIGHT || head.y < 0)
    {
        gameOver();
        return;
    }

    // push new head and pop tail
    // in other words, move the snake
    snake.unshift(head);

    if(head.x === apple.x && head.y === apple.y){
        addScore();
        spawnApple();
    }else{
        snake.pop();
    } 
}

function clearCanvas(){
    ctx.fillStyle = '#afa';
    ctx.strokeStyle = 'black';

    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeRect(0, 0, WIDTH, HEIGHT);
}

function main(){
    clearCanvas();
    initializeGame();
    draw();
}

function update(){
    if(!newGame && !isOver){
        setTimeout(function(){
            // main game loop
            changingDirection = false;
            clearCanvas();
            updateSnake();
            checkSnakeCollision();
            draw();

            // we are calling the same function again and again(looping)
            update();
        }, 100);
    }
}

function draw(){
    drawSnake();
    drawApple();
}

function updateInput(event){
    // if we are changind direction already, return
    if(changingDirection)
     return;

    changingDirection = true;

    // arrow keys code
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
    // pressed key code
    const key = event.keyCode;
    
    // determine direction
    const up = dy === -CEIL_SIZE;
    const down = dy === CEIL_SIZE;
    const right = dx === CEIL_SIZE;
    const left = dx === -CEIL_SIZE;

    // update velocity
    if(key === RIGHT_KEY && !left){
        dx = CEIL_SIZE;
        dy = 0;
    }

    if(key === LEFT_KEY && !right){
        dx = -CEIL_SIZE;
        dy = 0;
    }

    if(key === UP_KEY && !down){
        dy = -CEIL_SIZE;
        dx = 0;
    }

    if(key === DOWN_KEY && !up){
        dy = CEIL_SIZE;
        dx = 0;
    }
}

function initializeGame(){
    // initialize the snake
    for(let i = 0; i < INITIAL_SNAKE_SIZE; i++)
        snake.push({x: 40 + i*CEIL_SIZE, y: 60});

    spawnApple();

    dx = 0, dy = CEIL_SIZE;
    score = 0;
    if(!newGame)
    scoreText.textContent = score.toString();
}

function addScore(){
    score += 10;
    scoreText.textContent = score.toString();
}

function spawnApple(){
    let x = Math.floor((Math.random() * WIDTH / CEIL_SIZE)) * CEIL_SIZE;
    let y = Math.floor((Math.random() * HEIGHT / CEIL_SIZE)) * CEIL_SIZE;

    apple.x = x;
    apple.y = y;
}

function drawApple(){
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'lightred'

    ctx.fillRect(apple.x, apple.y, CEIL_SIZE, CEIL_SIZE);
    ctx.strokeRect(apple.x, apple.y, CEIL_SIZE, CEIL_SIZE);
}

function changeGameText(){
    let text = document.querySelector('#score');
    text.textContent = 'Score: ';
    scoreText.textContent = score.toString();
    text.appendChild(scoreText);
}

function checkSnakeCollision(){
    let head = snake[0];
    for(let i = 3; i < snake.length; i++){
        // if head hits one of the snake pieces, the game is over
        if(head.x == snake[i].x && head.y == snake[i].y){
            gameOver();
        }
    }
}

function gameOver(){
    isOver = true;
    let text = document.querySelector('#score');
    text.innerHTML = "Game is over. Press <span class='redText'>Ctrl + R</span> to restart. Final score: ";
    text.appendChild(scoreText);
}
// the size of one snake ceil
const CEIL_SIZE = Math.ceil(window.innerWidth / 78);//Math.floor(window.innerWidth / 78);

const wCeilNumber = Math.floor((window.innerWidth / CEIL_SIZE) / 1.5);
const hCeilNumber = Math.floor((window.innerHeight / CEIL_SIZE) / 1.3);

// canvas width and height
const WIDTH = CEIL_SIZE * wCeilNumber;
const HEIGHT = CEIL_SIZE * hCeilNumber;

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

let newGame = true;
let isOver = false;
let changingDirection = false;

// PROGRAM START
resizeText();
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

    // if snake ate apple, add score and spawn new apple
    if(head.x === apple.x && head.y === apple.y){
        addScore();
        spawnApple();
    }else{
        snake.pop();
    } 
}

function clearCanvas(){
    ctx.fillStyle = '#aaa';
    ctx.strokeStyle = '#444';

    // draw the grid
    for(let i = 0; i < hCeilNumber; i++){
        for(let j = 0; j < wCeilNumber; j++){
            ctx.fillRect(j * CEIL_SIZE, i * CEIL_SIZE, CEIL_SIZE, CEIL_SIZE);
            ctx.strokeRect(j * CEIL_SIZE, i * CEIL_SIZE, CEIL_SIZE, CEIL_SIZE);
        }
    }
}

function main(){
    clearCanvas();
    initializeGame();
    draw();

    // keyboard input
    document.addEventListener('keydown', updateInput);
    
    // asks to press any key to start the game
    document.addEventListener('keydown', function(){
    if(newGame){
        newGame = false;
        changeGameText();
        update();
    }
});
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
    const ARROW_LEFT_KEY = 37;
    const ARROW_RIGHT_KEY = 39;
    const ARROW_UP_KEY = 38;
    const ARROW_DOWN_KEY = 40;

    // WASD keys
    const W = 87;
    const A = 65;
    const S = 83;
    const D = 68;
    
    // pressed key code
    const key = event.keyCode;
    
    // determine direction
    const up = dy === -CEIL_SIZE;
    const down = dy === CEIL_SIZE;
    const right = dx === CEIL_SIZE;
    const left = dx === -CEIL_SIZE;

    // update velocity
    if((key === ARROW_RIGHT_KEY || key === D) && !left){
        dx = CEIL_SIZE;
        dy = 0;
    }

    if((key === ARROW_LEFT_KEY || key === A) && !right){
        dx = -CEIL_SIZE;
        dy = 0;
    }

    if((key === ARROW_UP_KEY || key === W) && !down){
        dy = -CEIL_SIZE;
        dx = 0;
    }

    if((key === ARROW_DOWN_KEY || key === S) && !up){
        dy = CEIL_SIZE;
        dx = 0;
    }
}

function initializeGame(){
    spawnSnake();
    spawnApple();

    score = 0;
    if(!newGame)
        scoreText.textContent = score.toString();
}

function addScore(){
    // add score and change text
    score += 10;
    scoreText.textContent = score.toString();
}

function spawnApple(){
    // randomize x and y coordinates
    let x = Math.floor((Math.random() * WIDTH / CEIL_SIZE)) * CEIL_SIZE;
    let y = Math.floor((Math.random() * HEIGHT / CEIL_SIZE)) * CEIL_SIZE;

    apple.x = x;
    apple.y = y;
}

function drawApple(){
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred'

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

// if game is over
function gameOver(){
    isOver = true;

    // set the game over text
    let text = document.querySelector('#score');
    text.innerHTML = "Game is over. Press <span class='redText'>Ctrl + R</span> to restart. Final score: ";
    text.appendChild(scoreText);
}

// spawns snake
function spawnSnake(){
    // spawn snake according to the x coordinates
    let spawnX = (x, y) => {
        for(let i = 0; i < INITIAL_SNAKE_SIZE; i++)
        snake.push({x: x + i*CEIL_SIZE, y: y});
        dx = -CEIL_SIZE;
        dy = 0;
    };

    // spawn snake according to the y coordinates
    let spawnY = (x, y) => {
        for(let i = 0; i < INITIAL_SNAKE_SIZE; i++)
            snake.push({x: x, y: y - i*CEIL_SIZE});
        dx = 0;
        dy = CEIL_SIZE;
    };

    // tries to randomize suitable x and y coordinates
    let trySpawn = function(){
        // randomize x and y coordinates
        let x = Math.floor(Math.random() * WIDTH / CEIL_SIZE) * CEIL_SIZE;
        let y = Math.floor(Math.random() * HEIGHT / CEIL_SIZE) * CEIL_SIZE;

        // success randomization booleans
        let xsuccess = false, ysuccess = false;

        // if x coordinate allow to fit the snake, set x success to true
        if(x > CEIL_SIZE*INITIAL_SNAKE_SIZE &&
             x < WIDTH - CEIL_SIZE * INITIAL_SNAKE_SIZE)
            xsuccess = true;
        
        // if y coordinate allow to fit the snake, set y success to true
        if(y > CEIL_SIZE*INITIAL_SNAKE_SIZE &&
             y < HEIGHT - CEIL_SIZE * INITIAL_SNAKE_SIZE)
            ysuccess = true;
        
        // if randomization is not successfull, return false
        if(!xsuccess && !ysuccess){
            return false;
        }
        // if x and y are success
        else if(xsuccess && ysuccess){
            // randomize in which direction to push snake(x or y)
            let direction = Math.floor(Math.random() * 2);
            // spawn snake according to randomized direction
            if(direction == 0){
                spawnX(x, y);
            }else{
                spawnY(x, y);
            }
        }
        // if there is only x success, spawn snake according to the x coordinates
        else if(xsuccess){
            spawnX(x, y);
        }
        // if there is only y success, spawn snake according to the y coordinates
        else{
            spawnY(x, y);
        }
        return true;
    }

    // try to spawn snake whlie proper place will not be found
    let success = false;
    while(!success){
        success = trySpawn();
    }
}

// resizes texts according to the window size
function resizeText(){
    document.querySelector('#title').style = 'font-size: ' + Math.floor(window.innerHeight / 100 * 6).toString() + 'px;';

    document.querySelector('#score').style = 'font-size: ' + Math.floor(window.innerHeight / 100 * 4).toString() + 'px;';
    
    document.querySelector('#creator').style = 'font-size: ' + Math.floor(window.innerHeight / 100 * 2).toString() + 'px;';
}
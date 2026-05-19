const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const countdownText = document.getElementById("countdown");

const gameOverModal = document.getElementById("gameOverModal");
const finalScore = document.getElementById("finalScore");

const bestScoreText = document.getElementById("bestScore");

const difficultySelect =
    document.getElementById("difficulty");

const box = 20;

let snake = [
    { x: 200, y: 200 }
];

let direction = "RIGHT";

let food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
};

let score = 0;

let bestScore =
    localStorage.getItem("bestScore") || 0;

bestScoreText.innerHTML =
    "Meilleur score : " + bestScore;

let speed = 400;
let speedIncrease = 1;

let game;

let isPaused = false;

document.addEventListener(
    "keydown",
    changeDirection
);

function changeDirection(event) {

    if (
        event.key === "ArrowLeft" &&
        direction !== "RIGHT"
    ) {
        direction = "LEFT";
    }

    else if (
        event.key === "ArrowUp" &&
        direction !== "DOWN"
    ) {
        direction = "UP";
    }

    else if (
        event.key === "ArrowRight" &&
        direction !== "LEFT"
    ) {
        direction = "RIGHT";
    }

    else if (
        event.key === "ArrowDown" &&
        direction !== "UP"
    ) {
        direction = "DOWN";
    }
}

function setDifficulty() {

    const difficulty =
        difficultySelect.value;

    // FACILE
    if (difficulty === "easy") {

        speed = 400;

        speedIncrease = 1;
    }

    // MOYEN
    else if (difficulty === "medium") {

        speed = 250;

        speedIncrease = 2;
    }

    // DIFFICILE
    else if (difficulty === "hard") {

        speed = 150;

        speedIncrease = 4;
    }
}

function draw() {

    ctx.fillStyle = "black";

    ctx.fillRect(0, 0, 400, 400);

    // Nourriture
    ctx.fillStyle = "red";

    ctx.fillRect(
        food.x,
        food.y,
        box,
        box
    );

    // Snake
    for (let i = 0; i < snake.length; i++) {

        // Tête
        if (i === 0) {

            ctx.fillStyle = "#00ff99";

            ctx.beginPath();

            ctx.roundRect(
                snake[i].x,
                snake[i].y,
                box,
                box,
                6
            );

            ctx.fill();

            // Yeux
            ctx.fillStyle = "white";

            let eye1X = snake[i].x + 5;
            let eye1Y = snake[i].y + 6;

            let eye2X = snake[i].x + 13;
            let eye2Y = snake[i].y + 6;

            // Direction des yeux
            if (direction === "LEFT") {

                eye1X = snake[i].x + 5;
                eye2X = snake[i].x + 5;

                eye1Y = snake[i].y + 5;
                eye2Y = snake[i].y + 13;
            }

            if (direction === "RIGHT") {

                eye1X = snake[i].x + 15;
                eye2X = snake[i].x + 15;

                eye1Y = snake[i].y + 5;
                eye2Y = snake[i].y + 13;
            }

            if (direction === "UP") {

                eye1X = snake[i].x + 5;
                eye2X = snake[i].x + 13;

                eye1Y = snake[i].y + 5;
                eye2Y = snake[i].y + 5;
            }

            if (direction === "DOWN") {

                eye1X = snake[i].x + 5;
                eye2X = snake[i].x + 13;

                eye1Y = snake[i].y + 15;
                eye2Y = snake[i].y + 15;
            }

            ctx.beginPath();

            ctx.arc(
                eye1X,
                eye1Y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.beginPath();

            ctx.arc(
                eye2X,
                eye2Y,
                2,
                0,
                Math.PI * 2
            );

            ctx.fill();

        } else {

            // Corps
            ctx.fillStyle = "#00cc66";

            ctx.beginPath();

            ctx.roundRect(
                snake[i].x,
                snake[i].y,
                box,
                box,
                4
            );

            ctx.fill();
        }
    }

    // Queue
    const tail =
        snake[snake.length - 1];

    ctx.fillStyle = "#00994d";

    ctx.beginPath();

    ctx.arc(
        tail.x + box / 2,
        tail.y + box / 2,
        box / 4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Déplacement
    if (direction === "LEFT")
        snakeX -= box;

    if (direction === "UP")
        snakeY -= box;

    if (direction === "RIGHT")
        snakeX += box;

    if (direction === "DOWN")
        snakeY += box;

    // Nourriture
    if (
        snakeX === food.x &&
        snakeY === food.y
    ) {

        score++;

        scoreText.innerHTML =
            "Score : " + score;

        // Meilleur score
        if (score > bestScore) {

            bestScore = score;

            localStorage.setItem(
                "bestScore",
                bestScore
            );

            bestScoreText.innerHTML =
                "Meilleur score : " + bestScore;
        }

        food = {
            x: Math.floor(
                Math.random() * 20
            ) * box,

            y: Math.floor(
                Math.random() * 20
            ) * box
        };

        // Accélération
        if (speed > 60) {

            speed -= speedIncrease;

            clearInterval(game);

            game = setInterval(
                draw,
                speed
            );
        }

    } else {

        snake.pop();
    }

    const newHead = {

        x: Math.round(
            snakeX / box
        ) * box,

        y: Math.round(
            snakeY / box
        ) * box
    };

    // Collision
    if (

        snakeX < 0 ||

        snakeY < 0 ||

        snakeX > 380 ||

        snakeY > 380 ||

        collision(
            newHead,
            snake.slice(1)
        )
    ) {

        clearInterval(game);

        finalScore.innerHTML =
            "Score final : " + score;

        gameOverModal.style.display =
            "flex";

        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {

    for (let i = 0; i < array.length; i++) {

        if (
            head.x === array[i].x &&
            head.y === array[i].y
        ) {
            return true;
        }
    }

    return false;
}

function togglePause() {

    const pauseBtn =
        document.getElementById("pauseBtn");

    // Pause
    if (!isPaused) {

        clearInterval(game);

        isPaused = true;

        pauseBtn.innerHTML = "▶";
    }

    // Reprendre
    else {

        game = setInterval(draw, speed);

        isPaused = false;

        pauseBtn.innerHTML = "⏸";
    }
}


// Rejouer
function restartGame() {

    gameOverModal.style.display =
        "none";

    snake = [
        { x: 200, y: 200 }
    ];

    direction = "RIGHT";

    score = 0;

    setDifficulty();

    scoreText.innerHTML =
        "Score : 0";

    food = {

        x: Math.floor(
            Math.random() * 20
        ) * box,

        y: Math.floor(
            Math.random() * 20
        ) * box
    };

    clearInterval(game);

    startCountdown();
}

// Décompte
function startCountdown() {

    setDifficulty();

    let count = 3;

    countdownText.style.display =
        "block";

    countdownText.innerHTML =
        count;

    const countdown =
        setInterval(() => {

            count--;

            if (count > 0) {

                countdownText.innerHTML =
                    count;

            }

            else if (count === 0) {

                countdownText.innerHTML =
                    "GO !";

            }

            else {

                clearInterval(countdown);

                countdownText.style.display =
                    "none";

                game = setInterval(
                    draw,
                    speed
                );
            }

        }, 1000);
}

// Démarrage
startCountdown();
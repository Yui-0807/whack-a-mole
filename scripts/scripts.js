// holes
const holes = document.querySelectorAll('#game-board div');
const holeContainer = document.getElementById('game-board');

// buttons
const btnStart = document.querySelector('.start-container button');
const btnLegend = document.querySelector('.legend button');
const btnRestart = document.getElementById('restart');
let btnPlayPause = document.getElementById('playPause');
const btnPlayAgain = document.querySelector('.time-out-container img');

// board
const start = document.querySelector('.start-container');
const legend = document.querySelector('.legend');
const gameboard = document.querySelector('.game-container');
const timeout = document.querySelector('.time-out-container');

// text
let scoreText = document.querySelector('#score-out');
let scoreFinal = document.getElementById('final-score');
let timeText = document.getElementById('time-out');

// hammer cursor
const hammer = document.querySelector('.custom-cursor');

// audio
let sfx = {
    openGame: new Audio('audio/open.mp3'),
    whack: new Audio('audio/whack.mp3'),
    startGame: new Audio('audio/game-start.mp3')
};

sfx.openGame.loop = true;
sfx.openGame.volume = 0.1;
sfx.whack.volume = 0.1;
sfx.startGame.volume = 0.1;

let setMoleGame;
let setPlusGame;
let setMinusGame;

let currentMoleHole;
let currentPlusRabbitHole;
let currentMinusRabbitHole;

let numMole;
let numRabbitPlus;
let numRabbitMinus;

let lastNumMole;
let lastNumRabbitPlus;
let lastNumRabbitMinus;

let timer;
let sec = 40;
let score = 0;

// button event listener
btnStart.addEventListener('click', function () {
    start.style.display = 'none';
    legend.style.display = 'flex';
    sfx.openGame.play();
});

btnLegend.addEventListener('click', function () {
    legend.style.display = 'none';
    gameboard.style.display = 'block';
    sfx.openGame.pause();
    sfx.openGame.currentTime = 0;

    setGame();
});

btnRestart.addEventListener('click', function () {
    start.style.display = 'block';
    gameboard.style.display = 'none';
    sfx.startGame.pause();
    sfx.startGame.currentTime = 0;

    resetGame();
});

let pause = false;
let preScore;
let stopPoint;

btnPlayPause.addEventListener('click', function () {

    if (pause) {

        // start the audio
        setGame();

        sfx.startGame.play();

        btnPlayPause.src = 'images/pause_FILL1_wght400_GRAD0_opsz24.svg';
        pause = false;

    } else {

        // pause the audio
        preScore = score;
        stopPoint = sec;
        clearInterval(setMoleGame);
        clearInterval(setPlusGame);
        clearInterval(setMinusGame);
        clearInterval(timer);

        sfx.startGame.pause();
        btnPlayPause.src = 'images/play_arrow_FILL1_wght400_GRAD0_opsz24.svg';
        pause = true;
    }
});

btnPlayAgain.addEventListener('click', function () {
    timeout.style.display = 'none';
    start.style.display = 'block';
    resetGame();
    sfx.startGame.pause();
    sfx.startGame.currentTime = 0;

});


// function
function resetGame() {
    clearInterval(setMoleGame);
    clearInterval(setPlusGame);
    clearInterval(setMinusGame);
    clearInterval(timer);
    score = 0;
    scoreText.innerHTML = score;
    sec = 40;
    stopPoint = sec;
    timeText.innerHTML = '40s';
    btnPlayPause.src = 'images/pause_FILL1_wght400_GRAD0_opsz24.svg';
    pause = false;

    hammer.style.opacity = '0';

}

// generate random num to the <div> id (the hole number)
function getRandomHole() {
    let num = Math.floor(Math.random() * 9 + 1);
    return num.toString();
}

// setting game
function setGame() {

    // play audio
    sfx.startGame.play();

    // set moles and rabbits
    setMoleGame = setInterval(setMole, 2000);
    setPlusGame = setInterval(setPlusRabbit, 3000);
    setMinusGame = setInterval(setMinusRabbit, 3000);

    // to record the time when the game is paused 
    stopPoint = 40;

    // set timer
    timer = setInterval(() => {
        sec--;
        timeText.innerHTML = sec + 's';
        if (sec === 0) {
            scoreFinal.innerHTML = score;
            timeout.style.display = 'block';
            gameboard.style.display = 'none';
            clearInterval(setMoleGame);
            clearInterval(setPlusGame);
            clearInterval(setMinusGame);
            clearInterval(timer);
            hammer.style.opacity = '0';
            return;
        }
    }, 1000);

    // show a hammer cursor
    hammer.style.opacity = '1';

    // hide the cursor inside the holeContainer
    holeContainer.style.cursor = 'none';

    // mousemove a hammer
    holeContainer.addEventListener('mousemove', e => {
        hammer.style.top = e.pageY + 'px';
        hammer.style.left = e.pageX + 'px';
    });

    // click
    holeContainer.addEventListener('mousedown', () => {
        hammer.classList.add('active');
        holes.forEach(function (el) {
            el.addEventListener('click', selected);
        });
    });

    // release
    holeContainer.addEventListener('mouseup', () => {
        hammer.classList.remove('active');
    });

    // If the cursor is outside the holeContainer, then hide it
    holeContainer.addEventListener('mouseleave', () => {
        hammer.style.opacity = '0';
    });

    // If the cursor is inside the holeContainer, then show it
    holeContainer.addEventListener('mouseenter', () => {
        hammer.style.opacity = '1';
    });
}

// setting images
function setMole() {

    // empty the div(hole) to remove image
    if (currentMoleHole) {
        currentMoleHole.innerHTML = '';
    }

    // create <img> of mole
    let mole = document.createElement('img');
    mole.src = 'images/mole.png';

    // Generate random number to the id of the hole
    numMole = getRandomHole();
    currentMoleHole = document.getElementById(numMole);

    // To prevent generating num in the same hole
    // 1. If the hole have a img then return
    // 2. If the new hole is as same as the previous one then return
    if (currentMoleHole.childElementCount > 0 || lastNumMole === numMole) {
        return;
    }

    lastNumMole = numMole;
    currentMoleHole.append(mole);
}

function setPlusRabbit() {

    // empty the div(hole) to remove image
    if (currentPlusRabbitHole) {
        currentPlusRabbitHole.innerHTML = '';
    }

    // create <img> of plus-rabbit
    let plusRabbit = document.createElement('img');
    plusRabbit.src = 'images/plus-rabbit.png';

    // Generate random number to the id of the hole
    numRabbitPlus = getRandomHole();
    currentPlusRabbitHole = document.getElementById(numRabbitPlus);

    // To prevent generating num in the same hole
    // 1. If the hole have a img then return
    // 2. If the new hole is as same as the previous one then return
    if (currentPlusRabbitHole.childElementCount > 0 || lastNumRabbitPlus === numRabbitPlus) {
        return;
    }

    lastNumRabbitPlus = numRabbitPlus;
    currentPlusRabbitHole.append(plusRabbit);
}

function setMinusRabbit() {

    // empty the div(hole) to remove image
    if (currentMinusRabbitHole) {
        currentMinusRabbitHole.innerHTML = '';
    }

    // create <img> of minus-rabbit
    let minusRabbit = document.createElement('img');
    minusRabbit.src = 'images/minus-rabbit.png';

    // Generate random number to the id of the hole
    numRabbitMinus = getRandomHole();
    currentMinusRabbitHole = document.getElementById(numRabbitMinus);

    // To prevent generating num in the same hole
    // 1. If the hole have a img then return
    // 2. If the new hole is as same as the previous one then return
    if (currentMinusRabbitHole.childElementCount > 0 || lastNumRabbitMinus === numRabbitMinus) {
        return;
    }

    lastNumRabbitMinus = numRabbitMinus;
    currentMinusRabbitHole.append(minusRabbit);
}

// if image(mole and rabbirs) is selected then disappear
function selected() {
    
    if (pause) {
        return;
    } else if (this === currentMoleHole) {
        sfx.whack.play();
        score += 5;
        scoreText.innerHTML = score;
        this.style.pointerEvents = 'none';
        currentMoleHole.innerHTML = '';
        


    } else if (this === currentPlusRabbitHole) {
        sfx.whack.play();
        score += 20;
        scoreText.innerHTML = score;
        this.style.pointerEvents = 'none';
        currentPlusRabbitHole.innerHTML = '';
        

    } else if (this === currentMinusRabbitHole) {
        sfx.whack.play();
        score -= 10;
        scoreText.innerHTML = score;
        this.style.pointerEvents = 'none';
        currentMinusRabbitHole.innerHTML = '';
        

    }
}

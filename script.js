const soundStart = new Audio('sound/Coin.wav');
const soundPause = new Audio('sound/Pause.wav');
const soundEnd = new Audio('sound/MW_YoshiHitEnemy.wav');

// Função robusta para garantir que o som toca sempre desde o início
function tocarSom(audioObj) {
    audioObj.currentTime = 0; // Rebobina o som
    audioObj.play().catch(err => console.log("Navegador bloqueou o áudio:", err));
}

const sequenciaExata = [
    5, 3, 1, 4, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 5, 2, 4, 3, 1, 2,
    7, 2, 5, 6, 8, 7, 4, 3, 6, 4, 9, 7, 6, 1, 9, 8, 1, 9, 3, 8,
    8, 4, 6, 7, 9, 8, 6, 1, 9, 7, 5, 9, 8, 2, 7, 6, 5, 8, 7, 3,
    9, 5, 2, 6, 7, 3, 1, 5, 3, 7, 9, 2, 8, 4, 6, 9, 1, 6, 4, 8,
    5, 3, 9, 1, 6, 7, 2, 8, 4, 1, 8, 9, 3, 7, 5, 4, 8, 2, 6, 3,
    4, 1, 5, 2, 9, 5, 1, 7, 3, 8, 4, 6, 2, 7, 9, 3, 6, 4, 6, 8,
    7, 1, 5, 8, 2, 8, 7, 4, 9, 2, 6, 3, 6, 4, 1, 7, 9, 2, 5, 3
];

const totalItems = sequenciaExata.length; 
const timeLimit = 120; 
const preFilledCount = 3; 

let userAnswers = [];
let currentIndex = preFilledCount; 
let timerInterval;
let isPlaying = false;
let isPaused = false;
let timeLeft = timeLimit;

const gameBoard = document.getElementById('game-board');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const timerDisplay = document.getElementById('timer');
const resultScreen = document.getElementById('result-screen');
const virtualKeypad = document.getElementById('virtual-keypad');

function renderKey() {
    const keyContainer = document.getElementById('key-container');
    keyContainer.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const box = document.createElement('div');
        box.className = 'key-box';
        box.innerHTML = `
            <div class="key-top"><img src="img/${i}.jpg" alt="Símbolo ${i}"></div>
            <div class="key-bottom">${i}</div>
        `;
        keyContainer.appendChild(box);
    }
}

function initBoard() {
    gameBoard.innerHTML = '';
    userAnswers = [];
    for (let i = 0; i < totalItems; i++) {
        const correctNumber = sequenciaExata[i];
        const box = document.createElement('div');
        box.className = 'game-box';
        box.id = `box-${i}`;
        
        if (i < preFilledCount) {
            userAnswers.push(correctNumber); 
            box.innerHTML = `
                <div class="game-top"><img src="img/${correctNumber}.jpg"></div>
                <div class="game-bottom pre-filled" id="answer-${i}">${correctNumber}</div>
            `;
        } else {
            userAnswers.push(null); 
            box.innerHTML = `
                <div class="game-top"><img src="img/${correctNumber}.jpg"></div>
                <div class="game-bottom" id="answer-${i}"></div>
            `;
        }
        gameBoard.appendChild(box);
    }
}

function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        if (timeLeft <= 0) endGame();
    }, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    tocarSom(soundEnd); // Atualizado

    gameBoard.classList.remove('active-game');
    virtualKeypad.classList.remove('active-keypad');
    virtualKeypad.classList.add('hidden-keypad');
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    timerDisplay.innerText = "Fim!";
    
    if (currentIndex < totalItems) {
        document.getElementById(`answer-${currentIndex}`).classList.remove('active-cell');
    }

    let correct = 0, wrong = 0, totalResp = 0;
    for (let i = preFilledCount; i < userAnswers.length; i++) {
        if (userAnswers[i] !== null) {
            totalResp++;
            if (userAnswers[i] === sequenciaExata[i]) correct++;
            else wrong++;
        }
    }

    document.getElementById('res-total').innerText = totalResp;
    document.getElementById('res-correct').innerText = correct;
    document.getElementById('res-wrong').innerText = wrong;
    resultScreen.style.display = 'block';
    resultScreen.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetGame() {
    clearInterval(timerInterval);
    isPlaying = false;
    isPaused = false;
    timeLeft = timeLimit;
    currentIndex = preFilledCount;
    
    updateTimerDisplay(timeLeft);
    initBoard();
    
    resultScreen.style.display = 'none';
    gameBoard.classList.remove('active-game', 'paused-game');
    virtualKeypad.classList.remove('active-keypad');
    virtualKeypad.classList.add('hidden-keypad');
    gameBoard.style.opacity = "0.5";
    
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    pauseBtn.innerText = 'Pausar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

startBtn.addEventListener('click', () => {
    isPlaying = true;
    tocarSom(soundStart); // Atualizado
    
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    resetBtn.style.display = 'inline-block';
    
    gameBoard.classList.add('active-game');
    virtualKeypad.classList.remove('hidden-keypad');
    virtualKeypad.classList.add('active-keypad');
    
    const firstCell = document.getElementById(`answer-${currentIndex}`);
    firstCell.classList.add('active-cell');
    
    startTimer();
});

pauseBtn.addEventListener('click', () => {
    tocarSom(soundPause); // Atualizado
    if (isPaused) {
        isPaused = false;
        pauseBtn.innerText = 'Pausar';
        gameBoard.classList.remove('paused-game');
        virtualKeypad.classList.remove('hidden-keypad');
        virtualKeypad.classList.add('active-keypad');
        startTimer();
    } else {
        isPaused = true;
        clearInterval(timerInterval);
        pauseBtn.innerText = 'Continuar';
        gameBoard.classList.add('paused-game');
        virtualKeypad.classList.remove('active-keypad');
        virtualKeypad.classList.add('hidden-keypad');
    }
});

resetBtn.addEventListener('click', resetGame);

function processInput(key) {
    if (!isPlaying || isPaused) return;

    if (key >= '1' && key <= '9') {
        if (currentIndex < totalItems) {
            userAnswers[currentIndex] = parseInt(key);
            const currentCell = document.getElementById(`answer-${currentIndex}`);
            currentCell.innerText = key;
            currentCell.classList.remove('active-cell');

            currentIndex++;
            if (currentIndex < totalItems) {
                const nextCell = document.getElementById(`answer-${currentIndex}`);
                nextCell.classList.add('active-cell');
                
                if (window.innerWidth <= 768) {
                    nextCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                endGame(); 
            }
        }
    } 
    else if (key === 'Backspace' && currentIndex > preFilledCount) {
        if (currentIndex < totalItems) {
            document.getElementById(`answer-${currentIndex}`).classList.remove('active-cell');
        }
        currentIndex--;
        userAnswers[currentIndex] = null; 
        const prevCell = document.getElementById(`answer-${currentIndex}`);
        prevCell.innerText = '';
        prevCell.classList.add('active-cell');
        
        if (window.innerWidth <= 768) {
            prevCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

document.addEventListener('keydown', (e) => processInput(e.key));

document.querySelectorAll('.v-key').forEach(btn => {
    btn.addEventListener('click', (e) => {
        processInput(e.target.getAttribute('data-key'));
    });
});

renderKey();
initBoard();
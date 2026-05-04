// Sequência exata dos 140 números fornecidos
const sequenciaExata = [
    5, 3, 1, 4, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 5, 2, 4, 3, 1, 2,
    7, 2, 5, 6, 8, 7, 4, 3, 6, 4, 9, 7, 6, 1, 9, 8, 1, 9, 3, 8,
    8, 4, 6, 7, 9, 8, 6, 1, 9, 7, 5, 9, 8, 2, 7, 6, 5, 8, 7, 3,
    9, 5, 2, 6, 7, 3, 1, 5, 3, 7, 9, 2, 8, 4, 6, 9, 1, 6, 4, 8,
    5, 3, 9, 1, 6, 7, 2, 8, 4, 1, 8, 9, 3, 7, 5, 4, 8, 2, 6, 3,
    4, 1, 5, 2, 9, 5, 1, 7, 3, 8, 4, 6, 2, 7, 9, 3, 6, 4, 6, 8,
    7, 1, 5, 8, 2, 8, 7, 4, 9, 2, 6, 3, 6, 4, 1, 7, 9, 2, 5, 3
];

// Configurações do jogo
const totalItems = sequenciaExata.length; 
const timeLimit = 120; // 2 minutos em segundos
const preFilledCount = 3; // Os 3 primeiros já vêm preenchidos

let userAnswers = [];
let currentIndex = preFilledCount; 
let timerInterval;
let isPlaying = false;

// Renderizar a Chave (Legenda)
const keyContainer = document.getElementById('key-container');
for (let i = 1; i <= 9; i++) {
    const box = document.createElement('div');
    box.className = 'key-box';
    // Caminho atualizado para a pasta img/
    box.innerHTML = `
        <div class="key-top"><img src="img/${i}.jpg" alt="Simbolo ${i}"></div>
        <div class="key-bottom">${i}</div>
    `;
    keyContainer.appendChild(box);
}

// Renderizar o Tabuleiro de Jogo
const gameBoard = document.getElementById('game-board');
for (let i = 0; i < totalItems; i++) {
    const correctNumber = sequenciaExata[i];

    const box = document.createElement('div');
    box.className = 'game-box';
    box.id = `box-${i}`;
    
    // Caminho atualizado para a pasta img/
    if (i < preFilledCount) {
        userAnswers.push(correctNumber); 
        box.innerHTML = `
            <div class="game-top"><img src="img/${correctNumber}.jpg" alt="Simbolo ${correctNumber}"></div>
            <div class="game-bottom pre-filled" id="answer-${i}">${correctNumber}</div>
        `;
    } else {
        userAnswers.push(null); 
        box.innerHTML = `
            <div class="game-top"><img src="img/${correctNumber}.jpg" alt="Simbolo ${correctNumber}"></div>
            <div class="game-bottom" id="answer-${i}"></div>
        `;
    }
    gameBoard.appendChild(box);
}

// Lógica do Temporizador
function updateTimerDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').innerText = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    document.getElementById('game-board').classList.remove('active-game');
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('timer').innerText = "Tempo Esgotado!";
    
    if (currentIndex < totalItems) {
        document.getElementById(`answer-${currentIndex}`).classList.remove('active-cell');
    }

    // Calcular Resultados
    let correct = 0;
    let wrong = 0;
    let totalRespondido = 0;

    for (let i = preFilledCount; i < userAnswers.length; i++) {
        if (userAnswers[i] !== null) {
            totalRespondido++;
            if (userAnswers[i] === sequenciaExata[i]) {
                correct++;
            } else {
                wrong++;
            }
        }
    }

    // Mostrar Resultados
    document.getElementById('res-total').innerText = totalRespondido;
    document.getElementById('res-correct').innerText = correct;
    document.getElementById('res-wrong').innerText = wrong;
    document.getElementById('result-screen').style.display = 'block';
}

// Iniciar Jogo
document.getElementById('start-btn').addEventListener('click', () => {
    isPlaying = true;
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('game-board').classList.add('active-game');
    
    document.getElementById(`answer-${currentIndex}`).classList.add('active-cell');

    let timeLeft = timeLimit;
    updateTimerDisplay(timeLeft);

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
});

// Lógica de Entrada pelo Teclado
document.addEventListener('keydown', (e) => {
    if (!isPlaying) return;

    if (e.key >= '1' && e.key <= '9') {
        if (currentIndex < totalItems) {
            userAnswers[currentIndex] = parseInt(e.key);
            const currentCell = document.getElementById(`answer-${currentIndex}`);
            currentCell.innerText = e.key;
            currentCell.classList.remove('active-cell');

            currentIndex++;
            
            if (currentIndex < totalItems) {
                document.getElementById(`answer-${currentIndex}`).classList.add('active-cell');
            } else {
                endGame(); 
            }
        }
    } 
    else if (e.key === 'Backspace') {
        if (currentIndex > preFilledCount) {
            if (currentIndex < totalItems) {
                document.getElementById(`answer-${currentIndex}`).classList.remove('active-cell');
            }
            currentIndex--;
            userAnswers[currentIndex] = null; 
            const prevCell = document.getElementById(`answer-${currentIndex}`);
            prevCell.innerText = '';
            prevCell.classList.add('active-cell');
        }
    }
});
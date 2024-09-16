const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Configurações do jogo
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30; // Tamanho de cada bloco

// Cores das peças
const COLORS = [
    null,
    '#FF0000', // vermelho
    '#00FF00', // verde
    '#0000FF', // azul
    '#FFFF00', // amarelo
    '#FF00FF', // rosa
    '#00FFFF', // ciano
    '#FFA500'  // laranja
];

// Definições das peças
const PIECES = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 1], [1, 1]], // O
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]]  // J
];

// Cria a grade do jogo
const board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

// Inicializa a pontuação
let score = 0;
let lastTime = 0;
let pieceDropInterval = 1000; // Tempo para queda da peça em milissegundos
let pieceDropTimer = 0;

// Função para desenhar um bloco
function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

// Função para desenhar a grade
function drawBoard() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== 0) {
                drawBlock(c, r, COLORS[board[r][c]]);
            }
        }
    }
}

// Função para desenhar a peça
function drawPiece(piece, offsetX, offsetY, color) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            if (piece[r][c]) {
                drawBlock(offsetX + c, offsetY + r, color);
            }
        }
    }
}

// Função para verificar colisão
function isValidMove(piece, offsetX, offsetY) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            if (piece[r][c]) {
                const x = offsetX + c;
                const y = offsetY + r;
                if (x < 0 || x >= COLS || y >= ROWS || board[y][x]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Função para rotacionar uma peça
function rotate(piece) {
    const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
    return rotated;
}

// Função para adicionar peça ao tabuleiro
function placePiece(piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            if (piece[r][c]) {
                board[r + currentPiece.y][c + currentPiece.x] = currentPiece.color;
            }
        }
    }
    clearLines();
}

// Função para limpar linhas completas e atualizar a pontuação
function clearLines() {
    let linesCleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== 0)) {
            linesCleared++;
            board.splice(r, 1);
            board.unshift(Array(COLS).fill(0));
            r++; // Recheck the same row after shifting lines down
        }
    }
    // Atualiza a pontuação (100 pontos por linha)
    score += linesCleared * 100;
    scoreElement.textContent = 'Score: ' + score;
}

// Função para gerar uma nova peça
function newPiece() {
    const type = Math.floor(Math.random() * PIECES.length);
    return {
        piece: PIECES[type],
        color: type + 1,
        x: Math.floor(COLS / 2) - Math.floor(PIECES[type][0].length / 2),
        y: 0
    };
}

let currentPiece = newPiece();

// Função de animação principal
function gameLoop(timestamp) {
    // Atualiza a peça de acordo com o tempo decorrido
    if (timestamp - lastTime > pieceDropInterval) {
        if (isValidMove(currentPiece.piece, currentPiece.x, currentPiece.y + 1)) {
            currentPiece.y++;
        } else {
            placePiece(currentPiece.piece);
            currentPiece = newPiece();
            if (!isValidMove(currentPiece.piece, currentPiece.x, currentPiece.y)) {
                gameOver(score)
                return;
            }
        }
        lastTime = timestamp;
    }
    
    // Limpa o canvas e desenha o tabuleiro e a peça atual
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece(currentPiece.piece, currentPiece.x, currentPiece.y, COLORS[currentPiece.color]);
    
    // Solicita o próximo frame
    requestAnimationFrame(gameLoop);
}

// Inicia o loop de animação
requestAnimationFrame(gameLoop);

// Controle das peças
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        if (isValidMove(currentPiece.piece, currentPiece.x - 1, currentPiece.y)) {
            currentPiece.x--;
        }
    } else if (e.key === 'ArrowRight') {
        if (isValidMove(currentPiece.piece, currentPiece.x + 1, currentPiece.y)) {
            currentPiece.x++;
        }
    } else if (e.key === 'ArrowDown') {
        if (isValidMove(currentPiece.piece, currentPiece.x, currentPiece.y + 1)) {
            currentPiece.y++;
        }
    } else if (e.key === 'ArrowUp') {
        const rotated = rotate(currentPiece.piece);
        if (isValidMove(rotated, currentPiece.x, currentPiece.y)) {
            currentPiece.piece = rotated;
        }
    }
});

const audio = document.getElementById('background-audio');
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');

        playBtn.addEventListener('click', () => {
            audio.play();
            playBtn.disabled = true;
            pauseBtn.disabled = false;
        });

        pauseBtn.addEventListener('click', () => {
            audio.pause();
            playBtn.disabled = false;
            pauseBtn.disabled = true;
        });

        // Atualiza o estado dos botões com base na reprodução do áudio
        audio.addEventListener('play', () => {
            playBtn.disabled = true;
            pauseBtn.disabled = false;
        });

        audio.addEventListener('pause', () => {
            playBtn.disabled = false;
            pauseBtn.disabled = true;
        });

        function gameOver(score) {
            // Redireciona para a página de "Game Over" com a pontuação final
            window.location.href = `gameover.html?score=${score}`;
        }
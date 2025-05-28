// Main game file - contains game loop, input handling, and core functions

// Initialize game
async function init() {
    loadHighScore(); // Load saved high score
    
    // Initialize assets first
    console.log('Loading game assets...');
    await initAssets();
    
    initSounds();
    createLevel();
    gameLoop();
    setupEventListeners();
    updateHighScore(); // Update high score display
    
    // Start background music
    setTimeout(() => {
        playSound('backgroundMusic');
    }, 1000);
}

// Event listeners
function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        gameState.keys[e.code] = true;
        
        if (e.code === 'KeyR') {
            restartGame();
        }
        
        if (e.code === 'KeyM') {
            toggleSound();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        gameState.keys[e.code] = false;
    });
}

// Handle player input
function handleInput() {
    if (!gameState.gameRunning) return;
    
    // Left movement
    if (gameState.keys['ArrowLeft']) {
        player.velocityX = -player.speed;
        player.direction = -1;
    }
    // Right movement
    else if (gameState.keys['ArrowRight']) {
        player.velocityX = player.speed;
        player.direction = 1;
    }
    // Apply friction when no input
    else {
        player.velocityX *= friction;
    }
    
    // Jump
    if (gameState.keys['Space'] && player.onGround) {
        player.velocityY = -player.jumpPower;
        player.onGround = false;
        createJumpParticles();
        playSound('jump');
    }
    
    // Fireball shooting (X key)
    if (gameState.keys['KeyX'] && player.powerUpState === 'fire') {
        shootFireball();
    }
}

// Shoot fireball
let lastFireballTime = 0;
function shootFireball() {
    const currentTime = Date.now();
    if (currentTime - lastFireballTime < 300) return; // Limit firing rate
    
    lastFireballTime = currentTime;
    
    const fireball = {
        x: player.x + (player.direction === 1 ? player.width : 0),
        y: player.y + player.height / 2,
        width: 8,
        height: 8,
        velocityX: player.direction * 6,
        velocityY: -2,
        life: 180, // 3 seconds at 60 FPS
        animationFrame: 0,
        animationTimer: 0
    };
    
    player.fireballs.push(fireball);
    playSound('jump'); // Use jump sound for fireball
}

// Update fireballs
function updateFireballs() {
    for (let i = player.fireballs.length - 1; i >= 0; i--) {
        const fireball = player.fireballs[i];
        
        // Update position
        fireball.x += fireball.velocityX;
        fireball.y += fireball.velocityY;
        fireball.velocityY += 0.2; // gravity
        
        // Animation
        fireball.animationTimer++;
        if (fireball.animationTimer >= 4) {
            fireball.animationFrame = (fireball.animationFrame + 1) % 4;
            fireball.animationTimer = 0;
        }
        
        // Bounce off platforms
        for (let platform of platforms) {
            if (isColliding(fireball, platform)) {
                fireball.y = platform.y - fireball.height;
                fireball.velocityY = -4;
            }
        }
        
        // Check collision with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (isColliding(fireball, enemies[j])) {
                enemies.splice(j, 1);
                player.fireballs.splice(i, 1);
                gameState.score += 100;
                createDeathParticles(fireball.x, fireball.y);
                playSound('enemyDefeat');
                updateScore();
                break;
            }
        }
        
        // Remove fireball if out of bounds or life expired
        fireball.life--;
        if (fireball.life <= 0 || fireball.x < 0 || fireball.x > canvas.width || fireball.y > canvas.height) {
            player.fireballs.splice(i, 1);
        }
    }
}

// Game state functions
function loseLife() {
    gameState.lives--;
    updateLives();
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        // Reset player position
        player.setPosition(50, 300);
        player.velocityX = 0;
        player.velocityY = 0;
    }
}

function levelComplete() {
    gameState.gameRunning = false;
    sounds.backgroundMusic.stop();
    
    // Check for new high score
    const isNewHighScore = saveHighScore();
    playSound('levelComplete');
    
    if (isNewHighScore) {
        alert(`🎉 NEW HIGH SCORE! ${gameState.score} points!`);
    }
    
    document.getElementById('levelScore').textContent = gameState.score;
    document.getElementById('levelComplete').classList.remove('hidden');
    updateHighScore(); // Update high score display
}

function gameOver() {
    gameState.gameRunning = false;
    sounds.backgroundMusic.stop();
    
    // Check for new high score
    const isNewHighScore = saveHighScore();
    if (isNewHighScore) {
        playSound('levelComplete'); // Use level complete sound for new high score
        alert(`🎉 NEW HIGH SCORE! ${gameState.score} points!`);
    } else {
        playSound('gameOver');
    }
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameOver').classList.remove('hidden');
    updateHighScore(); // Update high score display
}

function restartGame() {
    // Reset game state
    gameState.score = 0;
    gameState.lives = 3;
    gameState.coins = 0;
    gameState.level = 1;
    gameState.gameRunning = true;
    
    // Reset player
    player.reset();
    
    // Reset level
    createLevel();
    particles = [];
    
    // Hide game over screens
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('levelComplete').classList.add('hidden');
    
    // Update UI
    updateScore();
    updateLives();
    updateCoins();
    
    // Restart background music
    setTimeout(() => {
        playSound('backgroundMusic');
    }, 500);
}

function nextLevel() {
    if (gameState.level >= gameState.maxLevel) {
        // Game completed!
        alert(`Congratulations! You completed all ${gameState.maxLevel} levels!`);
        restartGame();
        return;
    }
    
    gameState.level++;
    gameState.gameRunning = true;
    
    // Reset player position
    player.setPosition(50, 300);
    player.velocityX = 0;
    player.velocityY = 0;
    player.onGround = false;
    
    // Create new level
    createLevel();
    particles = [];
    document.getElementById('levelComplete').classList.add('hidden');
    
    // Show level name briefly
    console.log(`Starting ${getCurrentLevelName()}`);
    
    // Restart background music
    setTimeout(() => {
        playSound('backgroundMusic');
    }, 500);
}

// Update UI functions
function updateScore() {
    document.getElementById('score').textContent = gameState.score;
    
    // Update high score if current score exceeds it
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        updateHighScore();
    }
}

function updateLives() {
    document.getElementById('lives').textContent = gameState.lives;
}

function updateCoins() {
    document.getElementById('coins').textContent = gameState.coins;
}

function updateHighScore() {
    document.getElementById('highScore').textContent = gameState.highScore;
}

// Main game loop
function gameLoop() {
    handleInput();
    updateAnimations();
    updatePlayer();
    updateEnemies();
    updateMovingPlatforms();
    updateFireballs();
    updateParticles();
    updateWeather();
    render();
    
    requestAnimationFrame(gameLoop);
}

// Update weather effects
function updateWeather() {
    if (gameState.weather.type === 'rain') {
        // Create new raindrops periodically
        if (Math.random() < 0.2) { // Adjust probability for more/less rain
            createRainParticle();
        }

        // Update existing raindrops
        for (let i = gameState.weather.particles.length - 1; i >= 0; i--) {
            let particle = gameState.weather.particles[i];
            particle.y += particle.velocityY;

            // Remove raindrops that fall off screen
            if (particle.y > canvas.height) {
                gameState.weather.particles.splice(i, 1);
            }
        }
    }
    // Add other weather types like 'snow' here later
}

// Start the game
init(); 
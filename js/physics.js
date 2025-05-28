// Physics and collision detection functions

// Collision detection using AABB (Axis-Aligned Bounding Box)
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Check collision with static platforms
function checkPlatformCollisions() {
    for (let platform of platforms) {
        if (isColliding(player, platform)) {
            // Landing on top of platform
            if (player.velocityY > 0 && player.y < platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
            // Hitting platform from below
            else if (player.velocityY < 0 && player.y > platform.y) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
            // Side collisions
            else if (player.velocityX > 0) {
                player.x = platform.x - player.width;
                player.velocityX = 0;
            }
            else if (player.velocityX < 0) {
                player.x = platform.x + platform.width;
                player.velocityX = 0;
            }
        }
    }
}

// Check collision with enemies
function checkEnemyCollisions() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        if (isColliding(player, enemy)) {
            // Star power - destroy enemy on contact
            if (player.starPower) {
                handleEnemyDefeat(enemy, i);
            }
            // Player jumping on enemy
            else if (player.velocityY > 0 && player.y < enemy.y - 10) {
                handleEnemyJumpAttack(enemy, i);
            }
            // Player hit by enemy (if not invincible)
            else if (!player.invincible) {
                takeDamage();
                return;
            }
        }
    }
}

// Handle enemy defeat (different behavior per type)
function handleEnemyDefeat(enemy, index) {
    let points = 100;
    
    switch (enemy.type) {
        case 'goomba':
            points = 100;
            break;
        case 'koopa':
            points = 150;
            break;
        case 'flying':
            points = 200;
            break;
        case 'boss':
            points = 500;
            break;
    }
    
    enemies.splice(index, 1);
    gameState.score += points;
    createDeathParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
    playSound('enemyDefeat');
    updateScore();
}

// Handle jump attack on enemy
function handleEnemyJumpAttack(enemy, index) {
    let points = 100;
    let bounceHeight = -8;
    
    switch (enemy.type) {
        case 'goomba':
            // Goomba dies immediately
            enemies.splice(index, 1);
            points = 100;
            break;
            
        case 'koopa':
            // Koopa goes into shell mode (becomes slower and smaller)
            enemy.type = 'koopa_shell';
            enemy.height = 15;
            enemy.velocityX *= 0.3;
            enemy.color = '#8FBC8F';
            points = 150;
            bounceHeight = -10;
            break;
            
        case 'flying':
            // Flying enemy falls down and becomes walking enemy
            enemy.type = 'goomba';
            enemy.velocityY = 0;
            enemy.color = '#8B0000';
            points = 200;
            bounceHeight = -12;
            break;
            
        case 'boss':
            // Boss takes damage but doesn't die immediately
            enemy.health--;
            if (enemy.health <= 0) {
                enemies.splice(index, 1);
                points = 1000;
            } else {
                points = 300;
                // Boss gets angry and faster
                enemy.velocityX *= 1.2;
                enemy.color = '#FF0000';
            }
            bounceHeight = -15;
            break;
            
        case 'koopa_shell':
            // Shell can be kicked
            enemy.velocityX = player.direction * 4;
            points = 100;
            break;
    }
    
    player.velocityY = bounceHeight;
    gameState.score += points;
    createDeathParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
    playSound('enemyDefeat');
    updateScore();
}

// Handle taking damage
function takeDamage() {
    if (player.powerUpState === 'fire') {
        // Downgrade from fire to big
        player.powerUpState = 'big';
        player.color = '#FF0000';
        player.invincible = true;
        player.invincibleTimer = 120; // 2 seconds of invincibility
    } else if (player.powerUpState === 'big') {
        // Downgrade from big to small
        player.powerUpState = 'small';
        player.height = player.originalHeight;
        player.speed = 3;
        player.jumpPower = 12;
        player.invincible = true;
        player.invincibleTimer = 120;
    } else {
        // Small Mario dies
        loseLife();
    }
}

// Check collision with coins
function checkCoinCollisions() {
    for (let coin of coins) {
        if (!coin.collected && isColliding(player, coin)) {
            coin.collected = true;
            gameState.coins++;
            gameState.score += 50;
            createCoinParticles(coin.x + coin.width/2, coin.y + coin.height/2);
            playSound('coin');
            updateScore();
            
            // Check if all coins collected
            if (coins.every(c => c.collected)) {
                levelComplete();
            }
        }
    }
}

// Check collision with power-ups
function checkPowerUpCollisions() {
    for (let powerUp of powerUps) {
        if (!powerUp.collected && isColliding(player, powerUp)) {
            powerUp.collected = true;
            applyPowerUp(powerUp.type);
            createPowerUpParticles(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2, powerUp.type);
            playSound('coin'); // Use coin sound for now
            gameState.score += 200;
            updateScore();
        }
    }
}

// Apply power-up effects
function applyPowerUp(type) {
    switch (type) {
        case 'mushroom':
            if (player.powerUpState === 'small') {
                player.powerUpState = 'big';
                player.height = 50;
                player.y -= 10; // Adjust position so player doesn't sink into platform
                player.speed = 3.5;
                player.jumpPower = 14;
            }
            break;
            
        case 'fireflower':
            player.powerUpState = 'fire';
            if (player.height < 50) {
                player.height = 50;
                player.y -= 10;
            }
            player.speed = 4;
            player.jumpPower = 15;
            player.color = '#FF4500'; // Orange-red for fire Mario
            break;
            
        case 'star':
            player.starPower = true;
            player.starTimer = 600; // 10 seconds at 60 FPS
            player.invincible = true;
            break;
    }
}

// Update power-up timers
function updatePowerUpTimers() {
    // Star power timer
    if (player.starPower) {
        player.starTimer--;
        if (player.starTimer <= 0) {
            player.starPower = false;
            player.invincible = false;
        }
    }
    
    // Invincibility timer (for damage)
    if (player.invincible && !player.starPower) {
        player.invincibleTimer--;
        if (player.invincibleTimer <= 0) {
            player.invincible = false;
        }
    }
}

// Update player physics
function updatePlayer() {
    if (!gameState.gameRunning) return;
    
    // Apply gravity
    player.velocityY += gravity;
    
    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    
    // Reset onGround flag
    player.onGround = false;
    
    // Platform collision
    checkPlatformCollisions();
    
    // Moving platform collision
    checkMovingPlatformCollisions();
    
    // Enemy collision
    checkEnemyCollisions();
    
    // Coin collision
    checkCoinCollisions();
    
    // Power-up collision
    checkPowerUpCollisions();
    
    // Breakable blocks
    checkBreakableBlocks();
    
    // Secret areas
    checkSecretAreas();
    
    // Update power-up timers
    updatePowerUpTimers();
    
    // Check if player fell off the screen
    if (player.y > canvas.height) {
        loseLife();
    }
}

// Update enemies
function updateEnemies() {
    for (let enemy of enemies) {
        switch (enemy.type) {
            case 'goomba':
                updateGoomba(enemy);
                break;
            case 'koopa':
                updateKoopa(enemy);
                break;
            case 'flying':
                updateFlyingEnemy(enemy);
                break;
            case 'boss':
                updateBossEnemy(enemy);
                break;
            case 'koopa_shell':
                updateKoopaShell(enemy);
                break;
        }
    }
}

// Update Goomba enemy (basic walking)
function updateGoomba(enemy) {
    enemy.x += enemy.velocityX;
    
    // Reverse direction at platform edges or walls
    let onPlatform = false;
    for (let platform of platforms) {
        if (enemy.x + enemy.width > platform.x && 
            enemy.x < platform.x + platform.width &&
            enemy.y + enemy.height >= platform.y - 5 &&
            enemy.y + enemy.height <= platform.y + 5) {
            onPlatform = true;
            break;
        }
    }
    
    if (!onPlatform || enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.velocityX *= -1;
    }
}

// Update Koopa enemy (faster, bounces off walls)
function updateKoopa(enemy) {
    enemy.x += enemy.velocityX;
    
    // Koopas are faster and more aggressive
    let onPlatform = false;
    for (let platform of platforms) {
        if (enemy.x + enemy.width > platform.x && 
            enemy.x < platform.x + platform.width &&
            enemy.y + enemy.height >= platform.y - 5 &&
            enemy.y + enemy.height <= platform.y + 5) {
            onPlatform = true;
            break;
        }
    }
    
    if (!onPlatform || enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.velocityX *= -1;
        // Koopas speed up slightly when they change direction
        enemy.velocityX *= 1.1;
        if (Math.abs(enemy.velocityX) > 2) {
            enemy.velocityX = enemy.velocityX > 0 ? 2 : -2;
        }
    }
}

// Update Flying enemy (flies in sine wave pattern)
function updateFlyingEnemy(enemy) {
    enemy.x += enemy.velocityX;
    enemy.y += enemy.velocityY;
    
    // Flying pattern - sine wave movement
    const amplitude = 30;
    const frequency = 0.02;
    enemy.y = enemy.originalY + Math.sin(Date.now() * frequency + enemy.x * 0.01) * amplitude;
    
    // Reverse direction at screen edges
    if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.velocityX *= -1;
    }
    
    // Keep within vertical bounds
    if (enemy.y < 50) enemy.y = 50;
    if (enemy.y > canvas.height - 100) enemy.y = canvas.height - 100;
}

// Update Boss enemy (larger, more health, special behavior)
function updateBossEnemy(enemy) {
    enemy.x += enemy.velocityX;
    
    // Boss has special movement pattern
    if (!enemy.moveTimer) enemy.moveTimer = 0;
    enemy.moveTimer++;
    
    // Change direction every 120 frames (2 seconds)
    if (enemy.moveTimer >= 120) {
        enemy.velocityX *= -1;
        enemy.moveTimer = 0;
        
        // Boss occasionally jumps
        if (Math.random() < 0.3) {
            enemy.velocityY = -8;
        }
    }
    
    // Apply gravity to boss
    if (!enemy.velocityY) enemy.velocityY = 0;
    enemy.velocityY += gravity;
    enemy.y += enemy.velocityY;
    
    // Boss platform collision
    for (let platform of platforms) {
        if (isColliding(enemy, platform)) {
            if (enemy.velocityY > 0 && enemy.y < platform.y) {
                enemy.y = platform.y - enemy.height;
                enemy.velocityY = 0;
            }
        }
    }
    
    // Keep boss in bounds
    if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.velocityX *= -1;
    }
    if (enemy.y > canvas.height) {
        enemy.y = canvas.height - enemy.height;
        enemy.velocityY = 0;
    }
}

// Update Koopa Shell (can be kicked around)
function updateKoopaShell(enemy) {
    enemy.x += enemy.velocityX;
    
    // Apply friction to slow down shell
    enemy.velocityX *= 0.98;
    
    // Stop shell if moving too slowly
    if (Math.abs(enemy.velocityX) < 0.1) {
        enemy.velocityX = 0;
    }
    
    // Bounce off walls
    if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
        enemy.velocityX *= -0.8;
    }
    
    // Shell can defeat other enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        let otherEnemy = enemies[i];
        if (otherEnemy !== enemy && isColliding(enemy, otherEnemy) && Math.abs(enemy.velocityX) > 1) {
            enemies.splice(i, 1);
            gameState.score += 100;
            createDeathParticles(otherEnemy.x + otherEnemy.width/2, otherEnemy.y + otherEnemy.height/2);
            playSound('enemyDefeat');
            updateScore();
        }
    }
}

// Update particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityY += 0.3; // gravity
        particle.life--;
        
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
} 
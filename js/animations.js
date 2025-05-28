// Animation system for sprites and visual effects

// Update all animations
function updateAnimations() {
    // Update player animation
    updatePlayerAnimation();
    
    // Update enemy animations
    for (let enemy of enemies) {
        updateEnemyAnimation(enemy);
    }
    
    // Update coin animations
    for (let coin of coins) {
        updateCoinAnimation(coin);
    }
    
    // Update power-up animations
    for (let powerUp of powerUps) {
        updatePowerUpAnimation(powerUp);
    }
}

// Update player animation
function updatePlayerAnimation() {
    player.animationTimer++;
    
    // Determine player state
    player.isWalking = Math.abs(player.velocityX) > 0.1 && player.onGround;
    player.isJumping = !player.onGround;
    
    // Walking animation (4 frames, change every 8 game frames)
    if (player.isWalking) {
        if (player.animationTimer >= 8) {
            player.animationFrame = (player.animationFrame + 1) % 4;
            player.animationTimer = 0;
        }
    } else {
        player.animationFrame = 0;
        player.animationTimer = 0;
    }
}

// Update enemy animation
function updateEnemyAnimation(enemy) {
    enemy.animationTimer++;
    
    switch (enemy.type) {
        case 'goomba':
            // Basic walking animation (2 frames)
            if (enemy.animationTimer >= 15) {
                enemy.animationFrame = (enemy.animationFrame + 1) % 2;
                enemy.animationTimer = 0;
            }
            break;
            
        case 'koopa':
            // Koopa walking animation (3 frames, faster)
            if (enemy.animationTimer >= 10) {
                enemy.animationFrame = (enemy.animationFrame + 1) % 3;
                enemy.animationTimer = 0;
            }
            break;
            
        case 'flying':
            // Flying animation (4 frames, wing flapping)
            if (enemy.animationTimer >= 8) {
                enemy.animationFrame = (enemy.animationFrame + 1) % 4;
                enemy.animationTimer = 0;
            }
            break;
            
        case 'boss':
            // Boss animation (2 frames, slower)
            if (enemy.animationTimer >= 20) {
                enemy.animationFrame = (enemy.animationFrame + 1) % 2;
                enemy.animationTimer = 0;
            }
            break;
            
        case 'koopa_shell':
            // Shell spinning animation when moving
            if (Math.abs(enemy.velocityX) > 0.5) {
                if (enemy.animationTimer >= 5) {
                    enemy.animationFrame = (enemy.animationFrame + 1) % 4;
                    enemy.animationTimer = 0;
                }
            } else {
                enemy.animationFrame = 0;
            }
            break;
    }
}

// Update coin animation
function updateCoinAnimation(coin) {
    if (coin.collected) return;
    
    coin.animationTimer++;
    
    // Coin spinning animation (8 frames, change every 6 game frames)
    if (coin.animationTimer >= 6) {
        coin.animationFrame = (coin.animationFrame + 1) % 8;
        coin.animationTimer = 0;
    }
}

// Update power-up animation
function updatePowerUpAnimation(powerUp) {
    if (powerUp.collected) return;
    
    powerUp.animationTimer++;
    
    // Different animations for different power-ups
    switch (powerUp.type) {
        case 'mushroom':
            // Simple bobbing animation
            if (powerUp.animationTimer >= 10) {
                powerUp.animationFrame = (powerUp.animationFrame + 1) % 2;
                powerUp.animationTimer = 0;
            }
            break;
            
        case 'fireflower':
            // Color changing animation
            if (powerUp.animationTimer >= 8) {
                powerUp.animationFrame = (powerUp.animationFrame + 1) % 4;
                powerUp.animationTimer = 0;
            }
            break;
            
        case 'star':
            // Fast spinning animation
            if (powerUp.animationTimer >= 4) {
                powerUp.animationFrame = (powerUp.animationFrame + 1) % 8;
                powerUp.animationTimer = 0;
            }
            // Star bounces around
            powerUp.x += powerUp.velocityX;
            powerUp.y += powerUp.velocityY;
            powerUp.velocityY += 0.3; // gravity
            
            // Bounce off platforms
            for (let platform of platforms) {
                if (isColliding(powerUp, platform)) {
                    if (powerUp.velocityY > 0) {
                        powerUp.y = platform.y - powerUp.height;
                        powerUp.velocityY = -8;
                    }
                }
            }
            
            // Bounce off walls
            if (powerUp.x <= 0 || powerUp.x + powerUp.width >= canvas.width) {
                powerUp.velocityX *= -1;
            }
            break;
    }
} 
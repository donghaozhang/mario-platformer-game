// Rendering system for all game graphics

// Main render function
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Draw platforms
    drawPlatforms();
    
    // Draw moving platforms
    drawMovingPlatforms();
    
    // Draw breakable blocks
    drawBreakableBlocks();
    
    // Draw coins
    drawCoins();
    
    // Draw enemies
    drawEnemies();
    
    // Draw power-ups
    drawPowerUps();
    
    // Draw player
    drawPlayer();
    
    // Draw fireballs
    drawFireballs();
    
    // Draw particles
    drawParticles();
}

// Draw background with gradient and clouds
function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw clouds
    drawCloud(100, 50);
    drawCloud(300, 80);
    drawCloud(500, 40);
    drawCloud(650, 70);
}

// Draw a simple cloud
function drawCloud(x, y) {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

// Draw platforms with animated textures
function drawPlatforms() {
    for (let platform of platforms) {
        drawAnimatedPlatform(platform);
    }
}

// Draw animated platform with texture
function drawAnimatedPlatform(platform) {
    ctx.fillStyle = platform.color;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    // Add texture based on platform type
    if (platform.type === 'ground') {
        // Grass texture for ground platforms
        ctx.fillStyle = '#228B22';
        for (let i = 0; i < platform.width; i += 10) {
            ctx.fillRect(platform.x + i, platform.y, 2, 5);
            ctx.fillRect(platform.x + i + 3, platform.y, 1, 3);
            ctx.fillRect(platform.x + i + 6, platform.y, 2, 4);
        }
    } else if (platform.type === 'floating') {
        // Brick pattern for floating platforms
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        for (let i = 0; i < platform.width; i += 20) {
            for (let j = 0; j < platform.height; j += 10) {
                ctx.strokeRect(platform.x + i, platform.y + j, 20, 10);
            }
        }
    }
}

// Draw moving platforms
function drawMovingPlatforms() {
    for (let platform of movingPlatforms) {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Add glow effect
        ctx.shadowColor = platform.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.shadowBlur = 0;
    }
}

// Draw breakable blocks
function drawBreakableBlocks() {
    for (let block of breakableBlocks) {
        if (!block.broken) {
            ctx.fillStyle = block.color;
            ctx.fillRect(block.x, block.y, block.width, block.height);
            
            // Add question mark or brick pattern
            ctx.fillStyle = '#000000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('?', block.x + block.width/2, block.y + block.height/2 + 4);
        }
    }
}

// Draw player with detailed sprite
function drawPlayer() {
    // Star power rainbow effect
    if (player.starPower) {
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
        player.color = colors[Math.floor(Date.now() / 100) % colors.length];
    } else {
        // Normal color based on power-up state
        switch (player.powerUpState) {
            case 'small': player.color = '#FF0000'; break;
            case 'big': player.color = '#FF0000'; break;
            case 'fire': player.color = '#FF4500'; break;
        }
    }
    
    // Invincibility flashing
    if (player.invincible && !player.starPower && Math.floor(Date.now() / 100) % 2) {
        return; // Skip drawing for flashing effect
    }
    
    if (player.isJumping) {
        drawPlayerJumping();
    } else if (player.isWalking) {
        drawPlayerWalking();
    } else {
        drawPlayerIdle();
    }
}

// Draw idle player
function drawPlayerIdle() {
    // Body
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x + 5, player.y + 10, player.width - 10, player.height - 15);
    
    // Head
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(player.x + 8, player.y, player.width - 16, 15);
    
    // Hat
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x + 6, player.y, player.width - 12, 8);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 10, player.y + 5, 2, 2);
    ctx.fillRect(player.x + 18, player.y + 5, 2, 2);
    
    // Mustache
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(player.x + 12, player.y + 8, 6, 2);
    
    // Overalls
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(player.x + 7, player.y + 15, player.width - 14, 8);
    
    // Buttons
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(player.x + 9, player.y + 17, 2, 2);
    ctx.fillRect(player.x + 19, player.y + 17, 2, 2);
}

// Draw walking player with animation
function drawPlayerWalking() {
    const frame = player.animationFrame;
    
    // Body (slightly bobbing)
    const bobOffset = Math.sin(frame * 0.5) * 2;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x + 5, player.y + 10 + bobOffset, player.width - 10, player.height - 15);
    
    // Head
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(player.x + 8, player.y + bobOffset, player.width - 16, 15);
    
    // Hat
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x + 6, player.y + bobOffset, player.width - 12, 8);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 10, player.y + 5 + bobOffset, 2, 2);
    ctx.fillRect(player.x + 18, player.y + 5 + bobOffset, 2, 2);
    
    // Mustache
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(player.x + 12, player.y + 8 + bobOffset, 6, 2);
    
    // Overalls
    ctx.fillStyle = '#0000FF';
    ctx.fillRect(player.x + 7, player.y + 15 + bobOffset, player.width - 14, 8);
    
    // Animated legs
    const legOffset = Math.sin(frame * 1.5) * 3;
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(player.x + 8 + legOffset, player.y + player.height - 8, 4, 8);
    ctx.fillRect(player.x + 18 - legOffset, player.y + player.height - 8, 4, 8);
}

// Draw jumping player
function drawPlayerJumping() {
    // Body
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x + 5, player.y + 10, player.width - 10, player.height - 15);
    
    // Head
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(player.x + 8, player.y, player.width - 16, 15);
    
    // Hat
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(player.x + 6, player.y, player.width - 12, 8);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(player.x + 10, player.y + 5, 2, 2);
    ctx.fillRect(player.x + 18, player.y + 5, 2, 2);
    
    // Arms spread out
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(player.x, player.y + 12, 5, 3);
    ctx.fillRect(player.x + player.width - 5, player.y + 12, 5, 3);
    
    // Legs together
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(player.x + 10, player.y + player.height - 8, 10, 8);
}

// Draw enemies with animation
function drawEnemies() {
    for (let enemy of enemies) {
        drawAnimatedEnemy(enemy);
    }
}

// Draw animated enemy
function drawAnimatedEnemy(enemy) {
    switch (enemy.type) {
        case 'goomba':
            drawGoomba(enemy);
            break;
        case 'koopa':
            drawKoopa(enemy);
            break;
        case 'flying':
            drawFlyingEnemy(enemy);
            break;
        case 'boss':
            drawBossEnemy(enemy);
            break;
        case 'koopa_shell':
            drawKoopaShell(enemy);
            break;
    }
}

// Draw Goomba enemy
function drawGoomba(enemy) {
    const frame = enemy.animationFrame;
    const bounceOffset = Math.sin(frame * 3) * 2;
    
    // Body
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y + bounceOffset, enemy.width, enemy.height - bounceOffset);
    
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(enemy.x + 5, enemy.y + 5 + bounceOffset, 4, 4);
    ctx.fillRect(enemy.x + 16, enemy.y + 5 + bounceOffset, 4, 4);
    
    // Pupils
    ctx.fillStyle = '#000000';
    const pupilOffset = enemy.velocityX > 0 ? 2 : 0;
    ctx.fillRect(enemy.x + 6 + pupilOffset, enemy.y + 6 + bounceOffset, 2, 2);
    ctx.fillRect(enemy.x + 17 + pupilOffset, enemy.y + 6 + bounceOffset, 2, 2);
    
    // Angry eyebrows
    ctx.fillRect(enemy.x + 4, enemy.y + 3 + bounceOffset, 6, 1);
    ctx.fillRect(enemy.x + 15, enemy.y + 3 + bounceOffset, 6, 1);
    
    // Feet
    if (frame % 2 === 0) {
        ctx.fillStyle = '#654321';
        ctx.fillRect(enemy.x + 2, enemy.y + enemy.height - 3, 4, 3);
        ctx.fillRect(enemy.x + enemy.width - 6, enemy.y + enemy.height - 3, 4, 3);
    }
}

// Draw Koopa enemy
function drawKoopa(enemy) {
    const frame = enemy.animationFrame;
    
    // Shell body
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y + 5, enemy.width, enemy.height - 10);
    
    // Shell pattern
    ctx.fillStyle = '#006400';
    ctx.fillRect(enemy.x + 3, enemy.y + 8, enemy.width - 6, 3);
    ctx.fillRect(enemy.x + 5, enemy.y + 12, enemy.width - 10, 3);
    ctx.fillRect(enemy.x + 3, enemy.y + 16, enemy.width - 6, 3);
    
    // Head
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(enemy.x + 8, enemy.y, 10, 8);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 10, enemy.y + 2, 2, 2);
    ctx.fillRect(enemy.x + 14, enemy.y + 2, 2, 2);
    
    // Legs animation
    ctx.fillStyle = '#FFFF00';
    const legOffset = Math.sin(frame * 0.5) * 2;
    ctx.fillRect(enemy.x + 4 + legOffset, enemy.y + enemy.height - 5, 3, 5);
    ctx.fillRect(enemy.x + enemy.width - 7 - legOffset, enemy.y + enemy.height - 5, 3, 5);
}

// Draw Flying enemy
function drawFlyingEnemy(enemy) {
    const frame = enemy.animationFrame;
    
    // Body
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x + 5, enemy.y + 3, enemy.width - 10, enemy.height - 6);
    
    // Wings (animated)
    ctx.fillStyle = '#FFD700';
    const wingFlap = Math.sin(frame * 2) * 3;
    ctx.fillRect(enemy.x, enemy.y + wingFlap, 5, 8);
    ctx.fillRect(enemy.x + enemy.width - 5, enemy.y + wingFlap, 5, 8);
    
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(enemy.x + 7, enemy.y + 5, 3, 3);
    ctx.fillRect(enemy.x + 12, enemy.y + 5, 3, 3);
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 8, enemy.y + 6, 1, 1);
    ctx.fillRect(enemy.x + 13, enemy.y + 6, 1, 1);
}

// Draw Boss enemy
function drawBossEnemy(enemy) {
    const frame = enemy.animationFrame;
    
    // Body (larger)
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Crown
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(enemy.x + 5, enemy.y - 5, enemy.width - 10, 8);
    ctx.fillRect(enemy.x + 8, enemy.y - 8, 4, 3);
    ctx.fillRect(enemy.x + 15, enemy.y - 10, 4, 5);
    ctx.fillRect(enemy.x + 22, enemy.y - 8, 4, 3);
    
    // Eyes (larger)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(enemy.x + 8, enemy.y + 8, 6, 6);
    ctx.fillRect(enemy.x + 20, enemy.y + 8, 6, 6);
    
    // Pupils
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(enemy.x + 10, enemy.y + 10, 2, 2);
    ctx.fillRect(enemy.x + 22, enemy.y + 10, 2, 2);
    
    // Health indicator
    ctx.fillStyle = '#FF0000';
    const healthWidth = (enemy.health / enemy.maxHealth) * enemy.width;
    ctx.fillRect(enemy.x, enemy.y - 15, healthWidth, 3);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(enemy.x, enemy.y - 15, enemy.width, 3);
    
    // Spikes
    ctx.fillStyle = '#000000';
    for (let i = 0; i < enemy.width; i += 8) {
        ctx.fillRect(enemy.x + i, enemy.y + enemy.height, 3, 5);
    }
}

// Draw Koopa Shell
function drawKoopaShell(enemy) {
    const frame = enemy.animationFrame;
    
    // Shell body
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Shell pattern (spinning if moving)
    ctx.fillStyle = '#006400';
    if (Math.abs(enemy.velocityX) > 0.5) {
        // Spinning pattern
        const rotation = frame * 0.5;
        ctx.save();
        ctx.translate(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
        ctx.rotate(rotation);
        ctx.fillRect(-enemy.width/2 + 2, -enemy.height/2 + 2, enemy.width - 4, 2);
        ctx.fillRect(-enemy.width/2 + 2, 0, enemy.width - 4, 2);
        ctx.restore();
    } else {
        // Static pattern
        ctx.fillRect(enemy.x + 2, enemy.y + 3, enemy.width - 4, 2);
        ctx.fillRect(enemy.x + 2, enemy.y + 7, enemy.width - 4, 2);
        ctx.fillRect(enemy.x + 2, enemy.y + 11, enemy.width - 4, 2);
    }
}

// Draw coins with 3D spinning animation
function drawCoins() {
    for (let coin of coins) {
        if (!coin.collected) {
            drawAnimatedCoin(coin);
        }
    }
}

// Draw animated coin with 3D effect
function drawAnimatedCoin(coin) {
    const frame = coin.animationFrame;
    
    // 3D spinning effect
    const scaleX = Math.abs(Math.cos(frame * 0.3));
    const width = coin.width * scaleX;
    const offsetX = (coin.width - width) / 2;
    
    // Floating animation
    const floatOffset = Math.sin(Date.now() * 0.005 + coin.x * 0.01) * 3;
    
    // Coin body
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(coin.x + offsetX, coin.y + floatOffset, width, coin.height);
    
    // Shine effect when facing forward
    if (scaleX > 0.7) {
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(coin.x + offsetX + 2, coin.y + 2 + floatOffset, Math.max(1, width - 4), 3);
    }
    
    // Dollar sign when coin is sideways
    if (scaleX < 0.3) {
        ctx.fillStyle = '#B8860B';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('$', coin.x + coin.width/2, coin.y + coin.height/2 + 4 + floatOffset);
    }
    
    // Outer ring
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1;
    ctx.strokeRect(coin.x + offsetX, coin.y + floatOffset, width, coin.height);
}

// Draw power-ups with animations
function drawPowerUps() {
    for (let powerUp of powerUps) {
        if (!powerUp.collected) {
            drawAnimatedPowerUp(powerUp);
        }
    }
}

// Draw animated power-up
function drawAnimatedPowerUp(powerUp) {
    const frame = powerUp.animationFrame;
    
    switch (powerUp.type) {
        case 'mushroom':
            // Mushroom body
            ctx.fillStyle = '#8B4513';
            const bobOffset = Math.sin(frame * 0.5) * 2;
            ctx.fillRect(powerUp.x, powerUp.y + 10 + bobOffset, powerUp.width, powerUp.height - 10);
            
            // Mushroom cap
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(powerUp.x - 2, powerUp.y + bobOffset, powerUp.width + 4, 12);
            
            // White spots
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(powerUp.x + 3, powerUp.y + 3 + bobOffset, 3, 3);
            ctx.fillRect(powerUp.x + 14, powerUp.y + 5 + bobOffset, 3, 3);
            ctx.fillRect(powerUp.x + 8, powerUp.y + 7 + bobOffset, 2, 2);
            break;
            
        case 'fireflower':
            // Flower stem
            ctx.fillStyle = '#228B22';
            ctx.fillRect(powerUp.x + 8, powerUp.y + 10, 4, 10);
            
            // Flower petals with color animation
            const colors = ['#FF4500', '#FF6347', '#FF0000', '#DC143C'];
            ctx.fillStyle = colors[frame % colors.length];
            
            // Center
            ctx.fillRect(powerUp.x + 6, powerUp.y + 6, 8, 8);
            
            // Petals
            ctx.fillRect(powerUp.x + 2, powerUp.y + 8, 4, 4);
            ctx.fillRect(powerUp.x + 14, powerUp.y + 8, 4, 4);
            ctx.fillRect(powerUp.x + 8, powerUp.y + 2, 4, 4);
            ctx.fillRect(powerUp.x + 8, powerUp.y + 14, 4, 4);
            
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(powerUp.x + 7, powerUp.y + 8, 1, 1);
            ctx.fillRect(powerUp.x + 12, powerUp.y + 8, 1, 1);
            break;
            
        case 'star':
            // Star with spinning animation
            ctx.fillStyle = '#FFFF00';
            ctx.save();
            ctx.translate(powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2);
            ctx.rotate(frame * 0.2);
            
            // Draw star shape
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI) / 5;
                const x = Math.cos(angle) * 8;
                const y = Math.sin(angle) * 8;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            
            // Inner star
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI) / 5;
                const x = Math.cos(angle) * 4;
                const y = Math.sin(angle) * 4;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
            break;
    }
}

// Draw fireballs
function drawFireballs() {
    for (let fireball of player.fireballs) {
        const frame = fireball.animationFrame;
        
        // Fireball body with animation
        ctx.fillStyle = '#FF4500';
        ctx.fillRect(fireball.x, fireball.y, fireball.width, fireball.height);
        
        // Flame effect
        ctx.fillStyle = '#FF0000';
        if (frame % 2 === 0) {
            ctx.fillRect(fireball.x + 1, fireball.y + 1, fireball.width - 2, fireball.height - 2);
        }
        
        // Core
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(fireball.x + 2, fireball.y + 2, fireball.width - 4, fireball.height - 4);
    }
}

// Draw particles
function drawParticles() {
    for (let particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, 3, 3);
    }
} 
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

    // Draw weather effects
    drawWeather();
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

// Draw player with sprite support
function drawPlayer() {
    if (!player) return;
    
    ctx.save();
    
    // Apply transformations for facing direction
    if (player.facingLeft) {
        ctx.translate(player.x + player.width, player.y);
        ctx.scale(-1, 1);
        ctx.translate(-player.x, -player.y);
    }
    
    // Apply invincibility flashing
    if (player.invincible && Math.floor(Date.now() / 100) % 2) {
        ctx.globalAlpha = 0.5;
    }
    
    // Apply star power rainbow effect
    if (player.powerUp === 'star') {
        const time = Date.now() / 100;
        const hue = (time * 50) % 360;
        ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
        ctx.shadowBlur = 10;
    }
    
    // Scale player based on power-up
    const scale = player.powerUp === 'big' || player.powerUp === 'fire' ? 1.25 : 1;
    ctx.translate(player.x + player.width/2, player.y + player.height);
    ctx.scale(scale, scale);
    ctx.translate(-player.width/2, -player.height);
    
    // Draw Mario with detailed sprite
    const isJumping = player.velocityY !== 0;
    const isWalking = Math.abs(player.velocityX) > 0.1;
    const walkFrame = Math.floor(player.animationFrame / 5) % 4;
    
    // Body proportions
    const headSize = 12;
    const bodyHeight = 15;
    const legHeight = 13;
    
    // Colors based on power-up
    let hatColor = '#FF0000';
    let shirtColor = '#FF0000';
    let overallsColor = '#0000FF';
    
    if (player.powerUp === 'fire') {
        hatColor = '#FFFFFF';
        shirtColor = '#FFFFFF';
        overallsColor = '#FF0000';
    }
    
    // Draw legs with walking animation
    ctx.fillStyle = overallsColor;
    if (isWalking && !isJumping) {
        // Animated walking legs
        const legOffset = walkFrame < 2 ? 0 : 3;
        ctx.fillRect(5, bodyHeight + headSize, 8, legHeight - legOffset); // Left leg
        ctx.fillRect(17, bodyHeight + headSize + legOffset, 8, legHeight - legOffset); // Right leg
    } else if (isJumping) {
        // Jumping pose - spread legs
        ctx.fillRect(3, bodyHeight + headSize, 8, legHeight - 2); // Left leg
        ctx.fillRect(19, bodyHeight + headSize, 8, legHeight - 2); // Right leg
    } else {
        // Standing pose
        ctx.fillRect(7, bodyHeight + headSize, 7, legHeight); // Left leg
        ctx.fillRect(16, bodyHeight + headSize, 7, legHeight); // Right leg
    }
    
    // Draw shoes
    ctx.fillStyle = '#8B4513'; // Brown shoes
    if (isWalking && !isJumping) {
        const shoeOffset = walkFrame < 2 ? 0 : 3;
        ctx.fillRect(3, bodyHeight + headSize + legHeight - 3 - shoeOffset, 10, 3); // Left shoe
        ctx.fillRect(17, bodyHeight + headSize + legHeight - 3 + shoeOffset, 10, 3); // Right shoe
    } else {
        ctx.fillRect(5, bodyHeight + headSize + legHeight - 3, 9, 3); // Left shoe
        ctx.fillRect(16, bodyHeight + headSize + legHeight - 3, 9, 3); // Right shoe
    }
    
    // Draw body/overalls
    ctx.fillStyle = overallsColor;
    ctx.fillRect(6, headSize + 3, 18, bodyHeight - 3);
    
    // Draw shirt/chest area
    ctx.fillStyle = shirtColor;
    ctx.fillRect(8, headSize, 14, 8);
    
    // Draw arms
    ctx.fillStyle = '#FFDBAC'; // Skin color
    if (isJumping) {
        // Arms spread out when jumping
        ctx.fillRect(0, headSize + 2, 6, 10); // Left arm
        ctx.fillRect(24, headSize + 2, 6, 10); // Right arm
    } else if (isWalking) {
        // Swinging arms when walking
        const armSwing = walkFrame < 2 ? 0 : 2;
        ctx.fillRect(2 + armSwing, headSize + 4, 5, 8); // Left arm
        ctx.fillRect(23 - armSwing, headSize + 4, 5, 8); // Right arm
    } else {
        // Arms at sides
        ctx.fillRect(3, headSize + 4, 5, 8); // Left arm
        ctx.fillRect(22, headSize + 4, 5, 8); // Right arm
    }
    
    // Draw gloves
    ctx.fillStyle = '#FFFFFF';
    if (isJumping) {
        ctx.fillRect(0, headSize + 10, 6, 4); // Left glove
        ctx.fillRect(24, headSize + 10, 6, 4); // Right glove
    } else {
        ctx.fillRect(2, headSize + 10, 6, 4); // Left glove
        ctx.fillRect(22, headSize + 10, 6, 4); // Right glove
    }
    
    // Draw head
    ctx.fillStyle = '#FFDBAC'; // Skin color
    ctx.fillRect(7, 3, 16, headSize);
    
    // Draw hat
    ctx.fillStyle = hatColor;
    ctx.fillRect(5, 0, 20, 8);
    ctx.fillRect(7, 0, 16, 10); // Hat brim
    
    // Draw hat emblem (M)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(13, 2, 4, 1);
    ctx.fillRect(12, 3, 1, 3);
    ctx.fillRect(14, 3, 1, 2);
    ctx.fillRect(17, 3, 1, 3);
    
    // Draw hair sideburns
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(6, 8, 2, 4);
    ctx.fillRect(22, 8, 2, 4);
    
    // Draw eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 6, 2, 3);
    ctx.fillRect(18, 6, 2, 3);
    
    // Draw mustache
    ctx.fillStyle = '#000000';
    ctx.fillRect(9, 11, 12, 2);
    ctx.fillRect(8, 10, 14, 1);
    
    // Draw nose
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(14, 9, 3, 2);
    
    // Draw overall straps
    ctx.fillStyle = overallsColor;
    ctx.fillRect(9, headSize, 2, 4);
    ctx.fillRect(19, headSize, 2, 4);
    
    // Draw buttons on overalls
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(10, headSize + 8, 2, 2);
    ctx.fillRect(18, headSize + 8, 2, 2);
    
    ctx.restore();
}

// Draw enemies with sprite support
function drawEnemies() {
    for (let enemy of enemies) {
        if (enemy.defeated) continue;
        
        ctx.save();
        
        // Get appropriate sprite based on enemy type
        let spriteKey = `enemies_${enemy.type}`;
        const enemySprite = getAsset(spriteKey);
        
        if (enemySprite && enemySprite.width > 0) {
            // Draw sprite
            if (enemy.facingLeft) {
                ctx.scale(-1, 1);
                ctx.drawImage(enemySprite, -enemy.x - enemy.width, enemy.y, enemy.width, enemy.height);
            } else {
                ctx.drawImage(enemySprite, enemy.x, enemy.y, enemy.width, enemy.height);
            }
        } else {
            // Fallback to original drawing code based on enemy type
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
                case 'koopaShell':
                    drawKoopaShell(enemy);
                    break;
                default:
                    drawGoomba(enemy); // Default fallback
            }
        }
        
        ctx.restore();
    }
}

// Fallback drawing functions for enemies
function drawGoomba(enemy) {
    // Animation frame for walking
    const walkFrame = Math.floor(enemy.animationFrame / 10) % 2;
    const squashAmount = walkFrame * 2;
    
    // Mushroom body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(enemy.x + 2, enemy.y + 8 + squashAmount, enemy.width - 4, enemy.height - 8 - squashAmount);
    
    // Mushroom cap with gradient effect
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.ellipse(enemy.x + enemy.width/2, enemy.y + 10, enemy.width/2 - 2, 10 - squashAmount/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Cap highlight
    ctx.fillStyle = '#CD853F';
    ctx.beginPath();
    ctx.ellipse(enemy.x + enemy.width/2 - 3, enemy.y + 8, enemy.width/3, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Angry eyebrows
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 6, enemy.y + 5, 6, 2);
    ctx.fillRect(enemy.x + enemy.width - 12, enemy.y + 5, 6, 2);
    
    // Eyes with direction
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(enemy.x + 7, enemy.y + 8, 5, 5);
    ctx.fillRect(enemy.x + enemy.width - 12, enemy.y + 8, 5, 5);
    
    // Pupils looking in movement direction
    ctx.fillStyle = '#000000';
    const pupilOffset = enemy.velocityX > 0 ? 2 : 0;
    ctx.fillRect(enemy.x + 8 + pupilOffset, enemy.y + 9, 2, 3);
    ctx.fillRect(enemy.x + enemy.width - 11 + pupilOffset, enemy.y + 9, 2, 3);
    
    // Frown mouth
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(enemy.x + enemy.width/2, enemy.y + 18, 4, 0, Math.PI);
    ctx.stroke();
    
    // Feet with walking animation
    ctx.fillStyle = '#654321';
    if (walkFrame === 0) {
        ctx.fillRect(enemy.x + 2, enemy.y + enemy.height - 4, 6, 4);
        ctx.fillRect(enemy.x + enemy.width - 8, enemy.y + enemy.height - 4, 6, 4);
    } else {
        ctx.fillRect(enemy.x + 5, enemy.y + enemy.height - 4, 6, 4);
        ctx.fillRect(enemy.x + enemy.width - 11, enemy.y + enemy.height - 4, 6, 4);
    }
}

function drawKoopa(enemy) {
    const walkFrame = Math.floor(enemy.animationFrame / 8) % 4;
    const bobAmount = Math.sin(enemy.animationFrame * 0.1) * 2;
    
    // Shell back
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(enemy.x + enemy.width/2, enemy.y + 15 + bobAmount, enemy.width/2 - 2, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Shell pattern
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = 2;
    // Hexagon pattern on shell
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            ctx.strokeRect(enemy.x + 5 + i * 8, enemy.y + 10 + j * 8 + bobAmount, 6, 6);
        }
    }
    
    // Head and neck
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(enemy.x + 8, enemy.y + 2 + bobAmount, 14, 8);
    ctx.fillRect(enemy.x + 10, enemy.y + 8 + bobAmount, 10, 4);
    
    // Beak
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(enemy.x + 8, enemy.y + 5 + bobAmount);
    ctx.lineTo(enemy.x + 4, enemy.y + 7 + bobAmount);
    ctx.lineTo(enemy.x + 8, enemy.y + 9 + bobAmount);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(enemy.x + 12, enemy.y + 3 + bobAmount, 4, 4);
    ctx.fillRect(enemy.x + 17, enemy.y + 3 + bobAmount, 4, 4);
    
    // Pupils
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 13, enemy.y + 4 + bobAmount, 2, 2);
    ctx.fillRect(enemy.x + 18, enemy.y + 4 + bobAmount, 2, 2);
    
    // Feet with walking animation
    ctx.fillStyle = '#FFD700';
    const footOffset = walkFrame < 2 ? 0 : 3;
    ctx.fillRect(enemy.x + 3 + footOffset, enemy.y + enemy.height - 5, 6, 5);
    ctx.fillRect(enemy.x + enemy.width - 9 - footOffset, enemy.y + enemy.height - 5, 6, 5);
    
    // Tail
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(enemy.x + enemy.width - 4, enemy.y + 12 + bobAmount, 6, 4);
}

function drawFlyingEnemy(enemy) {
    const wingFlap = Math.sin(Date.now() * 0.02) * 5;
    const floatOffset = Math.sin(Date.now() * 0.005) * 3;
    
    // Main body (red koopa paratroopa style)
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.ellipse(enemy.x + enemy.width/2, enemy.y + enemy.height/2 + floatOffset, enemy.width/2 - 3, enemy.height/2 - 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Shell pattern
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(enemy.x + enemy.width/2, enemy.y + enemy.height/2 + floatOffset, enemy.width/2 - 5, enemy.height/2 - 7, 0, 0, Math.PI * 2);
    ctx.stroke();
    
    // Wings (animated)
    ctx.fillStyle = '#FFFFFF';
    // Left wing
    ctx.save();
    ctx.translate(enemy.x + 5, enemy.y + 8 + floatOffset);
    ctx.rotate(wingFlap * 0.02);
    ctx.beginPath();
    ctx.ellipse(-5, 0, 8, 4 + Math.abs(wingFlap)/2, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Right wing
    ctx.save();
    ctx.translate(enemy.x + enemy.width - 5, enemy.y + 8 + floatOffset);
    ctx.rotate(-wingFlap * 0.02);
    ctx.beginPath();
    ctx.ellipse(5, 0, 8, 4 + Math.abs(wingFlap)/2, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Wing details
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Head
    ctx.fillStyle = '#FFB6C1';
    ctx.fillRect(enemy.x + 8, enemy.y + 2 + floatOffset, 14, 8);
    
    // Goggles/Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 9, enemy.y + 3 + floatOffset, 5, 5);
    ctx.fillRect(enemy.x + 16, enemy.y + 3 + floatOffset, 5, 5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(enemy.x + 10, enemy.y + 4 + floatOffset, 3, 3);
    ctx.fillRect(enemy.x + 17, enemy.y + 4 + floatOffset, 3, 3);
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 11, enemy.y + 5 + floatOffset, 1, 1);
    ctx.fillRect(enemy.x + 18, enemy.y + 5 + floatOffset, 1, 1);
    
    // Beak
    ctx.fillStyle = '#FFA500';
    ctx.beginPath();
    ctx.moveTo(enemy.x + 8, enemy.y + 6 + floatOffset);
    ctx.lineTo(enemy.x + 5, enemy.y + 8 + floatOffset);
    ctx.lineTo(enemy.x + 8, enemy.y + 10 + floatOffset);
    ctx.fill();
}

function drawBossEnemy(enemy) {
    const pulseAmount = Math.sin(Date.now() * 0.003) * 2;
    const angryFlash = enemy.health < enemy.maxHealth / 2;
    
    // Spiky shell body
    const gradient = ctx.createRadialGradient(
        enemy.x + enemy.width/2, enemy.y + enemy.height/2,
        0,
        enemy.x + enemy.width/2, enemy.y + enemy.height/2,
        enemy.width/2
    );
    gradient.addColorStop(0, angryFlash ? '#FF1493' : '#8B008B');
    gradient.addColorStop(1, angryFlash ? '#8B0000' : '#4B0082');
    ctx.fillStyle = gradient;
    ctx.fillRect(enemy.x, enemy.y + 5, enemy.width, enemy.height - 5);
    
    // Spikes around the shell
    ctx.fillStyle = angryFlash ? '#FF0000' : '#9400D3';
    for (let i = 0; i < enemy.width; i += 10) {
        // Top spikes
        ctx.beginPath();
        ctx.moveTo(enemy.x + i, enemy.y + 5);
        ctx.lineTo(enemy.x + i + 5, enemy.y - 5 - pulseAmount);
        ctx.lineTo(enemy.x + i + 10, enemy.y + 5);
        ctx.fill();
        
        // Side spikes
        if (i % 20 === 0) {
            // Left spike
            ctx.beginPath();
            ctx.moveTo(enemy.x, enemy.y + i/2 + 10);
            ctx.lineTo(enemy.x - 5 - pulseAmount, enemy.y + i/2 + 15);
            ctx.lineTo(enemy.x, enemy.y + i/2 + 20);
            ctx.fill();
            
            // Right spike
            ctx.beginPath();
            ctx.moveTo(enemy.x + enemy.width, enemy.y + i/2 + 10);
            ctx.lineTo(enemy.x + enemy.width + 5 + pulseAmount, enemy.y + i/2 + 15);
            ctx.lineTo(enemy.x + enemy.width, enemy.y + i/2 + 20);
            ctx.fill();
        }
    }
    
    // Angry face
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(enemy.x + 10, enemy.y + 10, 10, 8);
    ctx.fillRect(enemy.x + enemy.width - 20, enemy.y + 10, 10, 8);
    
    // Glowing red eyes
    ctx.fillStyle = '#FF0000';
    ctx.shadowColor = '#FF0000';
    ctx.shadowBlur = 5;
    ctx.fillRect(enemy.x + 12, enemy.y + 12, 6, 4);
    ctx.fillRect(enemy.x + enemy.width - 18, enemy.y + 12, 6, 4);
    ctx.shadowBlur = 0;
    
    // Angry mouth
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 15, enemy.y + 25, enemy.width - 30, 3);
    // Teeth
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < enemy.width - 30; i += 5) {
        ctx.beginPath();
        ctx.moveTo(enemy.x + 15 + i, enemy.y + 25);
        ctx.lineTo(enemy.x + 17 + i, enemy.y + 28);
        ctx.lineTo(enemy.x + 19 + i, enemy.y + 25);
        ctx.fill();
    }
    
    // Health bar
    const barWidth = enemy.width;
    const barHeight = 6;
    const healthPercent = enemy.health / enemy.maxHealth;
    
    // Health bar background
    ctx.fillStyle = '#333333';
    ctx.fillRect(enemy.x, enemy.y - 10, barWidth, barHeight);
    
    // Health bar fill
    const healthGradient = ctx.createLinearGradient(enemy.x, 0, enemy.x + barWidth * healthPercent, 0);
    healthGradient.addColorStop(0, healthPercent > 0.5 ? '#00FF00' : healthPercent > 0.25 ? '#FFFF00' : '#FF0000');
    healthGradient.addColorStop(1, healthPercent > 0.5 ? '#00AA00' : healthPercent > 0.25 ? '#AAAA00' : '#AA0000');
    ctx.fillStyle = healthGradient;
    ctx.fillRect(enemy.x, enemy.y - 10, barWidth * healthPercent, barHeight);
    
    // Health bar border
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(enemy.x, enemy.y - 10, barWidth, barHeight);
}

function drawKoopaShell(enemy) {
    const isMoving = Math.abs(enemy.velocityX) > 1;
    const spinAngle = isMoving ? Date.now() * 0.05 : 0;
    
    ctx.save();
    ctx.translate(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
    ctx.rotate(spinAngle);
    
    // Shell body
    const shellGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, enemy.width/2);
    shellGradient.addColorStop(0, '#32CD32');
    shellGradient.addColorStop(0.7, '#228B22');
    shellGradient.addColorStop(1, '#006400');
    ctx.fillStyle = shellGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, enemy.width/2, enemy.height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Shell pattern (hexagons)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
        const x = Math.cos(angle) * 8;
        const y = Math.sin(angle) * 8;
        ctx.beginPath();
        ctx.moveTo(x + 4, y);
        ctx.lineTo(x + 2, y + 3);
        ctx.lineTo(x - 2, y + 3);
        ctx.lineTo(x - 4, y);
        ctx.lineTo(x - 2, y - 3);
        ctx.lineTo(x + 2, y - 3);
        ctx.closePath();
        ctx.stroke();
    }
    
    // Motion blur effect when spinning fast
    if (isMoving) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, enemy.width/2 - 2, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    ctx.restore();
}

// Draw coins with 3D spinning effect and sprite support
function drawCoins() {
    for (let coin of coins) {
        if (coin.collected) continue;
        
        ctx.save();
        
        // Get coin sprite
        const coinSprite = getAsset('items_coin');
        
        if (coinSprite && coinSprite.width > 0) {
            // Use sprite with 3D effect
            const time = Date.now() / 100;
            const scale = Math.abs(Math.sin(time + coin.x * 0.01)) * 0.8 + 0.2;
            
            ctx.translate(coin.x + coin.width/2, coin.y + coin.height/2);
            ctx.scale(scale, 1);
            ctx.drawImage(coinSprite, -coin.width/2, -coin.height/2, coin.width, coin.height);
        } else {
            // Fallback to original 3D spinning effect
            const time = Date.now() / 100;
            const rotationPhase = (time + coin.x * 0.01) % (Math.PI * 2);
            const scale = Math.abs(Math.sin(rotationPhase)) * 0.8 + 0.2;
            
            // Floating animation
            const floatOffset = Math.sin(time * 2 + coin.x * 0.02) * 2;
            
            ctx.translate(coin.x + coin.width/2, coin.y + coin.height/2 + floatOffset);
            ctx.scale(scale, 1);
            
            // Draw coin based on rotation phase
            if (Math.cos(rotationPhase) > 0) {
                // Front face - golden
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(-coin.width/2, -coin.height/2, coin.width, coin.height);
                
                // Dollar sign
                ctx.fillStyle = '#B8860B';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('$', 0, 4);
                
                // Shine effect
                ctx.fillStyle = '#FFFF99';
                ctx.fillRect(-coin.width/2 + 2, -coin.height/2 + 2, coin.width/3, coin.height/4);
            } else {
                // Side/back view - darker gold
                ctx.fillStyle = '#B8860B';
                ctx.fillRect(-coin.width/2, -coin.height/2, coin.width, coin.height);
                
                // Edge details
                ctx.fillStyle = '#8B7355';
                ctx.fillRect(-coin.width/2, -coin.height/2, coin.width, 2);
                ctx.fillRect(-coin.width/2, coin.height/2 - 2, coin.width, 2);
            }
        }
        
        ctx.restore();
    }
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

// Draw weather effects
function drawWeather() {
    if (gameState.weather.type === 'rain') {
        for (let particle of gameState.weather.particles) {
            ctx.fillStyle = particle.color;
            ctx.fillRect(particle.x, particle.y, particle.width, particle.height);
        }
    }
    // Add other weather types like 'snow' here later
} 
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
    
    // Get appropriate sprite based on player state
    let spriteKey = 'player_idle';
    if (player.powerUp === 'big') {
        spriteKey = 'player_big';
    } else if (player.powerUp === 'fire') {
        spriteKey = 'player_fire';
    } else if (player.velocityY !== 0) {
        spriteKey = 'player_jump';
    } else if (Math.abs(player.velocityX) > 0.1) {
        spriteKey = 'player_walk';
    }
    
    // Try to get the sprite
    const sprite = getAsset(spriteKey);
    
    if (sprite && sprite.width > 0) {
        // Draw sprite
        if (player.facingLeft) {
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, -player.x - player.width, player.y, player.width, player.height);
        } else {
            ctx.drawImage(sprite, player.x, player.y, player.width, player.height);
        }
    } else {
        // Fallback to original drawing code
        // Apply invincibility flashing
        if (player.invincible && Math.floor(Date.now() / 100) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Apply star power rainbow effect
        if (player.powerUp === 'star') {
            const time = Date.now() / 100;
            const hue = (time * 50) % 360;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        } else if (player.powerUp === 'fire') {
            ctx.fillStyle = '#FF4500'; // Orange-red for fire Mario
        } else if (player.powerUp === 'big') {
            ctx.fillStyle = '#FF6B6B'; // Lighter red for big Mario
        } else {
            ctx.fillStyle = '#FF0000'; // Red for small Mario
        }
        
        // Draw player body
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Draw player details (hat, overalls, etc.)
        ctx.fillStyle = '#0000FF'; // Blue overalls
        ctx.fillRect(player.x + 5, player.y + 15, player.width - 10, player.height - 20);
        
        // Draw face
        ctx.fillStyle = '#FFDBAC'; // Skin color
        ctx.fillRect(player.x + 8, player.y + 5, player.width - 16, 12);
        
        // Draw hat
        ctx.fillStyle = '#FF0000'; // Red hat
        ctx.fillRect(player.x + 3, player.y, player.width - 6, 8);
        
        // Draw mustache
        ctx.fillStyle = '#8B4513'; // Brown mustache
        ctx.fillRect(player.x + 10, player.y + 12, player.width - 20, 3);
        
        // Animation effects
        if (player.animationFrame > 0) {
            // Walking animation - slight offset
            const offset = Math.sin(player.animationFrame * 0.3) * 2;
            ctx.translate(offset, 0);
        }
        
        if (player.velocityY !== 0) {
            // Jumping animation - spread arms
            ctx.fillStyle = '#FFDBAC';
            ctx.fillRect(player.x - 5, player.y + 10, 5, 8); // Left arm
            ctx.fillRect(player.x + player.width, player.y + 10, 5, 8); // Right arm
        }
    }
    
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
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(enemy.x, enemy.y + 5, enemy.width, enemy.height - 5);
    
    // Head
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(enemy.x + 2, enemy.y, enemy.width - 4, enemy.height - 8);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 5, enemy.y + 3, 2, 2);
    ctx.fillRect(enemy.x + enemy.width - 7, enemy.y + 3, 2, 2);
    
    // Feet
    ctx.fillStyle = '#654321';
    ctx.fillRect(enemy.x, enemy.y + enemy.height - 3, 5, 3);
    ctx.fillRect(enemy.x + enemy.width - 5, enemy.y + enemy.height - 3, 5, 3);
}

function drawKoopa(enemy) {
    // Shell
    ctx.fillStyle = '#228B22';
    ctx.fillRect(enemy.x + 2, enemy.y + 8, enemy.width - 4, enemy.height - 12);
    
    // Head
    ctx.fillStyle = '#FFFF99';
    ctx.fillRect(enemy.x + 4, enemy.y, enemy.width - 8, 12);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 6, enemy.y + 3, 2, 2);
    ctx.fillRect(enemy.x + enemy.width - 8, enemy.y + 3, 2, 2);
    
    // Feet
    ctx.fillStyle = '#FFFF99';
    ctx.fillRect(enemy.x, enemy.y + enemy.height - 4, 4, 4);
    ctx.fillRect(enemy.x + enemy.width - 4, enemy.y + enemy.height - 4, 4, 4);
}

function drawFlyingEnemy(enemy) {
    // Body
    ctx.fillStyle = '#FF8C00';
    ctx.fillRect(enemy.x + 3, enemy.y + 5, enemy.width - 6, enemy.height - 10);
    
    // Wings (animated)
    const wingFlap = Math.sin(Date.now() * 0.02) * 3;
    ctx.fillStyle = '#FFE4B5';
    ctx.fillRect(enemy.x, enemy.y + 3 + wingFlap, 3, 8);
    ctx.fillRect(enemy.x + enemy.width - 3, enemy.y + 3 - wingFlap, 3, 8);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(enemy.x + 5, enemy.y + 7, 2, 2);
    ctx.fillRect(enemy.x + enemy.width - 7, enemy.y + 7, 2, 2);
}

function drawBossEnemy(enemy) {
    // Body
    ctx.fillStyle = '#800080';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Health bar
    if (enemy.health < enemy.maxHealth) {
        const barWidth = enemy.width;
        const barHeight = 4;
        const healthPercent = enemy.health / enemy.maxHealth;
        
        // Background
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(enemy.x, enemy.y - 8, barWidth, barHeight);
        
        // Health
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(enemy.x, enemy.y - 8, barWidth * healthPercent, barHeight);
    }
    
    // Eyes
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(enemy.x + 8, enemy.y + 8, 4, 4);
    ctx.fillRect(enemy.x + enemy.width - 12, enemy.y + 8, 4, 4);
    
    // Spikes
    ctx.fillStyle = '#4B0082';
    for (let i = 0; i < enemy.width; i += 8) {
        ctx.fillRect(enemy.x + i, enemy.y - 3, 4, 3);
    }
}

function drawKoopaShell(enemy) {
    // Shell
    ctx.fillStyle = '#228B22';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Shell pattern
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(enemy.x + 2, enemy.y + 2, enemy.width - 4, enemy.height - 4);
    
    // Spinning effect if moving
    if (Math.abs(enemy.velocityX) > 1) {
        const spinLines = Math.floor(Date.now() / 50) % 4;
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 4; i++) {
            if (i === spinLines) {
                ctx.fillRect(enemy.x + i * (enemy.width / 4), enemy.y, 2, enemy.height);
            }
        }
    }
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
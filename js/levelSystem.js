// Level system with multiple unique levels
const levelData = {
    1: {
        name: "Green Hills",
        platforms: [
            // Ground platforms
            { x: 0, y: 370, width: 200, height: 30, color: '#8B4513', type: 'ground' },
            { x: 250, y: 370, width: 150, height: 30, color: '#8B4513', type: 'ground' },
            { x: 450, y: 370, width: 200, height: 30, color: '#8B4513', type: 'ground' },
            { x: 700, y: 370, width: 100, height: 30, color: '#8B4513', type: 'ground' },
            
            // Floating platforms
            { x: 150, y: 280, width: 100, height: 20, color: '#228B22', type: 'floating' },
            { x: 350, y: 250, width: 80, height: 20, color: '#228B22', type: 'floating' },
            { x: 500, y: 200, width: 120, height: 20, color: '#228B22', type: 'floating' },
            { x: 650, y: 150, width: 100, height: 20, color: '#228B22', type: 'floating' },
            
            // Higher platforms
            { x: 200, y: 150, width: 80, height: 20, color: '#32CD32', type: 'floating' },
            { x: 400, y: 100, width: 100, height: 20, color: '#32CD32', type: 'floating' }
        ],
        enemies: [
            { x: 300, y: 340, width: 25, height: 25, velocityX: -1, color: '#8B0000', type: 'goomba' },
            { x: 500, y: 340, width: 25, height: 25, velocityX: 0.8, color: '#228B22', type: 'koopa' },
            { x: 600, y: 170, width: 25, height: 25, velocityX: -0.6, color: '#8B0000', type: 'goomba' },
            { x: 150, y: 200, width: 20, height: 15, velocityX: 1, velocityY: -2, color: '#FF4500', type: 'flying', flyHeight: 200, originalY: 200 }
        ],
        coins: [
            { x: 180, y: 250, width: 15, height: 15, collected: false },
            { x: 380, y: 220, width: 15, height: 15, collected: false },
            { x: 530, y: 170, width: 15, height: 15, collected: false },
            { x: 680, y: 120, width: 15, height: 15, collected: false },
            { x: 230, y: 120, width: 15, height: 15, collected: false },
            { x: 750, y: 340, width: 15, height: 15, collected: false }
        ],
        powerUps: [
            { x: 320, y: 220, width: 20, height: 20, type: 'mushroom', collected: false },
            { x: 450, y: 170, width: 20, height: 20, type: 'fireflower', collected: false },
            { x: 620, y: 120, width: 20, height: 20, type: 'star', collected: false, velocityX: 2, velocityY: 0 }
        ],
        movingPlatforms: [
            { x: 300, y: 300, width: 80, height: 15, color: '#4169E1', velocityX: 1, minX: 250, maxX: 400 }
        ],
        breakableBlocks: [
            { x: 420, y: 320, width: 20, height: 20, color: '#CD853F', broken: false },
            { x: 440, y: 320, width: 20, height: 20, color: '#CD853F', broken: false }
        ],
        secretAreas: [
            { x: 100, y: 100, width: 50, height: 50, revealed: false, coins: 3 }
        ]
    },
    
    2: {
        name: "Underground Caverns",
        platforms: [
            // Ground level
            { x: 0, y: 370, width: 150, height: 30, color: '#696969', type: 'ground' },
            { x: 200, y: 370, width: 100, height: 30, color: '#696969', type: 'ground' },
            { x: 350, y: 370, width: 200, height: 30, color: '#696969', type: 'ground' },
            { x: 600, y: 370, width: 200, height: 30, color: '#696969', type: 'ground' },
            
            // Cave platforms
            { x: 100, y: 320, width: 60, height: 15, color: '#2F4F4F', type: 'floating' },
            { x: 250, y: 280, width: 80, height: 15, color: '#2F4F4F', type: 'floating' },
            { x: 400, y: 240, width: 100, height: 15, color: '#2F4F4F', type: 'floating' },
            { x: 550, y: 200, width: 120, height: 15, color: '#2F4F4F', type: 'floating' },
            
            // Stalactite platforms
            { x: 150, y: 180, width: 60, height: 15, color: '#708090', type: 'floating' },
            { x: 350, y: 140, width: 80, height: 15, color: '#708090', type: 'floating' },
            { x: 500, y: 100, width: 60, height: 15, color: '#708090', type: 'floating' }
        ],
        enemies: [
            { x: 250, y: 340, width: 25, height: 25, velocityX: -1.2, color: '#4B0082', type: 'goomba' },
            { x: 450, y: 340, width: 25, height: 25, velocityX: 1, color: '#228B22', type: 'koopa' },
            { x: 350, y: 210, width: 25, height: 25, velocityX: -0.8, color: '#FF4500', type: 'flying', flyHeight: 210, originalY: 210, velocityY: -1 },
            { x: 550, y: 170, width: 25, height: 25, velocityX: 0.6, color: '#4B0082', type: 'goomba' },
            { x: 700, y: 340, width: 30, height: 30, velocityX: -0.5, color: '#8B008B', type: 'boss', health: 3, maxHealth: 3 }
        ],
        coins: [
            { x: 130, y: 290, width: 15, height: 15, collected: false },
            { x: 280, y: 250, width: 15, height: 15, collected: false },
            { x: 430, y: 210, width: 15, height: 15, collected: false },
            { x: 580, y: 170, width: 15, height: 15, collected: false },
            { x: 180, y: 150, width: 15, height: 15, collected: false },
            { x: 380, y: 110, width: 15, height: 15, collected: false },
            { x: 530, y: 70, width: 15, height: 15, collected: false },
            { x: 720, y: 340, width: 15, height: 15, collected: false }
        ],
        powerUps: [
            { x: 280, y: 250, width: 20, height: 20, type: 'mushroom', collected: false },
            { x: 520, y: 170, width: 20, height: 20, type: 'fireflower', collected: false }
        ],
        movingPlatforms: [
            { x: 150, y: 250, width: 60, height: 15, color: '#4169E1', velocityX: 1.5, minX: 100, maxX: 200 },
            { x: 450, y: 180, width: 80, height: 15, color: '#4169E1', velocityX: -1, minX: 400, maxX: 500 }
        ],
        breakableBlocks: [
            { x: 320, y: 300, width: 20, height: 20, color: '#8B4513', broken: false },
            { x: 340, y: 300, width: 20, height: 20, color: '#8B4513', broken: false },
            { x: 360, y: 300, width: 20, height: 20, color: '#8B4513', broken: false },
            { x: 470, y: 220, width: 20, height: 20, color: '#8B4513', broken: false }
        ],
        secretAreas: [
            { x: 50, y: 250, width: 40, height: 40, revealed: false, coins: 5 },
            { x: 650, y: 150, width: 60, height: 60, revealed: false, coins: 4 }
        ]
    },
    
    3: {
        name: "Sky Castle",
        platforms: [
            // Cloud platforms
            { x: 0, y: 370, width: 120, height: 30, color: '#87CEEB', type: 'ground' },
            { x: 180, y: 320, width: 100, height: 20, color: '#B0E0E6', type: 'floating' },
            { x: 320, y: 270, width: 80, height: 20, color: '#B0E0E6', type: 'floating' },
            { x: 450, y: 220, width: 120, height: 20, color: '#B0E0E6', type: 'floating' },
            { x: 600, y: 170, width: 100, height: 20, color: '#B0E0E6', type: 'floating' },
            
            // Castle platforms
            { x: 150, y: 200, width: 60, height: 15, color: '#D3D3D3', type: 'floating' },
            { x: 280, y: 150, width: 80, height: 15, color: '#D3D3D3', type: 'floating' },
            { x: 420, y: 100, width: 100, height: 15, color: '#D3D3D3', type: 'floating' },
            { x: 550, y: 50, width: 120, height: 15, color: '#D3D3D3', type: 'floating' },
            
            // High towers
            { x: 700, y: 370, width: 100, height: 30, color: '#87CEEB', type: 'ground' },
            { x: 720, y: 300, width: 60, height: 20, color: '#B0E0E6', type: 'floating' },
            { x: 730, y: 230, width: 40, height: 20, color: '#B0E0E6', type: 'floating' }
        ],
        enemies: [
            { x: 200, y: 290, width: 25, height: 25, velocityX: -0.8, color: '#FF69B4', type: 'goomba' },
            { x: 350, y: 240, width: 25, height: 25, velocityX: 1, color: '#228B22', type: 'koopa' },
            { x: 480, y: 190, width: 25, height: 25, velocityX: -1.2, color: '#FF4500', type: 'flying', flyHeight: 190, originalY: 190, velocityY: -1.5 },
            { x: 630, y: 140, width: 25, height: 25, velocityX: 0.6, color: '#FF4500', type: 'flying', flyHeight: 140, originalY: 140, velocityY: -1 },
            { x: 750, y: 340, width: 25, height: 25, velocityX: -0.5, color: '#FF69B4', type: 'goomba' },
            { x: 400, y: 50, width: 35, height: 35, velocityX: -0.3, color: '#8B008B', type: 'boss', health: 5, maxHealth: 5 }
        ],
        coins: [
            { x: 210, y: 290, width: 15, height: 15, collected: false },
            { x: 350, y: 240, width: 15, height: 15, collected: false },
            { x: 480, y: 190, width: 15, height: 15, collected: false },
            { x: 630, y: 140, width: 15, height: 15, collected: false },
            { x: 180, y: 170, width: 15, height: 15, collected: false },
            { x: 310, y: 120, width: 15, height: 15, collected: false },
            { x: 450, y: 70, width: 15, height: 15, collected: false },
            { x: 580, y: 20, width: 15, height: 15, collected: false },
            { x: 750, y: 270, width: 15, height: 15, collected: false },
            { x: 750, y: 200, width: 15, height: 15, collected: false }
        ],
        powerUps: [
            { x: 220, y: 290, width: 20, height: 20, type: 'fireflower', collected: false },
            { x: 450, y: 190, width: 20, height: 20, type: 'star', collected: false, velocityX: 1.5, velocityY: 0 },
            { x: 600, y: 140, width: 20, height: 20, type: 'mushroom', collected: false }
        ],
        movingPlatforms: [
            { x: 100, y: 280, width: 60, height: 15, color: '#4169E1', velocityX: 2, minX: 50, maxX: 150 },
            { x: 380, y: 180, width: 80, height: 15, color: '#4169E1', velocityX: -1.5, minX: 350, maxX: 450 },
            { x: 650, y: 120, width: 60, height: 15, color: '#4169E1', velocityX: 1, minX: 600, maxX: 700 }
        ],
        breakableBlocks: [
            { x: 240, y: 280, width: 20, height: 20, color: '#FFD700', broken: false },
            { x: 260, y: 280, width: 20, height: 20, color: '#FFD700', broken: false },
            { x: 400, y: 200, width: 20, height: 20, color: '#FFD700', broken: false },
            { x: 420, y: 200, width: 20, height: 20, color: '#FFD700', broken: false },
            { x: 570, y: 130, width: 20, height: 20, color: '#FFD700', broken: false }
        ],
        secretAreas: [
            { x: 80, y: 200, width: 50, height: 50, revealed: false, coins: 6 },
            { x: 680, y: 80, width: 40, height: 40, revealed: false, coins: 8 }
        ]
    }
};

// Create level based on current level number
function createLevel() {
    const currentLevelData = levelData[gameState.level];
    
    if (!currentLevelData) {
        console.error(`Level ${gameState.level} not found!`);
        return;
    }
    
    // Reset weather
    gameState.weather.type = 'none';
    gameState.weather.particles = [];

    // Set weather based on level
    if (gameState.level === 2) { // Make it rain in Level 2 (Underground Caverns)
        gameState.weather.type = 'rain';
    }
    
    // Reset arrays
    platforms = [];
    enemies = [];
    coins = [];
    powerUps = [];
    movingPlatforms = [];
    breakableBlocks = [];
    secretAreas = [];
    
    // Load level data
    platforms = currentLevelData.platforms.map(p => ({...p}));
    enemies = currentLevelData.enemies.map(e => new Enemy(e));
    coins = currentLevelData.coins.map(c => ({
        ...c,
        animationFrame: 0,
        animationTimer: 0
    }));
    powerUps = currentLevelData.powerUps.map(p => ({
        ...p,
        animationFrame: 0,
        animationTimer: 0
    }));
    movingPlatforms = currentLevelData.movingPlatforms.map(p => ({...p}));
    breakableBlocks = currentLevelData.breakableBlocks.map(b => ({...b}));
    secretAreas = currentLevelData.secretAreas.map(s => ({...s}));
    
    console.log(`Level ${gameState.level}: ${currentLevelData.name} loaded!`);
}

// Update moving platforms
function updateMovingPlatforms() {
    for (let platform of movingPlatforms) {
        platform.x += platform.velocityX;
        
        // Reverse direction at boundaries
        if (platform.x <= platform.minX || platform.x + platform.width >= platform.maxX) {
            platform.velocityX *= -1;
        }
        
        // Keep within bounds
        if (platform.x < platform.minX) platform.x = platform.minX;
        if (platform.x + platform.width > platform.maxX) platform.x = platform.maxX - platform.width;
    }
}

// Check collision with moving platforms
function checkMovingPlatformCollisions() {
    for (let platform of movingPlatforms) {
        if (isColliding(player, platform)) {
            // Landing on top of platform
            if (player.velocityY > 0 && player.y < platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
                // Move player with platform
                player.x += platform.velocityX;
            }
        }
    }
}

// Break blocks when hit from below
function checkBreakableBlocks() {
    for (let i = breakableBlocks.length - 1; i >= 0; i--) {
        let block = breakableBlocks[i];
        if (!block.broken && isColliding(player, block)) {
            // Hit from below
            if (player.velocityY < 0 && player.y > block.y) {
                block.broken = true;
                breakableBlocks.splice(i, 1);
                
                // Add to regular platforms temporarily for collision
                platforms.push({
                    x: block.x,
                    y: block.y,
                    width: block.width,
                    height: block.height,
                    color: block.color,
                    type: 'broken'
                });
                
                // Create break particles
                createBlockBreakParticles(block.x + block.width/2, block.y + block.height/2);
                playSound('enemyDefeat'); // Use enemy defeat sound for breaking
                gameState.score += 25;
                updateScore();
                
                // Remove from platforms after a short delay
                setTimeout(() => {
                    platforms = platforms.filter(p => p.type !== 'broken' || 
                        !(p.x === block.x && p.y === block.y));
                }, 100);
            }
        }
    }
}

// Check secret areas
function checkSecretAreas() {
    for (let area of secretAreas) {
        if (!area.revealed && isColliding(player, area)) {
            area.revealed = true;
            
            // Add coins to the area
            for (let i = 0; i < area.coins; i++) {
                coins.push({
                    x: area.x + Math.random() * area.width,
                    y: area.y + Math.random() * area.height,
                    width: 15,
                    height: 15,
                    collected: false,
                    animationFrame: 0,
                    animationTimer: 0
                });
            }
            
            // Visual effect
            createSecretAreaParticles(area.x + area.width/2, area.y + area.height/2);
            playSound('coin');
            console.log(`Secret area discovered! ${area.coins} coins added!`);
        }
    }
}

// Get current level name
function getCurrentLevelName() {
    const currentLevelData = levelData[gameState.level];
    return currentLevelData ? currentLevelData.name : `Level ${gameState.level}`;
} 
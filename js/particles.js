// Particle effects system

// Create particle effects for jumping
function createJumpParticles() {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: player.x + player.width/2,
            y: player.y + player.height,
            velocityX: (Math.random() - 0.5) * 4,
            velocityY: Math.random() * -3,
            color: '#FFFFFF',
            life: 20
        });
    }
}

// Create particle effects for enemy death
function createDeathParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            velocityX: (Math.random() - 0.5) * 6,
            velocityY: Math.random() * -5 - 2,
            color: '#FF0000',
            life: 30
        });
    }
}

// Create particle effects for coin collection
function createCoinParticles(x, y) {
    for (let i = 0; i < 6; i++) {
        particles.push({
            x: x,
            y: y,
            velocityX: (Math.random() - 0.5) * 4,
            velocityY: Math.random() * -4 - 1,
            color: '#FFD700',
            life: 25
        });
    }
}

// Create particle effects for power-up collection
function createPowerUpParticles(x, y, type) {
    let color = '#FFD700';
    switch (type) {
        case 'mushroom': color = '#8B4513'; break;
        case 'fireflower': color = '#FF4500'; break;
        case 'star': color = '#FFFF00'; break;
    }
    
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            velocityX: (Math.random() - 0.5) * 6,
            velocityY: Math.random() * -6 - 2,
            color: color,
            life: 30
        });
    }
}

// Create particle effects for breaking blocks
function createBlockBreakParticles(x, y) {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x: x,
            y: y,
            velocityX: (Math.random() - 0.5) * 8,
            velocityY: Math.random() * -6 - 1,
            color: '#CD853F',
            life: 40
        });
    }
}

// Create particle effects for secret area discovery
function createSecretAreaParticles(x, y) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            velocityX: (Math.random() - 0.5) * 10,
            velocityY: Math.random() * -8 - 2,
            color: ['#FFD700', '#FFFF00', '#FFA500', '#FF69B4'][Math.floor(Math.random() * 4)],
            life: 50
        });
    }
} 
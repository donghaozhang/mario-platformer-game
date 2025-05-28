// Asset Loader Module
// Handles loading and managing game sprites and images

const assets = {
    images: {},
    loaded: false,
    loadingProgress: 0,
    totalAssets: 0,
    loadedAssets: 0
};

// Asset paths configuration
const assetPaths = {
    player: {
        idle: 'assets/sprites/player/mario_idle.png',
        walk: 'assets/sprites/player/mario_walk.png',
        jump: 'assets/sprites/player/mario_jump.png',
        big: 'assets/sprites/player/mario_big.png',
        fire: 'assets/sprites/player/mario_fire.png'
    },
    enemies: {
        goomba: 'assets/sprites/enemies/goomba.png',
        koopa: 'assets/sprites/enemies/koopa.png',
        flying: 'assets/sprites/enemies/flying_enemy.png',
        boss: 'assets/sprites/enemies/boss.png'
    },
    items: {
        coin: 'assets/sprites/items/coin.png',
        mushroom: 'assets/sprites/items/mushroom.png',
        fireFlower: 'assets/sprites/items/fire_flower.png',
        star: 'assets/sprites/items/star.png'
    },
    tiles: {
        grass: 'assets/tiles/grass_platform.png',
        brick: 'assets/tiles/brick_platform.png',
        breakable: 'assets/tiles/breakable_block.png'
    },
    backgrounds: {
        sky: 'assets/backgrounds/sky_background.png',
        clouds: 'assets/backgrounds/clouds.png',
        underground: 'assets/backgrounds/underground.png'
    }
};

// Load a single image
function loadImage(src, key) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            assets.images[key] = img;
            assets.loadedAssets++;
            assets.loadingProgress = (assets.loadedAssets / assets.totalAssets) * 100;
            console.log(`Loaded: ${key} (${Math.round(assets.loadingProgress)}%)`);
            resolve(img);
        };
        img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            // Create a fallback colored rectangle
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FF0000'; // Red fallback
            ctx.fillRect(0, 0, 32, 32);
            assets.images[key] = canvas;
            assets.loadedAssets++;
            assets.loadingProgress = (assets.loadedAssets / assets.totalAssets) * 100;
            resolve(canvas);
        };
        img.src = src;
    });
}

// Load all assets
async function loadAllAssets() {
    console.log('Starting asset loading...');
    
    const allAssets = [];
    
    // Flatten asset paths and create loading promises
    for (const category in assetPaths) {
        for (const item in assetPaths[category]) {
            const key = `${category}_${item}`;
            const src = assetPaths[category][item];
            allAssets.push({ key, src });
        }
    }
    
    assets.totalAssets = allAssets.length;
    assets.loadedAssets = 0;
    
    // Load all assets
    const loadPromises = allAssets.map(asset => loadImage(asset.src, asset.key));
    
    try {
        await Promise.all(loadPromises);
        assets.loaded = true;
        console.log('All assets loaded successfully!');
        return true;
    } catch (error) {
        console.error('Error loading assets:', error);
        assets.loaded = true; // Continue with fallbacks
        return false;
    }
}

// Get an asset by key
function getAsset(key) {
    return assets.images[key] || null;
}

// Check if assets are loaded
function areAssetsLoaded() {
    return assets.loaded;
}

// Get loading progress
function getLoadingProgress() {
    return assets.loadingProgress;
}

// Create placeholder assets (colored rectangles) for development
function createPlaceholderAssets() {
    const placeholders = {
        player_idle: '#FF6B6B',    // Red
        player_walk: '#FF6B6B',    // Red
        player_jump: '#FF6B6B',    // Red
        player_big: '#FF4757',     // Darker red
        player_fire: '#FF3742',    // Fire red
        enemies_goomba: '#8B4513', // Brown
        enemies_koopa: '#228B22',  // Green
        enemies_flying: '#FF8C00', // Orange
        enemies_boss: '#800080',   // Purple
        items_coin: '#FFD700',     // Gold
        items_mushroom: '#FF6347', // Tomato
        items_fireFlower: '#FF4500', // Orange red
        items_star: '#FFFF00',     // Yellow
        tiles_grass: '#32CD32',    // Lime green
        tiles_brick: '#A0522D',    // Sienna
        tiles_breakable: '#D2691E', // Chocolate
        backgrounds_sky: '#87CEEB', // Sky blue
        backgrounds_clouds: '#F0F8FF', // Alice blue
        backgrounds_underground: '#2F4F4F' // Dark slate gray
    };
    
    for (const [key, color] of Object.entries(placeholders)) {
        if (!assets.images[key]) {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 32, 32);
            assets.images[key] = canvas;
        }
    }
    
    console.log('Placeholder assets created');
}

// Initialize asset loading
async function initAssets() {
    // Create placeholders first
    createPlaceholderAssets();
    
    // Try to load real assets
    const success = await loadAllAssets();
    
    if (!success) {
        console.log('Using placeholder assets');
    }
    
    return assets.loaded;
} 
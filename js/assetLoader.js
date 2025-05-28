// Asset Loader Module
// Provides placeholder graphics using pure JavaScript.  No external
// assets are loaded so the game can run out of the box.

const assets = {
    images: {},
    loaded: false,
    loadingProgress: 0
};


// Load a single image - not used when running with placeholders
function loadImage() {
    return Promise.resolve();
}

// Load all assets (noop - placeholders are used instead)
async function loadAllAssets() {
    assets.loaded = true;
    assets.loadingProgress = 100;
    return true;
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
    // Create placeholders
    createPlaceholderAssets();

    // No external files to load, but keep async signature
    await loadAllAssets();

    return assets.loaded;
}

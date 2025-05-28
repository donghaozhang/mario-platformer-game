// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
let gameState = {
    score: 0,
    lives: 3,
    coins: 0,
    level: 1,
    gameRunning: true,
    keys: {},
    maxLevel: 3
};

// Player object
const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    speed: 3,
    jumpPower: 12,
    onGround: false,
    color: '#FF0000',
    direction: 1, // 1 for right, -1 for left
    // Animation properties
    animationFrame: 0,
    animationTimer: 0,
    isWalking: false,
    isJumping: false,
    // Power-up properties
    powerUpState: 'small', // 'small', 'big', 'fire'
    invincible: false,
    invincibleTimer: 0,
    starPower: false,
    starTimer: 0,
    originalHeight: 40,
    fireballs: []
};

// Game objects arrays
let platforms = [];
let enemies = [];
let coins = [];
let particles = [];
let powerUps = [];
let movingPlatforms = [];
let breakableBlocks = [];
let secretAreas = [];

// Physics constants
const gravity = 0.6;
const friction = 0.85; 
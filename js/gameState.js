// Game canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Basic entity class for shared properties
class Entity {
    constructor(props = {}) {
        Object.assign(this, props);
    }
}

// Player represented as a class for clearer state management
class Player extends Entity {
    constructor() {
        super();
        this.reset();
    }

    reset() {
        this.x = 50;
        this.y = 300;
        this.width = 30;
        this.height = 40;
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 3;
        this.jumpPower = 12;
        this.onGround = false;
        this.color = '#FF0000';
        this.direction = 1; // 1 for right, -1 for left
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.isWalking = false;
        this.isJumping = false;
        this.powerUpState = 'small';
        this.invincible = false;
        this.invincibleTimer = 0;
        this.starPower = false;
        this.starTimer = 0;
        this.originalHeight = 40;
        this.fireballs = [];
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Enemy class to encapsulate enemy data
class Enemy extends Entity {
    constructor(props) {
        super(props);
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.facingLeft = this.velocityX < 0;
        this.defeated = false;
    }
}

// Game state
let gameState = {
    score: 0,
    lives: 3,
    coins: 0,
    level: 1,
    gameRunning: true,
    keys: {},
    maxLevel: 3,
    highScore: 0,
    weather: {
        type: 'none', // Can be 'rain', 'snow', etc.
        particles: []
    }
};

// Player instance
const player = new Player();

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

// High score management functions
function loadHighScore() {
    const savedHighScore = localStorage.getItem('marioGameHighScore');
    if (savedHighScore) {
        gameState.highScore = parseInt(savedHighScore);
    }
}

function saveHighScore() {
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('marioGameHighScore', gameState.highScore.toString());
        return true; // New high score achieved
    }
    return false;
}

function getHighScore() {
    return gameState.highScore;
} 